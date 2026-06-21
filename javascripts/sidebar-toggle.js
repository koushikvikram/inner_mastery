(function () {
  var STORAGE_KEY = "innerMastery.sidebarHidden";
  var READY_CLASS = "sidebar-toggle-ready";
  var HIDDEN_CLASS = "sidebar-hidden";

  function getSavedState() {
    try {
      return window.localStorage.getItem(STORAGE_KEY) === "true";
    } catch (error) {
      return false;
    }
  }

  function saveState(hidden) {
    try {
      window.localStorage.setItem(STORAGE_KEY, hidden ? "true" : "false");
    } catch (error) {
      // Ignore storage failures; the in-page toggle still works.
    }
  }

  function setHidden(button, hidden) {
    document.body.classList.toggle(HIDDEN_CLASS, hidden);
    button.setAttribute("aria-expanded", hidden ? "false" : "true");
    button.setAttribute("aria-label", hidden ? "Show side panel" : "Hide side panel");
    button.textContent = hidden ? "Show panel" : "Hide panel";
    saveState(hidden);
  }

  function initSidebarToggle() {
    if (document.body.classList.contains(READY_CLASS)) {
      return;
    }

    var sidebar = document.querySelector(".wy-nav-side");
    var content = document.querySelector(".wy-nav-content-wrap");
    if (!sidebar || !content) {
      return;
    }

    var button = document.createElement("button");
    button.type = "button";
    button.className = "site-sidebar-toggle";
    button.setAttribute("aria-controls", "site-navigation");

    sidebar.id = sidebar.id || "site-navigation";
    document.body.appendChild(button);
    document.body.classList.add(READY_CLASS);

    setHidden(button, getSavedState());

    button.addEventListener("click", function () {
      setHidden(button, !document.body.classList.contains(HIDDEN_CLASS));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSidebarToggle);
  } else {
    initSidebarToggle();
  }
})();
