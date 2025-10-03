document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------
    // 1. Datos iniciales y Persistencia
    // --------------------------------------------------------------------
    
    // Datos de ejemplo iniciales (solo se usan si no hay nada en localStorage)
    const initialReceptions = [
        // NOTA: Añadimos 'items' para simular que son los productos esperados
        { id: 1, orden: 'ORD-2024-001', proveedor: 'Proveedor A', fecha: '2025-09-01', items: 5, estado: 'completada' },
        { id: 2, orden: 'ORD-2025-110', proveedor: 'Proveedor B', fecha: '2025-09-12', items: 12, estado: 'pendiente' },
        { id: 3, orden: 'ORD-2025-111', proveedor: 'Proveedor C', fecha: '2025-09-20', items: 3, estado: 'pendiente' },
        { id: 4, orden: 'ORD-2025-112', proveedor: 'Proveedor D', fecha: '2025-09-25', items: 8, estado: 'pendiente' },
        { id: 5, orden: 'ORD-2025-113', proveedor: 'Proveedor E', fecha: '2025-10-01', items: 15, estado: 'completada' },
    ];
    
    // Cargar datos de localStorage o usar los iniciales
    let receptions = JSON.parse(localStorage.getItem('receptions')) || initialReceptions;

    // Elementos del DOM
    const tableBody = document.getElementById('reception-table-body');
    const searchInput = document.getElementById('input-search');
    const statusSelect = document.getElementById('select-status');
    const btnRefrescar = document.getElementById('btn-refrescar');
    const btnNuevaRecepcion = document.getElementById('btn-nueva-recepcion');
    const messageArea = document.getElementById('notification-message'); // Asumiendo que tienes un div con id="notification-message" para mensajes

    /**
     * Guarda el array de recepciones en el almacenamiento local
     */
    const saveReceptions = () => {
        localStorage.setItem('receptions', JSON.stringify(receptions));
    };

    /**
     * Muestra un mensaje temporal de feedback
     */
    const showMessage = (message, type = 'success') => {
        if (!messageArea) return alert(message); // fallback si el elemento no existe

        messageArea.textContent = message;
        messageArea.className = `notification-message message-${type}`;
        messageArea.style.display = 'block';

        setTimeout(() => {
            messageArea.style.display = 'none';
        }, 3000);
    };

    // --------------------------------------------------------------------
    // 2. Funciones de Renderizado
    // --------------------------------------------------------------------

    /**
     * Función para renderizar una fila de la tabla
     * @param {Object} reception - Objeto con los datos de una recepción
     */
    const createRow = (reception) => {
        const row = document.createElement('tr');
        
        const statusClass = reception.estado === 'completada' ? 'status-completed' : 'status-pending';
        const statusText = reception.estado.charAt(0).toUpperCase() + reception.estado.slice(1);

        row.innerHTML = `
            <td>${reception.orden}</td>
            <td>${reception.proveedor}</td>
            <td>${reception.fecha}</td>
            <td>${reception.items}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>
                <a href="#" class="action-link action-ver" data-id="${reception.id}">Ver</a>
                ${reception.estado === 'pendiente' ? 
                    `<button class="btn-action btn-complete" data-id="${reception.id}">Marcar completa</button>` : 
                    ''
                }
            </td>
        `;

        // Se adjuntan los Event Listeners para cada fila
        row.querySelector('.action-ver').addEventListener('click', handleViewReception);
        
        if (reception.estado === 'pendiente') {
            const completeButton = row.querySelector('.btn-complete');
            completeButton.addEventListener('click', handleCompleteReception);
        }

        return row;
    };

    /**
     * Función principal para dibujar la tabla completa
     * @param {Array} data - El array de recepciones a mostrar
     */
    const renderTable = (data) => {
        tableBody.innerHTML = '';
        if (data.length === 0) {
             const emptyRow = document.createElement('tr');
             emptyRow.innerHTML = `<td colspan="6" style="text-align: center; padding: 20px; color: #6c757d;">No se encontraron recepciones con los filtros actuales.</td>`;
             tableBody.appendChild(emptyRow);
             return;
        }

        data.forEach(reception => {
            tableBody.appendChild(createRow(reception));
        });
    };

    // --------------------------------------------------------------------
    // 3. Funciones de Lógica y Eventos
    // --------------------------------------------------------------------

    /**
     * Función para manejar la búsqueda y el filtrado
     */
    const filterAndSearch = () => {
        const searchText = searchInput.value.toLowerCase().trim();
        const selectedStatus = statusSelect.value;

        const filteredData = receptions.filter(reception => {
            // Filtrar por estado
            const statusMatch = selectedStatus === 'todos' || reception.estado === selectedStatus;

            // Buscar por texto (Orden o Proveedor)
            const searchMatch = reception.orden.toLowerCase().includes(searchText) ||
                                reception.proveedor.toLowerCase().includes(searchText);

            return statusMatch && searchMatch;
        });

        renderTable(filteredData);
    };

    /**
     * Función para manejar la acción de 'Marcar completa'
     */
    const handleCompleteReception = (e) => {
        const receptionId = parseInt(e.target.dataset.id);
        
        // Confirmación para mayor seguridad
        if (!confirm('¿Estás seguro de que deseas marcar esta recepción como COMPLETADA manualmente?')) {
            return;
        }
        
        const receptionIndex = receptions.findIndex(r => r.id === receptionId);
        
        if (receptionIndex !== -1) {
            receptions[receptionIndex].estado = 'completada';
            saveReceptions(); 
            filterAndSearch(); 

            showMessage(`Recepción ${receptions[receptionIndex].orden} marcada como completada.`, 'success');
        } else {
            showMessage('Error: Recepción no encontrada.', 'error');
        }
    };
    
    /**
     * Función para manejar la acción de 'Ver' (Redirección a Detalle)
     */
    const handleViewReception = (e) => {
        e.preventDefault();
        const receptionId = parseInt(e.target.dataset.id);
        const reception = receptions.find(r => r.id === receptionId);

        if (reception) {
            // REDIRECCIÓN SIMULADA: En una aplicación real, se navegaría a la vista de detalle
            showMessage(`Redireccionando a Detalle de la Orden: ${reception.orden}...`, 'info');
            
            // Esto es crucial para el siguiente módulo: pasar el ID
            // window.location.href = `detalle_recepcion.html?id=${receptionId}`;
            
            // Para la demostración, solo mostramos un mensaje
            console.log(`Simulando navegación: detalle_recepcion.html?id=${receptionId}`);
        }
    };
    
    // --------------------------------------------------------------------
    // 4. Event Listeners y Carga Inicial
    // --------------------------------------------------------------------
    
    searchInput.addEventListener('input', filterAndSearch);
    statusSelect.addEventListener('change', filterAndSearch);

    btnRefrescar.addEventListener('click', () => {
        // En una app real, aquí se haría la llamada a la API para obtener datos frescos.
        // Aquí simulamos refresco.
        filterAndSearch(); 
        showMessage('Datos de recepciones refrescados.', 'success');
    });

    btnNuevaRecepcion.addEventListener('click', () => {
        showMessage('Redireccionando a la página de creación de nueva recepción...', 'info');
        // Aquí iría el código para navegar a otra vista o mostrar un modal de creación.
    });


    // Ejecución inicial: Carga los datos en la tabla
    filterAndSearch();
});