document.addEventListener('DOMContentLoaded', () => {
    
    // Función de utilidad para cargar datos (simulación de API)
    const loadData = (key, initialData) => JSON.parse(localStorage.getItem(key)) || initialData;

    // --------------------------------------------------------------------
    // 1. DATOS DE MOCKUP (Como en tu imagen)
    // --------------------------------------------------------------------
    
    // Datos de Métricas
    const metricsData = [
        { id: 1, title: 'Eficiencia promedio', value: '94.2%', detail: '+2.1% desde la semana pasada', icon: 'fas fa-chart-bar', trend: 'up' },
        { id: 2, title: 'Proveedores activos', value: '45', detail: '+3 nuevos este mes', icon: 'fas fa-handshake', trend: 'up' },
        { id: 3, title: 'Tiempo promedio', value: '12.5 min', detail: 'Por recepción completa', icon: 'fas fa-clock', trend: 'down' },
        { id: 4, title: 'Total recepciones', value: '1,250', detail: 'En el mes actual', icon: 'fas fa-boxes', trend: 'neutral' },
        { id: 5, title: 'Pendientes Validación', value: '32', detail: 'Esperando confirmación', icon: 'fas fa-hourglass-half', trend: 'up' },
        { id: 6, title: 'Incidencias Abiertas', value: '8', detail: 'En revisión', icon: 'fas fa-exclamation-triangle', trend: 'up' }
    ];

    // Datos de Actividades
    const activityLog = loadData('activityLog', [
        { type: 'reception', action: 'Recepción completada', detail: 'Orden #ORD-2024-001', time: 'hace 5 min - 1 h', dotClass: 'completed-dot' },
        { type: 'incidence', action: 'Incidencia reportada', detail: 'Producto dañado - hace 15 min - 1 h', time: 'hace 15 min - 1 h', dotClass: 'reported-dot' },
        { type: 'inventory', action: 'Inventario actualizado', detail: 'Stock ajustado - hace 30 min - 1 h', time: 'hace 30 min - 1 h', dotClass: 'updated-dot' },
    ]);
    
    // --------------------------------------------------------------------
    // 2. LÓGICA DE RENDERIZADO
    // --------------------------------------------------------------------

    const renderMetrics = () => {
        const metricsGrid = document.getElementById('metrics-grid');
        metricsGrid.innerHTML = metricsData.map(m => `
            <div class="col-6 col-md-4 col-lg-2"> 
                <div class="metric-card">
                    <div class="card-header">
                        <h2>${m.title}</h2>
                        <i class="${m.icon} ${m.trend === 'up' ? 'text-success' : m.trend === 'down' ? 'text-danger' : ''}"></i>
                    </div>
                    <div class="main-value">${m.value}</div>
                    <div class="trend-detail">
                        ${m.trend === 'up' ? '<i class="fas fa-arrow-up text-success"></i>' : ''}
                        ${m.trend === 'down' ? '<i class="fas fa-arrow-down text-danger"></i>' : ''}
                        ${m.detail}
                    </div>
                </div>
            </div>
        `).join('');
    };

    const renderActivityLog = () => {
        const activityList = document.getElementById('activity-list');
        activityList.innerHTML = activityLog.map(item => `
            <li class="activity-item">
                <span class="status-dot ${item.dotClass}"></span>
                <div class="activity-detail">
                    <p>
                        <strong>${item.action}</strong>
                        <span class="text-muted small"></span>
                    </p>
                    <span class="activity-time">${item.detail}</span>
                </div>
            </li>
        `).join('');
    };
    
    // --------------------------------------------------------------------
    // 3. INICIALIZACIÓN
    // --------------------------------------------------------------------
    
    // Renderizar al cargar la página
    renderMetrics();
    renderActivityLog();
});