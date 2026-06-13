from pathlib import Path
import shutil


ROOT = Path(__file__).resolve().parents[1]
DOCS_DIR = ROOT / "docs"

EXCLUDED_NAMES = {
    ".git",
    ".github",
    ".venv",
    ".vscode",
    "__pycache__",
    "docs",
    "site",
}


def lfs_suffixes() -> set[str]:
    suffixes: set[str] = set()
    for line in (ROOT / ".gitattributes").read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        pattern = line.split()[0]
        if pattern.startswith("*."):
            suffixes.add(pattern[1:].lower())
    return suffixes


def should_skip(path: Path) -> bool:
    rel = path.relative_to(ROOT)
    return any(part in EXCLUDED_NAMES for part in rel.parts)


def copy_repo_content() -> None:
    if DOCS_DIR.exists():
        shutil.rmtree(DOCS_DIR)
    DOCS_DIR.mkdir()

    for path in ROOT.iterdir():
        if path.name in EXCLUDED_NAMES:
            continue
        destination = DOCS_DIR / path.name
        if path.is_dir():
            shutil.copytree(path, destination, ignore=shutil.ignore_patterns(*EXCLUDED_NAMES))
        elif path.is_file():
            shutil.copy2(path, destination)


def build_asset_gallery() -> None:
    suffixes = lfs_suffixes()
    files = [
        path.relative_to(ROOT).as_posix()
        for path in ROOT.rglob("*")
        if path.is_file()
        and not should_skip(path)
        and path.suffix.lower() in suffixes
    ]

    images = sorted(
        path
        for path in files
        if Path(path).suffix.lower() in {".png", ".jpg", ".jpeg", ".gif", ".webp"}
    )
    pdfs = sorted(path for path in files if Path(path).suffix.lower() == ".pdf")
    videos = sorted(path for path in files if Path(path).suffix.lower() == ".mp4")
    archives = sorted(path for path in files if Path(path).suffix.lower() == ".zip")

    lines = [
        "# Git LFS Asset Gallery",
        "",
        "This page exposes the binary assets covered by `.gitattributes` so they are visible in the published MkDocs site. The GitHub Pages workflow checks out Git LFS content before building, which means these links and previews resolve to the actual assets rather than LFS pointer files.",
        "",
        f"- Images: {len(images)}",
        f"- PDFs: {len(pdfs)}",
        f"- Videos: {len(videos)}",
        f"- Archives: {len(archives)}",
        "",
    ]

    if images:
        lines.extend(["## Images", "", '<div class="asset-grid">'])
        for path in images:
            alt = Path(path).stem.replace("_", " ").replace("-", " ").strip() or path
            lines.append(
                f'<div class="asset-card"><a href="./{path}"><img src="./{path}" alt="{alt}"></a><a href="./{path}">{path}</a></div>'
            )
        lines.extend(["</div>", ""])

    if videos:
        lines.extend(["## Videos", ""])
        for path in videos:
            lines.append(
                f'<div class="asset-media"><video controls src="./{path}"></video><p><a href="./{path}">{path}</a></p></div>'
            )
        lines.append("")

    if pdfs:
        lines.extend(["## PDFs", "", '<ul class="asset-list">'])
        for path in pdfs:
            lines.append(f'<li><a href="./{path}">{path}</a></li>')
        lines.extend(["</ul>", ""])

    if archives:
        lines.extend(["## Archives", "", '<ul class="asset-list">'])
        for path in archives:
            lines.append(f'<li><a href="./{path}">{path}</a></li>')
        lines.extend(["</ul>", ""])

    (DOCS_DIR / "ASSETS.md").write_text("\n".join(lines) + "\n")


def main() -> None:
    copy_repo_content()
    build_asset_gallery()
    print(f"Prepared MkDocs source in {DOCS_DIR.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
