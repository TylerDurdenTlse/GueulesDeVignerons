document.querySelectorAll('[data-fill]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    link.classList.add('is-filled');
    window.setTimeout(() => {
      window.location.href = link.href;
    }, 950);
  });
});