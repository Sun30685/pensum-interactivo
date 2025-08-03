document.addEventListener('DOMContentLoaded', () => {
    // Selecciona todos los elementos de materia y el modal
    const materias = document.querySelectorAll('.materia');
    const modal = document.getElementById('modal-info');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalDescripcion = document.getElementById('modal-descripcion');
    const modalRequisitos = document.getElementById('modal-requisitos');
    const closeButton = document.querySelector('.close-button');

    let datosPensum;

    // Carga los datos del archivo JSON
    fetch('data/materias.json')
        .then(response => {
            // Verifica que la respuesta sea exitosa
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON.');
            }
            return response.json();
        })
        .then(data => {
            datosPensum = data;
        })
        .catch(error => {
            console.error('No se pudieron cargar los datos del pensum:', error);
            // Muestra un mensaje de error en la consola si el archivo no se encuentra
        });

    // Añade un evento de clic a cada materia
    materias.forEach(materia => {
        materia.addEventListener('click', () => {
            const materiaId = materia.dataset.materiaId;
            const info = datosPensum[materiaId];

            if (info) {
                // Rellena el modal con la información de la materia
                modalTitulo.textContent = info.titulo;
                modalDescripcion.textContent = info.descripcion;
                modalRequisitos.innerHTML = `<strong>Requisitos:</strong> ${info.requisitos}`;
                
                // Muestra el modal
                modal.style.display = 'block';
            } else {
                console.error(`No se encontró la información para la materia con ID: ${materiaId}`);
            }
        });
    });

    // Cierra el modal cuando se hace clic en el botón de cerrar
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Cierra el modal si el usuario hace clic fuera de él
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});
