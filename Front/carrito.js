// Inicializar carrito si es que no existe
if (!localStorage.getItem("carrito")) {
    localStorage.setItem("carrito", JSON.stringify([]));
}

// Obtener carrito
function getCarrito() {
    return JSON.parse(localStorage.getItem("carrito"));
}

// Guardar carrito
function setCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Agrerga producto al carrito
async function agregarAlCarrito(idProducto) {
    try {
        let response = await fetch(`http://localhost:3000/productos/${idProducto}`);
        let data = await response.json();

        if (!response.ok || data.payload.length === 0) {
            alert("Error: Producto no encontrado.");
            return;
        }

        let producto = data.payload[0];
        let carrito = getCarrito();

        // Buscar si ya existe
        let existe = carrito.find(item => item.id === producto.id);

        if (existe) {
            existe.cantidad++;
        } else {
            carrito.push({
                id: producto.id,
                name: producto.name,
                price: producto.price,
                image: producto.image,
                cantidad: 1
            });
        }

        setCarrito(carrito);

        
    } catch (error) {
        console.error(error);
        alert("Error al agregar al carrito.");
    }
}