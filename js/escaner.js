document.addEventListener('DOMContentLoaded', () => {
    const scanForm = document.getElementById('scan-form');
    const scanInput = document.getElementById('scan-input');
    const scanHistoryBody = document.getElementById('scan-history-body');
    const scanMessage = document.getElementById('scan-message');
    const clearHistoryBtn = document.getElementById('clear-history-btn');

    // Inicializa el historial desde localStorage o con un array vacío
    let scanHistory = JSON.parse(localStorage.getItem('scanHistory')) || [];

    /**
     * Guarda el historial actual en el almacenamiento local del navegador
     */
    const saveHistory = () => {
        localStorage.setItem('scanHistory', JSON.stringify(scanHistory));
    };

    /**
     * Muestra un mensaje temporal de éxito o error
     * @param {string} message - El texto del mensaje
     * @param {string} type - 'success' o 'error'
     */
    const showMessage = (message, type) => {
        scanMessage.textContent = message;
        scanMessage.className = `message-area message-${type}`;
        scanMessage.style.display = 'block';

        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => {
            scanMessage.style.display = 'none';
        }, 3000);
    };

    /**
     * Renderiza la tabla de historial con los datos actuales
     */
    const renderHistoryTable = () => {
        scanHistoryBody.innerHTML = ''; // Limpiar filas existentes

        if (scanHistory.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `<td colspan="4" style="text-align: center; padding: 15px; color: #6c757d;">No hay códigos escaneados.</td>`;
            scanHistoryBody.appendChild(emptyRow);
            return;
        }

        scanHistory.forEach((record, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.code}</td>
                <td>${record.type}</td>
                <td>${record.time}</td>
                <td><a href="#" class="action-remove" data-index="${index}">Eliminar</a></td>
            `;
            scanHistoryBody.prepend(row); // Usamos prepend para que los más recientes salgan primero
        });

        // Adjuntar eventos de eliminación
        document.querySelectorAll('.action-remove').forEach(btn => {
            btn.addEventListener('click', handleRemoveRecord);
        });
    };

    /**
     * Maneja el envío del formulario de escaneo
     * @param {Event} e - Evento de submit
     */
    const handleScanSubmit = (e) => {
        e.preventDefault();
        const code = scanInput.value.trim().toUpperCase();

        if (!code) {
            showMessage('Debe ingresar un código.', 'error');
            return;
        }
        
        // Simulación de validación de tipo de código
        let codeType = 'SKU';
        if (code.startsWith('ORD-')) {
            codeType = 'Orden';
        } else if (code.length === 12 && /^\d+$/.test(code)) {
            codeType = 'EAN/UPC';
        }

        const newRecord = {
            code: code,
            type: codeType,
            time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };

        // 1. Agregar al historial
        scanHistory.unshift(newRecord); // Agregar al inicio para que aparezca primero
        saveHistory();

        // 2. Actualizar la interfaz
        renderHistoryTable();
        showMessage(`Código ${code} (${codeType}) agregado al historial.`, 'success');
        
        // 3. Limpiar el input para el siguiente escaneo
        scanInput.value = '';
    };

    /**
     * Maneja la eliminación de un registro del historial
     * @param {Event} e - Evento de clic
     */
    const handleRemoveRecord = (e) => {
        e.preventDefault();
        const index = parseInt(e.target.dataset.index);

        // Usamos el índice para remover el elemento del array original (recordar que se renderiza al revés)
        // Ya que usamos unshift para agregar, el índice se mantiene.
        if (confirm(`¿Estás seguro de que quieres eliminar el código ${scanHistory[index].code}?`)) {
             scanHistory.splice(index, 1);
             saveHistory();
             renderHistoryTable();
             showMessage('Registro eliminado.', 'error');
        }
    };

    /**
     * Maneja la limpieza completa del historial
     */
    const handleClearHistory = () => {
        if (confirm('¿Estás seguro de que deseas limpiar todo el historial de escaneo?')) {
            scanHistory = [];
            saveHistory();
            renderHistoryTable();
            showMessage('Historial limpiado correctamente.', 'success');
        }
    };


    // Event Listeners
    scanForm.addEventListener('submit', handleScanSubmit);
    clearHistoryBtn.addEventListener('click', handleClearHistory);

    // Carga inicial de la tabla
    renderHistoryTable();
});