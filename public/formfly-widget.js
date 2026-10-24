(function () {
  "use strict";

  var script = document.currentScript;
  if (!script) return;

  var formId = script.getAttribute("data-form-id");
  if (!formId) {
    console.error("FormFly widget: add a data-form-id to the script tag.");
    return;
  }

  var baseUrl = script.getAttribute("data-base-url") || new URL(script.src, window.location.href).origin;
  var existingWidgets = document.querySelectorAll("[data-formfly-widget]");
  for (var index = 0; index < existingWidgets.length; index += 1) {
    if (existingWidgets[index].getAttribute("data-formfly-widget") === formId) return;
  }

  var widget = document.createElement("div");
  widget.setAttribute("data-formfly-widget", formId);
  widget.style.cssText = "position:fixed;right:20px;bottom:20px;z-index:2147483000;font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif";

  var frame = document.createElement("iframe");
  frame.title = "FormFly form";
  frame.src = new URL("/forms/" + encodeURIComponent(formId) + "?embed=1", baseUrl).toString();
  frame.loading = "lazy";
  frame.setAttribute("allow", "clipboard-write");
  frame.style.cssText = "position:absolute;right:0;bottom:72px;width:380px;height:min(680px,calc(100vh - 108px));max-width:calc(100vw - 32px);border:1px solid rgba(148,163,184,.25);border-radius:18px;background:#090a0f;box-shadow:0 18px 60px rgba(0,0,0,.4);display:none";

  var button = document.createElement("button");
  button.type = "button";
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-label", "Open form chat");
  button.style.cssText = "display:flex;align-items:center;gap:10px;min-height:52px;padding:0 18px;border:0;border-radius:999px;background:#4f46e5;color:#fff;font-size:14px;font-weight:650;cursor:pointer;box-shadow:0 8px 26px rgba(79,70,229,.4)";
  button.innerHTML = '<svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z"/></svg><span>Chat with us</span>';

  button.addEventListener("click", function () {
    var isOpen = frame.style.display !== "none";
    frame.style.display = isOpen ? "none" : "block";
    button.setAttribute("aria-expanded", String(!isOpen));
    button.setAttribute("aria-label", isOpen ? "Open form chat" : "Close form chat");
    button.querySelector("span").textContent = isOpen ? "Chat with us" : "Close chat";
    if (!isOpen) frame.focus();
  });

  widget.appendChild(frame);
  widget.appendChild(button);
  document.body.appendChild(widget);
})();
