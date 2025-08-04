document.addEventListener('DOMContentLoaded', () => {
    const materias = document.querySelectorAll('.materia');
    const modal = document.getElementById('modal-info');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalCodigo = document.getElementById('modal-codigo');
    const modalCreditos = document.getElementById('modal-creditos');
    const modalPrerrequisitos = document.getElementById('modal-prerrequisitos');
    const modalCorrequisitos = document.getElementById('modal-correquisitos');
    const closeButton = document.querySelector('.close-button');

    let datosPensum;
    let completedSubjects = new Set(JSON.parse(localStorage.getItem('completedSubjects')) || []);

    fetch('data/materias.json')
        .then(response => response.json())
        .then(data => {
            datosPensum = data;
            updatePensumState();
        });

    function updatePensumState() {
        let totalCreditosAcumulados = 0;
        
        // Primero, calcula los créditos acumulados
        completedSubjects.forEach(materiaId => {
            const info = datosPensum[materiaId];
            if (info && info.creditos) {
                totalCreditosAcumulados += info.creditos;
            }
        });

        // Luego, actualiza el estado visual de cada materia
        materias.forEach(materia => {
            const materiaId = materia.dataset.id;
            const info = datosPensum[materiaId];

            if (completedSubjects.has(materiaId)) {
                materia.classList.add('completed');
            } else {
                materia.classList.remove('completed');
            }

            if (info) {
                const prerrequisitosCumplidos = info.prerrequisitos.every(reqId => completedSubjects.has(reqId));
                
                let requisitosExtraCumplidos = true;
                if (materiaId === 'ADMI3103') { // Negocios Internacionales
                    requisitosExtraCumplidos = totalCreditosAcumulados >= 75;
                }

                if (prerrequisitosCumplidos && requisitosExtraCumplidos && !completedSubjects.has(materiaId)) {
                    materia.classList.add('available');
                } else {
                    materia.classList.remove('available');
                }
            }
        });
    }

    materias.forEach(materia => {
        materia.addEventListener('click', () => {
            const materiaId = materia.dataset.id;
            const info = datosPensum[materiaId];
            
            // Si la materia no está en los datos o ya fue completada, no hacer nada
            if (!info) return;

            // Lógica para marcar/desmarcar
            if (completedSubjects.has(materiaId)) {
                 completedSubjects.delete(materiaId);
            } else {
                completedSubjects.add(materiaId);
            }

            localStorage.setItem('completedSubjects', JSON.stringify(Array.from(completedSubjects)));
            updatePensumState();
        });

        materia.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const materiaId = materia.dataset.id;
            const info = datosPensum[materiaId];

            if (info) {
                modalTitulo.textContent = info.titulo;
                modalCodigo.textContent = `Código: ${info.codigo || 'N/A'}`;
                modalCreditos.textContent = `Créditos: ${info.creditos || 'N/A'}`;

                let prerequisitosText = 'Ninguno';
                if (info.prerrequisitos && info.prerrequisitos.length > 0) {
                    prerequisitosText = info.prerrequisitos.map(reqId => datosPensum[reqId]?.titulo || reqId).join(', ');
                }
                modalPrerrequisitos.innerHTML = `<strong>Prerrequisitos:</strong> ${prerequisitosText}`;
                
                let correquisitosText = 'Ninguno';
                if (info.correquisito && info.correquisito.length > 0) {
                    correquisitosText = info.correquisito.map(reqId => datosPensum[reqId]?.titulo || reqId).join(', ');
                }
                modalCorrequisitos.innerHTML = `<strong>Correquisitos:</strong> ${correquisitosText}`;

                modal.style.display = 'block';
            }
        });
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
});
