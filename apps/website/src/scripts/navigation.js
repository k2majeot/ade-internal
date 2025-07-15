function scroll(target) {
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth" });
}

function navigate(page, elementId = null) {
  const currentPath = window.location.pathname;

  if (currentPath !== page) {
    window.location.href = elementId ? `${page}#${elementId}` : page;
  } else if (elementId) {
    scroll(document.getElementById(elementId));
  }
}

function scrollToHash() {
  const hash = window.location.hash;
  if (hash) {
    const target = document.querySelector(hash);
    if (target) {
      scroll(target);
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  scrollToHash();

  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      navigate(el.dataset.page, el.dataset.elementId || null);
    });
  });

  if (window.location.hash) {
    history.replaceState(null, "", window.location.pathname);
  }
});
