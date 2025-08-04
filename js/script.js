document.addEventListener('DOMContentLoaded', () => {
    const materias = document.querySelectorAll('.materia');
    const modal = document.getElementById('modal-info');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalDescripcion = document.getElementById('modal-descripcion');
    const modalPrerrequisitos = document.getElementById('modal-prerrequisitos');
    const closeButton = document.querySelector('.close-button');

    let datosPensum;
    let completedSubjects = new Set(JSON.parse(localStorage.getItem('completedSubjects')) || []);

    // Carga los datos del archivo JSON
    fetch('data/materias.json')
        .then(response => response.json())
        .then(data => {
            datosPensum = data;
            // Inicializa el estado del pensum al cargar la página
            updatePensumState();
        });

    // Función principal para actualizar el estado visual del pensum
    function updatePensumState() {
        materias.forEach(materia => {
            const materiaId = materia.dataset.id;
            const info = datosPensum[materiaId];

            // 1. Marca como 'completed' si está en el localStorage
            if (completedSubjects.has(materiaId)) {
                materia.classList.add('completed');
            } else {
                materia.classList.remove('completed');
            }

            // 2. Resalta como 'available' si los prerrequisitos se cumplen
            if (info) {
                const isAvailable = info.prerrequisitos.every(req => completedSubjects.has(req));
                if (isAvailable && !completedSubjects.has(materiaId)) {
                    materia.classList.add('available');
                } else {
                    materia.classList.remove('available');
                }
            }
        });
    }

    // Maneja el clic izquierdo para marcar/desmarcar
    materias.forEach(materia => {
        materia.addEventListener('click', () => {
            const materiaId = materia.dataset.id;
            
            if (completedSubjects.has(materiaId)) {
                 completedSubjects.delete(materiaId);
            } else {
                completedSubjects.add(materiaId);
            }
            localStorage.setItem('completedSubjects', JSON.stringify(Array.from(completedSubjects)));
            updatePensumState();
        });
    });

    // Maneja el clic derecho para mostrar el modal de detalles
    materias.forEach(materia => {
      materia.addEventListener('contextmenu', (e) => {
        e.preventDefault(); // Evita el menú contextual por defecto
        const materiaId = materia.dataset.id;
        const info = datosPensum[materiaId];

        if (info) {
          modalTitulo.textContent = info.titulo;
          modalDescripcion.textContent = info.descripcion;

          let requisitosText = 'Ninguno';
          if (info.prerrequisitos && info.prerrequisitos.length > 0) {
              const nombresRequisitos = info.prerrequisitos.map(reqId => datosPensum[reqId]?.titulo || reqId);
              requisitosText = nombresRequisitos.join(', ');
          }
          modalPrerrequisitos.innerHTML = `<strong>Prerrequisitos:</strong> ${requisitosText}`;

          modal.style.display = 'block';
        }
      });
    });

    // Cierra el modal con el botón de cierre
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Cierra el modal si se hace clic fuera del contenido
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
