document.addEventListener('DOMContentLoaded', function() {
    const productosContainer = document.getElementById('productos-container');
    
    // Número de WhatsApp (cambia el 595993574822 por tu número real)
    const whatsappNumber = "595993574822";
    
    // Productos con imágenes cuadradas (300x300) - Precios en Guaraníes
    const productos = [
        {id: 1, nombre: "Netflix Premium 1 mes", imagen: "1.png", precio: 30000},
        {id: 2, nombre: "Spotify Premium 1 mes", imagen: "2.png", precio: 30000},
        {id: 3, nombre: "Youtube Music Premium 1 mes", imagen: "3.png", precio: 30000},
        {id: 4, nombre: "200 Robux", imagen: "https://i.pinimg.com/736x/55/61/cc/5561cc4cd9bdc22fc18e363b5fd4778f.jpg", precio: 24000},
        {id: 5, nombre: "800 Robux", imagen: "https://i.pinimg.com/736x/55/61/cc/5561cc4cd9bdc22fc18e363b5fd4778f.jpg", precio: 62000},
        {id: 6, nombre: "400 Robux", imagen: "https://i.pinimg.com/736x/55/61/cc/5561cc4cd9bdc22fc18e363b5fd4778f.jpg", precio: 42000},
        {id: 7, nombre: "Free Fire 100 Diamantes", imagen: "https://i.pinimg.com/1200x/d3/c9/c4/d3c9c4c907ac93e5f6e880cd8fc772c2.jpg", precio: 8500},
        {id: 8, nombre: "Free Fire 572 Diamantes", imagen: "https://i.pinimg.com/1200x/d3/c9/c4/d3c9c4c907ac93e5f6e880cd8fc772c2.jpg", precio: 47000},
        {id: 9, nombre: "Free Fire 341 Diamantes", imagen: "https://i.pinimg.com/1200x/d3/c9/c4/d3c9c4c907ac93e5f6e880cd8fc772c2.jpg", precio: 28500},
        {id: 10, nombre: "Pubg Mobile 60 UC", imagen: "https://i.pinimg.com/736x/b8/3d/8d/b83d8d3e9beecfac081f4e742d27661c.jpg", precio: 9500},
        {id: 11, nombre: "Pubg Mobile 325 UC", imagen: "https://i.pinimg.com/736x/b8/3d/8d/b83d8d3e9beecfac081f4e742d27661c.jpg", precio: 39500},
        {id: 12, nombre: "Pubg Mobile 660 UC", imagen: "https://i.pinimg.com/736x/b8/3d/8d/b83d8d3e9beecfac081f4e742d27661c.jpg", precio: 77500},
        {id: 13, nombre: "Genshin Impact 60 Genesis Cristal", imagen: "https://i.pinimg.com/1200x/11/c8/00/11c800b14de687e60dab56d716b4476d.jpg", precio: 8500},
        {id: 14, nombre: "Genshin Impact 330 Genesis Cristal", imagen: "https://i.pinimg.com/1200x/11/c8/00/11c800b14de687e60dab56d716b4476d.jpg", precio: 36000},
    ];
    
    // Función para crear mensaje de WhatsApp
    function crearMensajeWhatsApp(producto) {
        // Formatear precio con separadores de miles
        const precioFormateado = producto.precio.toLocaleString('es-PY');
        
        // Codificar el mensaje para URL
        const mensaje = `Hola! Quiero comprar este producto: ${producto.nombre} - Precio: ${precioFormateado} GS`;
        const mensajeCodificado = encodeURIComponent(mensaje);
        
        // Crear URL de WhatsApp
        return `https://wa.me/${whatsappNumber}?text=${mensajeCodificado}`;
    }
    
    // Función para enviar a WhatsApp
    function enviarAWhatsApp(productoId) {
        const producto = productos.find(p => p.id === productoId);
        if (producto) {
            const urlWhatsApp = crearMensajeWhatsApp(producto);
            
            // Abrir en nueva pestaña
            window.open(urlWhatsApp, '_blank');
            
            // Mostrar notificación opcional
            mostrarNotificacion(`Redirigiendo a WhatsApp para: ${producto.nombre}`);
        }
    }
    
    // Mostrar productos
    function mostrarProductos() {
        productosContainer.innerHTML = '';
        
        productos.forEach(producto => {
            // Formatear precio con separadores de miles para mostrar en la tarjeta
            const precioFormateado = producto.precio.toLocaleString('es-PY');
            
            const productoHTML = `
                <div class="producto-card">
                    <div class="producto-imagen">
                        <img src="${producto.imagen}" 
                             alt="${producto.nombre}"
                             onerror="this.onerror=null; this.src='https://via.placeholder.com/300x300/1a1a1a/ffffff?text=Producto'">
                    </div>
                    <div class="producto-info">
                        <h3 class="producto-nombre">${producto.nombre}</h3>
                        <div class="producto-precio">${precioFormateado} GS</div>
                        <button class="btn-whatsapp" onclick="enviarAWhatsApp(${producto.id})">
                            <i class="fab fa-whatsapp"></i> Comprar por WhatsApp
                        </button>
                    </div>
                </div>
            `;
            
            productosContainer.innerHTML += productoHTML;
        });
    }
    
    // Función para mostrar notificación (opcional)
    function mostrarNotificacion(mensaje) {
        const notificacion = document.createElement('div');
        notificacion.className = 'notificacion';
        notificacion.innerHTML = `<i class="fas fa-info-circle"></i> ${mensaje}`;
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            notificacion.style.opacity = '0';
            setTimeout(() => {
                if (notificacion.parentNode) {
                    notificacion.parentNode.removeChild(notificacion);
                }
            }, 300);
        }, 2000);
    }
    
    // Hacer la función global para que funcione con onclick
    window.enviarAWhatsApp = enviarAWhatsApp;
    
    // Inicializar
    mostrarProductos();
});