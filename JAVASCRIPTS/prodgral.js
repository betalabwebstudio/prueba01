document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const productosContainer = document.getElementById('productos-container');
    
    // Crear contenedor de paginación si no existe
    let paginacionContainer = document.getElementById('paginacion-container');
    if (!paginacionContainer) {
        paginacionContainer = document.createElement('div');
        paginacionContainer.id = 'paginacion-container';
        paginacionContainer.className = 'paginacion-container';
        
        // Insertar después del contenedor de productos
        if (productosContainer && productosContainer.parentNode) {
            productosContainer.parentNode.insertBefore(paginacionContainer, productosContainer.nextSibling);
        }
    }
    
    // Número de WhatsApp
    const whatsappNumber = "595993574822";
    
    // Variables de paginación
    let productos = [];
    let productosPorPagina = 16;
    let paginaActual = 1;
    let totalPaginas = 1;
    let jsonFilePath = '../JSON/streaming.json'; // Ruta por defecto

    // Detectar qué página estamos y cambiar la ruta del JSON
    function detectarPaginaActual() {
        const path = window.location.pathname;
        const pagina = path.split('/').pop().toLowerCase();
        
        if (pagina.includes('streaming') || path.includes('STREAMING')) {
            jsonFilePath = '../JSON/streaming.json';
        } else if (pagina.includes('juegos') || path.includes('JUEGOS')) {
            jsonFilePath = '../JSON/juegos.json';
        } else if (pagina.includes('musica') || path.includes('MUSICA')) {
            jsonFilePath = '../JSON/musica.json';
        } else {
            jsonFilePath = '../JSON/streaming.json'; // Por defecto
        }
        
        console.log(`📂 Cargando desde: ${jsonFilePath}`);
    }

    // Función para cargar productos desde JSON
    function cargarProductosDesdeJSON() {
        detectarPaginaActual(); // Detectar qué JSON cargar
        
        return fetch(jsonFilePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error HTTP ${response.status}: No se pudo cargar ${jsonFilePath}`);
                }
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data)) {
                    throw new Error('El archivo JSON no contiene un array válido');
                }
                productos = data;
                console.log(`✅ Cargados ${productos.length} productos desde ${jsonFilePath}`);
                return productos;
            })
            .catch(error => {
                console.error('❌ Error crítico:', error);
                mostrarError(`No se pudieron cargar los productos. Verifica: ${jsonFilePath}`);
                throw error;
            });
    }

    // Función para crear mensaje de WhatsApp
    function crearMensajeWhatsApp(producto) {
        const precioFormateado = producto.precio.toLocaleString('es-PY');
        
        // Emoji según categoría
        let emoji = '📦';
        if (producto.categoria?.includes('streaming')) emoji = '🎬';
        if (producto.categoria?.includes('juego') || producto.categoria?.includes('game')) emoji = '🎮';
        if (producto.categoria?.includes('musica') || producto.categoria?.includes('music')) emoji = '🎵';
        
        const mensaje = `¡Hola! 👋\n\nQuiero comprar en STREAMPLAY - PY:\n\n${emoji} *Producto:* ${producto.nombre}\n💰 *Precio:* ${precioFormateado} GS\n\nPor favor, confirmen disponibilidad. ¡Gracias!`;
        return encodeURIComponent(mensaje);
    }
    
    // Función para enviar a WhatsApp
    function enviarAWhatsApp(productoId) {
        const producto = productos.find(p => p.id === productoId);
        if (producto) {
            const urlWhatsApp = `https://wa.me/${whatsappNumber}?text=${crearMensajeWhatsApp(producto)}`;
            window.open(urlWhatsApp, '_blank');
            mostrarNotificacion(`✅ Redirigiendo a WhatsApp: ${producto.nombre}`);
        } else {
            mostrarNotificacion('❌ Producto no encontrado');
        }
    }
    
    // Mostrar productos de la página actual
    function mostrarProductosPagina(pagina) {
        productosContainer.innerHTML = '';
        
        // Calcular índices
        const inicio = (pagina - 1) * productosPorPagina;
        const fin = inicio + productosPorPagina;
        const productosPagina = productos.slice(inicio, fin);
        
        if (productosPagina.length === 0) {
            productosContainer.innerHTML = `
                <div class="sin-productos">
                    <i class="fas fa-box-open"></i>
                    <p>No hay productos en esta página</p>
                </div>
            `;
            return;
        }
        
        // Mostrar productos de la página
        productosPagina.forEach(producto => {
            const precioFormateado = producto.precio.toLocaleString('es-PY');
            
            const productoHTML = `
                <div class="producto-card" data-category="${producto.categoria || 'general'}">
                    <div class="producto-imagen">
                        <img src="${producto.imagen}" 
                             alt="${producto.nombre}"
                             loading="lazy"
                             onerror="this.onerror=null; this.src='https://via.placeholder.com/300x300/1a1a1a/4b6cb7?text=${encodeURIComponent(producto.nombre.substring(0, 15))}'">
                    </div>
                    <div class="producto-info">
                        <h3 class="producto-nombre">${producto.nombre}</h3>
                        <div class="producto-precio">${precioFormateado} GS</div>
                        <button class="btn-whatsapp" onclick="enviarAWhatsApp(${producto.id})">
                            <i class="fab fa-whatsapp"></i>
                            Comprar
                        </button>
                    </div>
                </div>
            `;
            
            productosContainer.innerHTML += productoHTML;
        });
    }
    
    // Crear controles de paginación
    function crearPaginacion() {
        paginacionContainer.innerHTML = '';
        
        if (totalPaginas <= 1) return;
        
        const paginacionHTML = `
            <div class="paginacion">
                <button class="btn-paginacion btn-anterior" ${paginaActual === 1 ? 'disabled' : ''} onclick="cambiarPagina(${paginaActual - 1})">
                    <i class="fas fa-chevron-left"></i> Anterior
                </button>
                
                <div class="numeros-paginas">
                    ${generarNumerosPaginas()}
                </div>
                
                <button class="btn-paginacion btn-siguiente" ${paginaActual === totalPaginas ? 'disabled' : ''} onclick="cambiarPagina(${paginaActual + 1})">
                    Siguiente <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;
        
        paginacionContainer.innerHTML = paginacionHTML;
    }
    
    // Generar números de páginas
    function generarNumerosPaginas() {
        let numerosHTML = '';
        const maxBotones = 7;
        
        if (totalPaginas <= maxBotones) {
            // Mostrar todas las páginas
            for (let i = 1; i <= totalPaginas; i++) {
                numerosHTML += `
                    <button class="btn-numero ${i === paginaActual ? 'active' : ''}" onclick="cambiarPagina(${i})">
                        ${i}
                    </button>
                `;
            }
        } else {
            // Mostrar páginas con lógica inteligente
            let inicio = Math.max(1, paginaActual - 3);
            let fin = Math.min(totalPaginas, paginaActual + 3);
            
            // Primera página
            if (inicio > 1) {
                numerosHTML += `
                    <button class="btn-numero" onclick="cambiarPagina(1)">1</button>
                    ${inicio > 2 ? '<span class="puntos">...</span>' : ''}
                `;
            }
            
            // Páginas intermedias
            for (let i = inicio; i <= fin; i++) {
                numerosHTML += `
                    <button class="btn-numero ${i === paginaActual ? 'active' : ''}" onclick="cambiarPagina(${i})">
                        ${i}
                    </button>
                `;
            }
            
            // Última página
            if (fin < totalPaginas) {
                numerosHTML += `
                    ${fin < totalPaginas - 1 ? '<span class="puntos">...</span>' : ''}
                    <button class="btn-numero" onclick="cambiarPagina(${totalPaginas})">${totalPaginas}</button>
                `;
            }
        }
        
        return numerosHTML;
    }
    
    // Cambiar de página
    function cambiarPagina(nuevaPagina) {
        if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;
        
        paginaActual = nuevaPagina;
        mostrarProductosPagina(paginaActual);
        crearPaginacion();
        scrollToTop();
        
        // Actualizar URL sin recargar
        actualizarURL(nuevaPagina);
    }
    
    // Scroll suave al inicio
    function scrollToTop() {
        window.scrollTo({
            top: productosContainer.offsetTop - 100,
            behavior: 'smooth'
        });
    }
    
    // Actualizar URL con parámetro de página
    function actualizarURL(pagina) {
        const url = new URL(window.location);
        url.searchParams.set('pagina', pagina);
        window.history.pushState({}, '', url);
    }
    
    // Leer parámetro de página de la URL
    function leerPaginaDeURL() {
        const params = new URLSearchParams(window.location.search);
        const pagina = parseInt(params.get('pagina'));
        return pagina && pagina > 0 ? pagina : 1;
    }
    
    // Función para mostrar notificación
    function mostrarNotificacion(mensaje) {
        const notificacionesAnteriores = document.querySelectorAll('.notificacion');
        notificacionesAnteriores.forEach(notif => notif.remove());
        
        const notificacion = document.createElement('div');
        notificacion.className = 'notificacion';
        
        const tipo = mensaje.startsWith('❌') ? 'error' : 
                    mensaje.startsWith('⚠️') ? 'warning' : 'success';
        notificacion.classList.add(tipo);
        
        notificacion.innerHTML = `${mensaje}`;
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            notificacion.style.opacity = '1';
            notificacion.style.transform = 'translateX(0)';
        }, 10);
        
        setTimeout(() => {
            notificacion.style.opacity = '0';
            notificacion.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notificacion.parentNode) {
                    notificacion.parentNode.removeChild(notificacion);
                }
            }, 300);
        }, 3000);
    }
    
    // Función para mostrar error
    function mostrarError(mensaje) {
        productosContainer.innerHTML = `
            <div class="error-critico">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Error de carga</h3>
                <p>${mensaje}</p>
                <div class="acciones-error">
                    <button onclick="location.reload()" class="btn-reload">
                        <i class="fas fa-redo"></i> Reintentar
                    </button>
                    <button onclick="window.location.href='index.html'" class="btn-inicio">
                        <i class="fas fa-home"></i> Volver al inicio
                    </button>
                </div>
            </div>
        `;
    }
    
    // Hacer funciones globales
    window.enviarAWhatsApp = enviarAWhatsApp;
    window.cambiarPagina = cambiarPagina;
    
    // Inicializar todo
    function inicializar() {
        console.log('🚀 Inicializando STREAMPLAY PY...');
        
        // Leer página de URL
        paginaActual = leerPaginaDeURL();
        
        cargarProductosDesdeJSON()
            .then(productosCargados => {
                // Calcular total de páginas
                totalPaginas = Math.ceil(productosCargados.length / productosPorPagina);
                
                // Validar página actual
                if (paginaActual > totalPaginas) {
                    paginaActual = totalPaginas;
                }
                
                // Mostrar página actual
                mostrarProductosPagina(paginaActual);
                
                // Crear paginación si hay más de 16 productos
                if (productosCargados.length > productosPorPagina) {
                    crearPaginacion();
                }
            })
            .catch(error => {
                console.error('Fallo en la inicialización:', error);
            });
    }
    
    // Manejar navegación con botones del navegador
    window.addEventListener('popstate', function() {
        paginaActual = leerPaginaDeURL();
        mostrarProductosPagina(paginaActual);
        crearPaginacion();
    });
    
    // Iniciar
    inicializar();
});