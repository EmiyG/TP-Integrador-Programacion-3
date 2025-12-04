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

// actualizar contador del carrito
function actualizarContadorCarrito() {
    let carrito = getCarrito();
    let total = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    let contador = document.getElementById("cart-count");
    if (contador) contador.textContent = total;
}

// Agregar producto al carrito
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

        // Busca si ya existe
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
        actualizarContadorCarrito(); 

    } catch (error) {
        console.error(error);
        alert("Error al agregar al carrito.");
    }
}

actualizarContadorCarrito();
