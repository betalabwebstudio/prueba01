document.addEventListener('DOMContentLoaded', function() {
    const productosContainer = document.getElementById('productos-container');
    
    // Número de WhatsApp
    const whatsappNumber = "595993574822";
    
    // Productos con categorías para filtros
    const productos = [
        {id: 1, nombre: "Netflix Premium 1 mes", imagen: "1.png", precio: 30000, categoria: "streaming"},
        {id: 2, nombre: "Spotify Premium 1 mes", imagen: "2.png", precio: 30000, categoria: "streaming"},
        {id: 3, nombre: "Youtube Music Premium 1 mes", imagen: "3.png", precio: 30000, categoria: "streaming"},
        {id: 4, nombre: "200 Robux", imagen: "https://i.pinimg.com/736x/55/61/cc/5561cc4cd9bdc22fc18e363b5fd4778f.jpg", precio: 24000, categoria: "juegos"},
        {id: 5, nombre: "800 Robux", imagen: "https://i.pinimg.com/736x/55/61/cc/5561cc4cd9bdc22fc18e363b5fd4778f.jpg", precio: 62000, categoria: "juegos"},
        {id: 6, nombre: "400 Robux", imagen: "https://i.pinimg.com/736x/55/61/cc/5561cc4cd9bdc22fc18e363b5fd4778f.jpg", precio: 42000, categoria: "juegos"},
        {id: 7, nombre: "Free Fire 100 Diamantes", imagen: "https://i.pinimg.com/1200x/d3/c9/c4/d3c9c4c907ac93e5f6e880cd8fc772c2.jpg", precio: 8500, categoria: "juegos"},
        {id: 8, nombre: "Free Fire 572 Diamantes", imagen: "https://i.pinimg.com/1200x/d3/c9/c4/d3c9c4c907ac93e5f6e880cd8fc772c2.jpg", precio: 47000, categoria: "juegos"},
        {id: 9, nombre: "Free Fire 341 Diamantes", imagen: "https://i.pinimg.com/1200x/d3/c9/c4/d3c9c4c907ac93e5f6e880cd8fc772c2.jpg", precio: 28500, categoria: "juegos"},
        {id: 10, nombre: "Pubg Mobile 60 UC", imagen: "https://i.pinimg.com/736x/b8/3d/8d/b83d8d3e9beecfac081f4e742d27661c.jpg", precio: 9500, categoria: "juegos"},
        {id: 11, nombre: "Pubg Mobile 325 UC", imagen: "https://i.pinimg.com/736x/b8/3d/8d/b83d8d3e9beecfac081f4e742d27661c.jpg", precio: 39500, categoria: "juegos"},
        {id: 12, nombre: "Pubg Mobile 660 UC", imagen: "https://i.pinimg.com/736x/b8/3d/8d/b83d8d3e9beecfac081f4e742d27661c.jpg", precio: 77500, categoria: "juegos"},
        {id: 13, nombre: "Genshin Impact 60 Genesis Cristal", imagen: "https://i.pinimg.com/1200x/11/c8/00/11c800b14de687e60dab56d716b4476d.jpg", precio: 8500, categoria: "juegos"},
        {id: 14, nombre: "Genshin Impact 330 Genesis Cristal", imagen: "https://i.pinimg.com/1200x/11/c8/00/11c800b14de687e60dab56d716b4476d.jpg", precio: 36000, categoria: "juegos"},
        {id: 15, nombre: "Genshin Impact 660 Genesis Cristal", imagen: "https://i.pinimg.com/1200x/11/c8/00/11c800b14de687e60dab56d716b4476d.jpg", precio: 68000, categoria: "juegos"},
        {id: 16, nombre: "Chat GPT Plus 1 mes", imagen: "https://i.pinimg.com/736x/99/73/65/997365fc94842f0ec407f77476402341.jpg", precio: 35000, categoria: "herramientas"},
        {id: 17, nombre: "Canva Pro 1 año", imagen: "https://i.pinimg.com/1200x/97/3a/9a/973a9af24b3aec8e40369cf842293f07.jpg", precio: 62000, categoria: "herramientas"},
        {id: 18, nombre: "Canva Education 1 Año", imagen: "https://i.pinimg.com/1200x/c9/35/61/c93561ce889c03839424e455d98579c3.jpg", precio: 16000, categoria: "herramientas"},
    ];
    
    // Función para crear mensaje de WhatsApp mejorado
    function crearMensajeWhatsApp(producto) {
        const precioFormateado = producto.precio.toLocaleString('es-PY');
        const mensaje = `¡Hola! 👋\n\nQuiero comprar en STREAMPLAY - PY:\n\n📦 *Producto:* ${producto.nombre}\n💰 *Precio:* ${precioFormateado} GS\n\nPor favor, confirmen disponibilidad. ¡Gracias!`;
        return encodeURIComponent(mensaje);
    }
    
    // Función para enviar a WhatsApp
    function enviarAWhatsApp(productoId) {
        const producto = productos.find(p => p.id === productoId);
        if (producto) {
            const urlWhatsApp = `https://wa.me/${whatsappNumber}?text=${crearMensajeWhatsApp(producto)}`;
            window.open(urlWhatsApp, '_blank');
            mostrarNotificacion(`✅ Redirigiendo a WhatsApp: ${producto.nombre}`);
        }
    }
    
    // Mostrar TODOS los productos sin filtros
    function mostrarProductos() {
        productosContainer.innerHTML = '';
        
        productos.forEach(producto => {
            const precioFormateado = producto.precio.toLocaleString('es-PY');
            
            // HTML simplificado con solo "Comprar" en el botón
            const productoHTML = `
                <div class="producto-card" data-category="${producto.categoria}">
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
    
    // Función para mostrar notificación
    function mostrarNotificacion(mensaje) {
        // Remover notificaciones anteriores
        const notificacionesAnteriores = document.querySelectorAll('.notificacion');
        notificacionesAnteriores.forEach(notif => notif.remove());
        
        const notificacion = document.createElement('div');
        notificacion.className = 'notificacion';
        notificacion.innerHTML = `<i class="fas fa-check-circle"></i> ${mensaje}`;
        document.body.appendChild(notificacion);
        
        // Animación de entrada
        setTimeout(() => {
            notificacion.style.opacity = '1';
            notificacion.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto-eliminar después de 3 segundos
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
    
    // Hacer las funciones globales
    window.enviarAWhatsApp = enviarAWhatsApp;
    
    // Inicializar
    mostrarProductos();
});