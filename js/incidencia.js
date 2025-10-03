document.addEventListener('DOMContentLoaded', () => {
    const incidentForm = document.getElementById('incident-form');
    const tableBody = document.getElementById('incidences-table-body');
    const formMessage = document.getElementById('form-message');
    const showClosedBtn = document.getElementById('show-closed-btn');
    
    // 1. Carga inicial del array de incidencias (simulando una base de datos/API)
    // Usamos localStorage para persistencia básica.
    let incidences = JSON.parse(localStorage.getItem('incidences')) || [
        { id: 101, titulo: 'Producto dañado', descripcion: 'Caja golpeada en transporte.', orden: 'ORD-2025-110', estado: 'abierto', prioridad: 'alta', fechaCreacion: '2025-09-28' },
        { id: 102, titulo: 'Faltante de SKU', descripcion: 'El ítem X203 no venía en la caja.', orden: 'ORD-2024-001', estado: 'abierto', prioridad: 'media', fechaCreacion: '2025-09-29' },
        { id: 103, titulo: 'Error en documento', descripcion: 'La factura no coincide con la recepción.', orden: 'ORD-2024-001', estado: 'cerrado', prioridad: 'baja', fechaCreacion: '2025-09-30' }
    ];

    let showClosed = false;
    
    /**
     * Guarda el array de incidencias en el almacenamiento local
     */
    const saveIncidences = () => {
        localStorage.setItem('incidences', JSON.stringify(incidences));
    };

    /**
     * Muestra un mensaje temporal de feedback
     */
    const showMessage = (message, type) => {
        formMessage.textContent = message;
        formMessage.className = `message-area message-${type}`;
        formMessage.style.display = 'block';

        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 3000);
    };

    /**
     * Función para dibujar la tabla de incidencias, aplicando el filtro de estado
     */
    const renderIncidencesTable = () => {
        tableBody.innerHTML = ''; // Limpiar filas

        const filteredData = incidences.filter(inc => showClosed || inc.estado === 'abierto');
        
        if (filteredData.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `<td colspan="6" style="text-align: center; padding: 15px; color: #6c757d;">No hay incidencias que mostrar.</td>`;
            tableBody.appendChild(emptyRow);
            return;
        }

        filteredData.forEach(inc => {
            const row = document.createElement('tr');
            
            const statusClass = `status-${inc.estado}`;
            const priorityClass = `priority-${inc.prioridad}`;
            const priorityText = inc.prioridad.charAt(0).toUpperCase() + inc.prioridad.slice(1);
            const statusText = inc.estado.charAt(0).toUpperCase() + inc.estado.slice(1);
            
            // Texto de acción que cambia según el estado
            const actionText = inc.estado === 'abierto' ? 'Editar/Cerrar' : 'Ver';

            row.innerHTML = `
                <td>${inc.id}</td>
                <td>${inc.titulo}</td>
                <td>${inc.descripcion}</td>
                <td><span class="badge ${statusClass}">${statusText}</span></td>
                <td><span class="badge ${priorityClass}">${priorityText}</span></td>
                <td>
                    <a href="#" class="action-link action-${inc.estado === 'abierto' ? 'edit' : 'view'}" data-id="${inc.id}">${actionText}</a>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        // 4. Se adjuntan los event listeners después de renderizar la tabla
        attachActionListeners();
    };

    /**
     * Adjunta los listeners a los botones de acción (Editar/Cerrar o Ver)
     */
    const attachActionListeners = () => {
        document.querySelectorAll('.action-link').forEach(link => {
            link.removeEventListener('click', handleIncidentAction); // Evita duplicados
            link.addEventListener('click', handleIncidentAction);
        });
    };
    
    /**
     * 5. Maneja el envío del formulario para crear una nueva incidencia
     */
    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        const nextId = incidences.length > 0 ? Math.max(...incidences.map(i => i.id)) + 1 : 101;
        const now = new Date();

        const newIncident = {
            id: nextId,
            titulo: document.getElementById('incident-title').value,
            descripcion: document.getElementById('incident-description').value,
            orden: document.getElementById('incident-order').value,
            prioridad: document.getElementById('incident-priority').value,
            estado: 'abierto', // Siempre se crea como abierto
            fechaCreacion: now.toLocaleDateString('es-ES')
        };

        incidences.push(newIncident);
        saveIncidences();
        renderIncidencesTable();
        
        showMessage(`Incidencia #${nextId} creada correctamente.`, 'success');
        incidentForm.reset(); // Limpia el formulario
        document.getElementById('incident-priority').value = 'baja'; // Asegura que vuelva a la opción inicial
    };

    /**
     * 6. Maneja las acciones de la tabla: Editar/Cerrar o Ver
     */
    const handleIncidentAction = (e) => {
        e.preventDefault();
        const incidentId = parseInt(e.target.dataset.id);
        const incident = incidences.find(i => i.id === incidentId);
        
        if (!incident) return;

        if (incident.estado === 'abierto') {
            // Acción de Editar/Cerrar
            if (confirm(`Incidencia #${incidentId} - Título: "${incident.titulo}"\n\n¿Deseas cerrar esta incidencia? (Si cancelas, simula la apertura de una vista de edición.)`)) {
                // Lógica para cerrar
                incident.estado = 'cerrado';
                saveIncidences();
                renderIncidencesTable();
                showMessage(`Incidencia #${incidentId} cerrada.`, 'success');
            } else {
                // Simulación de vista de edición
                alert(`SIMULACIÓN: Abriendo vista de edición para Incidencia #${incidentId}.`);
                // Aquí iría el código real para cargar un modal o redirigir a una página de edición
            }
        } else if (incident.estado === 'cerrado') {
            // Acción de Ver
            alert(`DETALLES DE INCIDENCIA CERRADA\n\nID: ${incident.id}\nOrden: ${incident.orden}\nTítulo: ${incident.titulo}\nPrioridad: ${incident.prioridad.toUpperCase()}\nDescripción: ${incident.descripcion}`);
        }
    };

    /**
     * 7. Maneja el botón para mostrar/ocultar incidencias cerradas
     */
    const handleToggleClosed = () => {
        showClosed = !showClosed;
        showClosedBtn.textContent = showClosed ? 'Ocultar Cerradas' : 'Mostrar Cerradas';
        renderIncidencesTable();
    };


    // 8. Event Listeners
    incidentForm.addEventListener('submit', handleFormSubmit);
    showClosedBtn.addEventListener('click', handleToggleClosed);

    // 9. Carga inicial de la tabla
    renderIncidencesTable();
});