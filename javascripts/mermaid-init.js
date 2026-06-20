(function () {
  function renderMermaidBlocks() {
    var blocks = document.querySelectorAll("pre > code.language-mermaid");

    blocks.forEach(function (block, index) {
      var container = document.createElement("div");
      container.className = "mermaid";
      container.id = "mermaid-diagram-" + index;
      container.textContent = block.textContent;

      var pre = block.parentElement;
      pre.parentNode.replaceChild(container, pre);
    });

    if (window.mermaid) {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: "default",
        securityLevel: "loose"
      });
      window.mermaid.run();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderMermaidBlocks);
  } else {
    renderMermaidBlocks();
  }
})();
