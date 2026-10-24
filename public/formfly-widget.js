(function () {
  "use strict";

  // Prevent multiple executions for the same script
  var script = document.currentScript;
  if (!script) {
    var scripts = document.getElementsByTagName("script");
    for (var s = scripts.length - 1; s >= 0; s--) {
      if (scripts[s].getAttribute("data-form-id")) {
        script = scripts[s];
        break;
      }
    }
  }

  if (!script) return;

  var formId = script.getAttribute("data-form-id");
  if (!formId) {
    console.error("FormFly widget: Missing required 'data-form-id' attribute on <script> tag.");
    return;
  }

  var baseUrl = script.getAttribute("data-base-url") || new URL(script.src, window.location.href).origin;
  var position = (script.getAttribute("data-position") || "bottom-right").toLowerCase();
  var isLeft = position === "bottom-left" || position === "left";
  var themeColor = script.getAttribute("data-theme") || script.getAttribute("data-color") || script.getAttribute("data-primary-color") || "#4f46e5";
  var btnText = script.getAttribute("data-btn-text") || script.getAttribute("data-label") || "Chat with us";
  var iconOnly = script.getAttribute("data-icon-only") === "true";
  var autoOpenMs = parseInt(script.getAttribute("data-auto-open") || "", 10);

  // Prevent duplicate widget for same form ID
  var existing = document.querySelector('[data-formfly-widget="' + formId + '"]');
  if (existing) return;

  // Inject CSS once
  if (!document.getElementById("formfly-widget-styles")) {
    var style = document.createElement("style");
    style.id = "formfly-widget-styles";
    style.textContent = [
      ".ff-widget-container {",
      "  position: fixed;",
      "  z-index: 2147483000;",
      "  bottom: 20px;",
      "  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;",
      "  -webkit-font-smoothing: antialiased;",
      "  box-sizing: border-box;",
      "  margin: 0;",
      "  padding: 0;",
      "}",
      ".ff-widget-container.ff-pos-right { right: 20px; }",
      ".ff-widget-container.ff-pos-left { left: 20px; }",
      ".ff-widget-launcher {",
      "  all: unset;",
      "  display: inline-flex !important;",
      "  align-items: center !important;",
      "  justify-content: center !important;",
      "  gap: 10px !important;",
      "  min-height: 50px !important;",
      "  padding: 0 20px !important;",
      "  border: none !important;",
      "  border-radius: 9999px !important;",
      "  color: #ffffff !important;",
      "  font-family: inherit !important;",
      "  font-size: 14px !important;",
      "  font-weight: 600 !important;",
      "  line-height: 1 !important;",
      "  cursor: pointer !important;",
      "  box-shadow: 0 8px 26px rgba(0, 0, 0, 0.28), 0 2px 8px rgba(0, 0, 0, 0.15) !important;",
      "  transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease, opacity 0.2s ease !important;",
      "  user-select: none !important;",
      "  -webkit-tap-highlight-color: transparent !important;",
      "}",
      ".ff-widget-launcher:hover {",
      "  transform: translateY(-2px) scale(1.02) !important;",
      "  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.36) !important;",
      "}",
      ".ff-widget-launcher:active {",
      "  transform: translateY(0) scale(0.97) !important;",
      "}",
      ".ff-widget-launcher:focus-visible {",
      "  outline: 3px solid rgba(255, 255, 255, 0.7) !important;",
      "  outline-offset: 3px !important;",
      "}",
      ".ff-widget-launcher.ff-icon-only {",
      "  width: 52px !important;",
      "  height: 52px !important;",
      "  min-height: 52px !important;",
      "  padding: 0 !important;",
      "  border-radius: 50% !important;",
      "}",
      ".ff-widget-panel {",
      "  position: fixed !important;",
      "  z-index: 2147483001 !important;",
      "  bottom: 82px !important;",
      "  width: 390px !important;",
      "  max-width: calc(100vw - 32px) !important;",
      "  height: min(650px, calc(100vh - 100px)) !important;",
      "  max-height: calc(100vh - 100px) !important;",
      "  border: 1px solid rgba(255, 255, 255, 0.14) !important;",
      "  border-radius: 20px !important;",
      "  background: #090a0f !important;",
      "  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.05) !important;",
      "  overflow: hidden !important;",
      "  opacity: 0 !important;",
      "  visibility: hidden !important;",
      "  pointer-events: none !important;",
      "  transform: translateY(18px) scale(0.96) !important;",
      "  transition: opacity 0.24s cubic-bezier(0.16, 1, 0.3, 1), transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.24s !important;",
      "}",
      ".ff-widget-panel.ff-pos-right { right: 20px !important; transform-origin: bottom right !important; }",
      ".ff-widget-panel.ff-pos-left { left: 20px !important; transform-origin: bottom left !important; }",
      ".ff-widget-panel.ff-open {",
      "  opacity: 1 !important;",
      "  visibility: visible !important;",
      "  pointer-events: auto !important;",
      "  transform: translateY(0) scale(1) !important;",
      "}",
      ".ff-widget-iframe {",
      "  width: 100% !important;",
      "  height: 100% !important;",
      "  border: none !important;",
      "  display: block !important;",
      "  background: transparent !important;",
      "}",
      "@media (max-width: 640px) {",
      "  .ff-widget-container { bottom: 16px !important; }",
      "  .ff-widget-container.ff-pos-right { right: 16px !important; }",
      "  .ff-widget-container.ff-pos-left { left: 16px !important; }",
      "  .ff-widget-panel {",
      "    bottom: 76px !important;",
      "    right: 12px !important;",
      "    left: 12px !important;",
      "    width: auto !important;",
      "    max-width: none !important;",
      "    height: min(620px, calc(100dvh - 92px)) !important;",
      "    border-radius: 18px !important;",
      "    transform-origin: bottom center !important;",
      "  }",
      "}",
      "@media (max-width: 420px) {",
      "  .ff-widget-container { bottom: 12px !important; }",
      "  .ff-widget-container.ff-pos-right { right: 12px !important; }",
      "  .ff-widget-container.ff-pos-left { left: 12px !important; }",
      "  .ff-widget-launcher {",
      "    padding: 0 16px !important;",
      "    font-size: 13px !important;",
      "    min-height: 48px !important;",
      "  }",
      "  .ff-widget-panel {",
      "    right: 8px !important;",
      "    left: 8px !important;",
      "    bottom: 68px !important;",
      "    height: calc(100dvh - 80px) !important;",
      "    border-radius: 16px !important;",
      "  }",
      "}"
    ].join("\n");
    document.head.appendChild(style);
  }

  // Icons SVG markup
  var chatIconSvg =
    '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z"/>' +
    "</svg>";

  var closeIconSvg =
    '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
    '<line x1="18" y1="6" x2="6" y2="18"></line>' +
    '<line x1="6" y1="6" x2="18" y2="18"></line>' +
    "</svg>";

  // Create elements
  var container = document.createElement("div");
  container.className = "ff-widget-container " + (isLeft ? "ff-pos-left" : "ff-pos-right");
  container.setAttribute("data-formfly-widget", formId);

  var panel = document.createElement("div");
  panel.className = "ff-widget-panel " + (isLeft ? "ff-pos-left" : "ff-pos-right");
  panel.setAttribute("data-formfly-widget-panel", formId);
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "FormFly conversational form");
  panel.setAttribute("aria-hidden", "true");

  var isPreview = script.getAttribute("data-preview") === "true" || window.location.pathname.indexOf("/test-widget") !== -1;
  var embedQuery = "?embed=1" + (isPreview ? "&preview=1" : "");

  var frame = document.createElement("iframe");
  frame.className = "ff-widget-iframe";
  frame.title = "FormFly form";
  frame.src = new URL("/forms/" + encodeURIComponent(formId) + embedQuery, baseUrl).toString();
  frame.loading = "lazy";
  frame.setAttribute("allow", "clipboard-write");

  var button = document.createElement("button");
  button.type = "button";
  button.className = "ff-widget-launcher" + (iconOnly ? " ff-icon-only" : "");
  button.style.backgroundColor = themeColor;
  button.setAttribute("aria-haspopup", "dialog");
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-label", "Open form chat");

  var iconWrapper = document.createElement("span");
  iconWrapper.style.display = "inline-flex";
  iconWrapper.style.alignItems = "center";
  iconWrapper.style.justifyContent = "center";
  iconWrapper.innerHTML = chatIconSvg;

  var labelSpan = null;
  if (!iconOnly) {
    labelSpan = document.createElement("span");
    labelSpan.textContent = btnText;
  }

  button.appendChild(iconWrapper);
  if (labelSpan) button.appendChild(labelSpan);

  panel.appendChild(frame);
  container.appendChild(button);

  function openWidget() {
    panel.classList.add("ff-open");
    panel.setAttribute("aria-hidden", "false");
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-label", "Close form chat");
    iconWrapper.innerHTML = closeIconSvg;
    if (labelSpan) labelSpan.textContent = "Close";
    try {
      frame.focus();
    } catch (err) {
      void err;
    }
  }

  function closeWidget() {
    panel.classList.remove("ff-open");
    panel.setAttribute("aria-hidden", "true");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Open form chat");
    iconWrapper.innerHTML = chatIconSvg;
    if (labelSpan) labelSpan.textContent = btnText;
    button.focus();
  }

  function toggleWidget() {
    var isOpen = panel.classList.contains("ff-open");
    if (isOpen) {
      closeWidget();
    } else {
      openWidget();
    }
  }

  button.addEventListener("click", toggleWidget);

  // Close with Escape key
  function onKeyDown(event) {
    if (event.key === "Escape" && panel.classList.contains("ff-open")) {
      closeWidget();
    }
  }
  document.addEventListener("keydown", onKeyDown);

  // Listen for postMessage from the embedded form iframe
  function onMessage(event) {
    if (!event.data) return;
    if (event.data.type === "formfly:close") {
      closeWidget();
    } else if (event.data.type === "formfly:open") {
      openWidget();
    } else if (event.data.type === "formfly:submit_success") {
      var customEvt = new CustomEvent("formfly:submit", {
        detail: { formId: formId, payload: event.data },
      });
      window.dispatchEvent(customEvt);
    }
  }
  window.addEventListener("message", onMessage);

  function destroyWidget() {
    if (panel && panel.parentNode) panel.parentNode.removeChild(panel);
    if (container && container.parentNode) container.parentNode.removeChild(container);
    document.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("message", onMessage);
    button.removeEventListener("click", toggleWidget);
    if (window.FormFly && window.FormFly.instances) {
      delete window.FormFly.instances[formId];
    }
  }

  // Attach to DOM
  document.body.appendChild(panel);
  document.body.appendChild(container);

  // Auto-open if configured
  if (!isNaN(autoOpenMs) && autoOpenMs >= 0) {
    window.setTimeout(function () {
      openWidget();
    }, autoOpenMs);
  }

  // Expose global developer API
  window.FormFly = window.FormFly || {};
  window.FormFly.instances = window.FormFly.instances || {};
  window.FormFly.instances[formId] = {
    open: openWidget,
    close: closeWidget,
    toggle: toggleWidget,
    destroy: destroyWidget,
    isOpen: function () {
      return panel.classList.contains("ff-open");
    },
  };

  // Default global methods proxy to this widget if no formId given
  window.FormFly.open = function (id) {
    var inst = id ? window.FormFly.instances[id] : window.FormFly.instances[formId];
    if (inst) inst.open();
  };
  window.FormFly.close = function (id) {
    var inst = id ? window.FormFly.instances[id] : window.FormFly.instances[formId];
    if (inst) inst.close();
  };
  window.FormFly.toggle = function (id) {
    var inst = id ? window.FormFly.instances[id] : window.FormFly.instances[formId];
    if (inst) inst.toggle();
  };
  window.FormFly.destroy = function (id) {
    if (id) {
      if (window.FormFly.instances && window.FormFly.instances[id]) {
        window.FormFly.instances[id].destroy();
      }
    } else {
      if (window.FormFly.instances) {
        for (var key in window.FormFly.instances) {
          if (window.FormFly.instances[key] && window.FormFly.instances[key].destroy) {
            window.FormFly.instances[key].destroy();
          }
        }
      }
    }
  };
})();
