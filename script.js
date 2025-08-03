
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const closeModal = document.getElementById("close");

document.querySelectorAll(".course").forEach(course => {
  course.addEventListener("click", () => {
    const name = course.dataset.name;
    modalTitle.textContent = name;
    modalDescription.textContent = "Descripción de " + name;
    modal.classList.remove("hidden");
  });
});

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

window.addEventListener("click", e => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});
