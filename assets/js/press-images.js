// Use publisher images where possible; fall back only for missing or blocked hotlinks.
(() => {
  const fallback = "/assets/img/portfolio/press-media.svg";
  document.querySelectorAll("img[data-press-image]").forEach((img) => {
    let retried = false;
    const onError = () => {
      if (retried) return;
      retried = true;
      img.removeAttribute("referrerpolicy");
      img.src = fallback;
    };
    img.addEventListener("error", onError);
    if (img.complete && img.naturalWidth === 0) onError();
  });
})();
