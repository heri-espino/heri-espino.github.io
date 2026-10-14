// Reveal the text fallback when an external issuer icon cannot load.
// The markup remains legible even when JavaScript is disabled.
(() => {
  document.querySelectorAll("[data-credential-logo]").forEach((image) => {
    const hideBrokenIcon = () => {
      image.hidden = true;
    };

    image.addEventListener("error", hideBrokenIcon, { once: true });
    if (image.complete && image.naturalWidth === 0) hideBrokenIcon();
  });
})();
