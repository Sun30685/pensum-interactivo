const courses = {
  "Fundamentos de Administración": {
    details: "Introducción a los principios básicos de la administración.",
    link: "https://catalogo.uniandes.edu.co/"
  },
  "Contabilidad Financiera": {
    details: "Bases contables para el análisis financiero.",
    link: "https://catalogo.uniandes.edu.co/"
  },
  "Matemáticas": {
    details: "Curso de matemáticas básicas aplicadas a economía y administración.",
    link: "https://catalogo.uniandes.edu.co/"
  },
  "Lectura y Escritura Académica": {
    details: "Desarrollo de habilidades de lectura crítica y escritura académica.",
    link: "https://catalogo.uniandes.edu.co/"
  },
  "CBU": {
    details: "Curso de contexto universitario obligatorio.",
    link: "https://catalogo.uniandes.edu.co/"
  },
  "Deporte": {
    details: "Actividad física obligatoria del pensum.",
    link: "https://catalogo.uniandes.edu.co/"
  }
};

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalLink = document.getElementById("modal-link");
const closeModal = document.getElementById("close");

document.querySelectorAll(".course").forEach(course => {
  course.addEventListener("click", () => {
    const name = course.dataset.name;
    modalTitle.textContent = name;
    modalDescription.textContent = courses[name]?.details || "Sin descripción";
    modalLink.href = courses[name]?.link || "#";
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
