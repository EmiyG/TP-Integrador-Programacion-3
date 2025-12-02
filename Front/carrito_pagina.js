function renderCarrito() {
    let carrito = getCarrito();
    let contenedor = document.getElementById("listaCarrito");
    let total = 0;

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>Tu carrito está vacío.</p>";
        document.getElementById("total").textContent = "Total: $0";
        return;
    }

    let html = carrito.map(item => {
        total += item.price * item.cantidad;

        return `
            <div class="item-carrito">
                <img src="${item.image}" alt="${item.name}">
                
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p>Precio: $${item.price}</p>
                    <p>Cantidad: ${item.cantidad}</p>
                </div>

                <div class="acciones">
                    <button onclick="sumar(${item.id})">+</button>
                    <button onclick="restar(${item.id})">-</button>
                    <button onclick="eliminar(${item.id})" style="background:#e74c3c;">🗑</button>
                </div>
            </div>
        `;
    }).join("");

    contenedor.innerHTML = html;
    document.getElementById("total").textContent = "Total: $" + total.toFixed(2);
}

function sumar(id) {
    let carrito = getCarrito();
    let prod = carrito.find(p => p.id === id);
    prod.cantidad++;
    setCarrito(carrito);
    renderCarrito();
}

function restar(id) {
    let carrito = getCarrito();
    let prod = carrito.find(p => p.id === id);

    if (prod.cantidad > 1) {
        prod.cantidad--;
    } else {
        carrito = carrito.filter(p => p.id !== id);
    }

    setCarrito(carrito);
    renderCarrito();
}

function eliminar(id) {
    let carrito = getCarrito();
    carrito = carrito.filter(p => p.id !== id);
    setCarrito(carrito);
    renderCarrito();
}

document.getElementById("btnVaciar").addEventListener("click", () => {
    setCarrito([]);
    renderCarrito();
});

// Render inicial
renderCarrito();
