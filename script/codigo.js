const panel = document.getElementById("main_panel");
const buttons = document.querySelectorAll("[data-page]");

async function loadPage(name) {
  try {
    const res = await fetch(`content/${name}.html`);
    if (!res.ok) throw new Error(res.status);
    panel.innerHTML = await res.text();
    location.hash = name; // shareable/back-button friendly
  } catch {
    panel.innerHTML = "<p>No se pudo cargar el contenido.</p>";
  }
}

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    buttons.forEach((b) => b.classList.remove("btn-selected"));
    btn.classList.add("btn-selected");
    loadPage(btn.dataset.page);
  });
});

// restore state from URL hash on load, e.g. index.html#beneficios
const initial = location.hash.slice(1) || "inicio";
const first = document.querySelector(`[data-page="${initial}"]`);
if (first) first.click();

document.addEventListener("submit", async (e) => {
  const form = e.target.closest("form[data-ajax]");
  if (!form) return;
  e.preventDefault();
  const res = await fetch(form.action, {
    method: "POST",
    body: new FormData(form),
    headers: { Accept: "application/json" },
  });
  form.innerHTML = res.ok
    ? "<p>¡Mensaje enviado! Te responderemos pronto.</p>"
    : "<p>Hubo un error, intenta de nuevo.</p>";
});
