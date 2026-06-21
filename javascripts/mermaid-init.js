(function () {
  var MIN_SCALE = 0.4;
  var MAX_SCALE = 4;
  var ZOOM_STEP = 1.2;
  var PAN_STEP = 48;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function createControl(action, text, label) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "mermaid-panzoom__button";
    button.dataset.action = action;
    button.setAttribute("aria-label", label);
    button.textContent = text;
    return button;
  }

  function createScaleLabel() {
    var label = document.createElement("span");
    label.className = "mermaid-panzoom__scale";
    label.setAttribute("aria-live", "polite");
    label.textContent = "100%";
    return label;
  }

  function renderMermaidBlocks() {
    var blocks = document.querySelectorAll("pre > code.language-mermaid");

    blocks.forEach(function (block, index) {
      var wrapper = document.createElement("div");
      wrapper.className = "mermaid-panzoom";

      var toolbar = document.createElement("div");
      toolbar.className = "mermaid-panzoom__toolbar";
      toolbar.setAttribute("aria-label", "Mermaid diagram controls");
      toolbar.appendChild(createControl("zoom-out", "-", "Zoom out"));
      toolbar.appendChild(createScaleLabel());
      toolbar.appendChild(createControl("zoom-in", "+", "Zoom in"));
      toolbar.appendChild(createControl("reset", "Reset", "Reset zoom and position"));

      var viewport = document.createElement("div");
      viewport.className = "mermaid-panzoom__viewport";
      viewport.tabIndex = 0;
      viewport.setAttribute("role", "group");
      viewport.setAttribute(
        "aria-label",
        "Interactive Mermaid diagram. Drag to pan, use the mouse wheel to zoom, or use the toolbar controls."
      );

      var container = document.createElement("div");
      container.className = "mermaid";
      container.id = "mermaid-diagram-" + index;
      container.textContent = block.textContent;

      viewport.appendChild(container);
      wrapper.appendChild(toolbar);
      wrapper.appendChild(viewport);

      var pre = block.parentElement;
      pre.parentNode.replaceChild(wrapper, pre);
    });

    if (window.mermaid) {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: "default",
        securityLevel: "loose"
      });

      var result = window.mermaid.run();
      if (result && typeof result.then === "function") {
        result.then(enablePanZoom).catch(function (error) {
          console.error("Unable to render Mermaid diagrams", error);
          enablePanZoom();
        });
      } else {
        enablePanZoom();
      }
    } else {
      enablePanZoom();
    }
  }

  function enablePanZoom() {
    document.querySelectorAll(".mermaid-panzoom").forEach(function (wrapper) {
      if (wrapper.dataset.panzoomReady === "true") {
        return;
      }

      var viewport = wrapper.querySelector(".mermaid-panzoom__viewport");
      var diagram = wrapper.querySelector(".mermaid");
      var scaleLabel = wrapper.querySelector(".mermaid-panzoom__scale");
      var controls = wrapper.querySelectorAll(".mermaid-panzoom__button");

      if (!viewport || !diagram) {
        return;
      }

      wrapper.dataset.panzoomReady = "true";

      var state = {
        scale: 1,
        x: 0,
        y: 0,
        dragging: false,
        pointerId: null,
        lastX: 0,
        lastY: 0
      };

      function update() {
        diagram.style.transform =
          "translate(" + state.x + "px, " + state.y + "px) scale(" + state.scale + ")";
        scaleLabel.textContent = Math.round(state.scale * 100) + "%";
        viewport.classList.toggle("is-dragging", state.dragging);
      }

      function zoomTo(nextScale, originX, originY) {
        nextScale = clamp(nextScale, MIN_SCALE, MAX_SCALE);

        var rect = viewport.getBoundingClientRect();
        var pointX = originX == null ? rect.width / 2 : originX - rect.left;
        var pointY = originY == null ? rect.height / 2 : originY - rect.top;
        var contentX = (pointX - state.x) / state.scale;
        var contentY = (pointY - state.y) / state.scale;

        state.x = pointX - contentX * nextScale;
        state.y = pointY - contentY * nextScale;
        state.scale = nextScale;
        update();
      }

      function reset() {
        state.scale = 1;
        state.x = 0;
        state.y = 0;
        update();
      }

      controls.forEach(function (control) {
        control.addEventListener("click", function () {
          if (control.dataset.action === "zoom-in") {
            zoomTo(state.scale * ZOOM_STEP);
          } else if (control.dataset.action === "zoom-out") {
            zoomTo(state.scale / ZOOM_STEP);
          } else if (control.dataset.action === "reset") {
            reset();
          }
        });
      });

      viewport.addEventListener(
        "wheel",
        function (event) {
          event.preventDefault();
          var nextScale = event.deltaY < 0 ? state.scale * ZOOM_STEP : state.scale / ZOOM_STEP;
          zoomTo(nextScale, event.clientX, event.clientY);
        },
        { passive: false }
      );

      viewport.addEventListener("pointerdown", function (event) {
        state.dragging = true;
        state.pointerId = event.pointerId;
        state.lastX = event.clientX;
        state.lastY = event.clientY;
        viewport.setPointerCapture(event.pointerId);
        update();
      });

      viewport.addEventListener("pointermove", function (event) {
        if (!state.dragging || state.pointerId !== event.pointerId) {
          return;
        }

        state.x += event.clientX - state.lastX;
        state.y += event.clientY - state.lastY;
        state.lastX = event.clientX;
        state.lastY = event.clientY;
        update();
      });

      function endDrag(event) {
        if (state.pointerId === event.pointerId) {
          state.dragging = false;
          state.pointerId = null;
          update();
        }
      }

      viewport.addEventListener("pointerup", endDrag);
      viewport.addEventListener("pointercancel", endDrag);

      viewport.addEventListener("keydown", function (event) {
        if (event.key === "+" || event.key === "=") {
          event.preventDefault();
          zoomTo(state.scale * ZOOM_STEP);
        } else if (event.key === "-") {
          event.preventDefault();
          zoomTo(state.scale / ZOOM_STEP);
        } else if (event.key === "0") {
          event.preventDefault();
          reset();
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          state.x += PAN_STEP;
          update();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          state.x -= PAN_STEP;
          update();
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          state.y += PAN_STEP;
          update();
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          state.y -= PAN_STEP;
          update();
        }
      });

      update();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderMermaidBlocks);
  } else {
    renderMermaidBlocks();
  }
})();
