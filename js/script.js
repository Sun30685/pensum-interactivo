document.addEventListener('DOMContentLoaded', () => {
    const materias = document.querySelectorAll('.materia');
    const modal = document.getElementById('modal-info');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalDescripcion = document.getElementById('modal-descripcion');
    const modalRequisitos = document.getElementById('modal-requisitos');
    const closeButton = document.querySelector('.close-button');

    let datosPensum;
    let completedSubjects = new Set(JSON.parse(localStorage.getItem('completedSubjects')) || []);

    // Carga los datos del archivo JSON
    fetch('data/materias.json')
        .then(response => response.json())
        .then(data => {
            datosPensum = data;
            // Inicializa el estado del pensum
            updatePensumState();
        });

    // Función principal para actualizar el estado del pensum
    function updatePensumState() {
        materias.forEach(materia => {
            const materiaId = materia.dataset.id;
            const info = datosPensum[materiaId];

            // 1. Aplica la clase 'completed' si está en el localStorage
            if (completedSubjects.has(materiaId)) {
                materia.classList.add('completed');
            } else {
                materia.classList.remove('completed');
            }

            // 2. Verifica y aplica la clase 'available'
            if (info && info.prerrequisitos) {
                const isAvailable = info.prerrequisitos.every(req => completedSubjects.has(req));
                if (isAvailable && !completedSubjects.has(materiaId)) {
                    materia.classList.add('available');
                } else {
                    materia.classList.remove('available');
                }
            } else if (!info.prerrequisitos && !completedSubjects.has(materiaId)) {
                // Las materias sin prerrequisitos siempre están disponibles
                materia.classList.add('available');
            }
        });
    }

    // Maneja el clic en las materias
    materias.forEach(materia => {
        materia.addEventListener('click', (e) => {
            const materiaId = materia.dataset.id;
            const info = datosPensum[materiaId];
            
            // Si la materia ya está completada, no hacer nada (se deshabilita con CSS)
            if (completedSubjects.has(materiaId)) {
                 return;
            }

            // Toggle para marcar como completada
            completedSubjects.add(materiaId);
            localStorage.setItem('completedSubjects', JSON.stringify(Array.from(completedSubjects)));

            // Actualiza el estado visual del pensum
            updatePensumState();
        });
    });

    // Maneja el clic en el modal para mostrar detalles
    materias.forEach(materia => {
      // Usar un event listener diferente para el modal para que el clic no marque como completada
      materia.addEventListener('contextmenu', (e) => {
        e.preventDefault(); // Evita el menú contextual del navegador
        const materiaId = materia.dataset.id;
        const info = datosPensum[materiaId];

        if (info) {
          modalTitulo.textContent = info.titulo;
          modalDescripcion.textContent = info.descripcion;
          modalRequisitos.innerHTML = `<strong>Prerrequisitos:</strong> ${info.prerrequisitos && info.prerrequisitos.length > 0 ? info.prerrequisitos.map(req => datosPensum[req].titulo).join(', ') : 'Ninguno'}`;
          modal.style.display = 'block';
        }
      });
    });

    // Cierra el modal con el botón
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Cierra el modal si el usuario hace clic fuera
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Cierra el modal con la tecla ESC
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
});
