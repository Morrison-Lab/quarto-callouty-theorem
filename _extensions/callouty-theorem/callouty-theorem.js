// Makes the cross-reference link in a folding callout's header follow its link.
//
// With `title-ref: true` the header of a collapsible callout holds a link to the
// element's own id ("Example 1").
// The header carries Bootstrap's data-bs-toggle="collapse", and Bootstrap's click
// handler calls preventDefault on a click that lands on a link inside the toggle,
// so the click only folded the callout and readers could not get the element's URL.
// Bootstrap listens in the capture phase on document.
// This listener runs in the capture phase on window, which runs first, and stops the
// click there, so the browser follows the link and the address bar gains the #id.
// The rest of the header, and the chevron, still toggle the fold.
(function () {
  "use strict";

  var LABEL = ".callout-header .callout-title-container a.quarto-xref";

  window.addEventListener("click", function (event) {
    var target = event.target;
    if (target && target.closest && target.closest(LABEL)) {
      event.stopPropagation();
    }
  }, true);

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(LABEL).forEach(function (link) {
      var kind = link.textContent.trim().split(/[\s ]/)[0].toLowerCase();
      link.setAttribute("title", "Link to this " + kind);
    });
  });

  // Hover preview of a cross-reference whose target sits inside a callout.
  //
  // Quarto's preview copies the target's innerHTML, and a numbered theorem, example or
  // solution is a div inside the callout, so the preview showed bare content without the
  // callout's header, colour and bar.
  // Quarto also appends the preview to the link's parent, so a link in a callout header
  // passed the header's bold type on to the whole preview.
  // For such links this swaps the preview content for an open copy of the whole callout
  // and appends the preview to the body.
  function openCopy(callout) {
    var copy = callout.cloneNode(true);
    copy.removeAttribute("id");
    copy.querySelectorAll("[id]").forEach(function (el) { el.removeAttribute("id"); });
    copy.querySelectorAll(".callout-collapse").forEach(function (el) { el.classList.add("show"); });
    copy.querySelectorAll("[data-bs-toggle], [data-bs-target]").forEach(function (el) {
      el.removeAttribute("data-bs-toggle");
      el.removeAttribute("data-bs-target");
    });
    copy.querySelectorAll(".callout-btn-toggle").forEach(function (el) { el.remove(); });
    var box = document.createElement("div");
    box.appendChild(copy);
    if (window.Quarto && window.Quarto.typesetMath) {
      window.Quarto.typesetMath(box);
    }
    return box.innerHTML;
  }

  function patchPreviews() {
    document.querySelectorAll("a.quarto-xref").forEach(function (link) {
      var instance = link._tippy;
      var href = link.getAttribute("href") || "";
      if (!instance || href.charAt(0) !== "#" || !instance.props.onTrigger) {
        return;
      }
      var target = document.getElementById(href.slice(1));
      var callout = target && target.closest(".callout");
      if (!callout) {
        return;
      }
      var quartoTrigger = instance.props.onTrigger;
      instance.setProps({
        appendTo: function () { return document.body; },
        onTrigger: function (inst, event) {
          quartoTrigger(inst, event);
          inst.setContent(openCopy(callout));
        }
      });
    });
  }

  // Quarto creates the previews in an inline script at the end of the page.
  window.addEventListener("load", patchPreviews);
})();
