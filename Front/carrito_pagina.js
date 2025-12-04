if (!localStorage.getItem("carrito")) {
    localStorage.setItem("carrito", JSON.stringify([]));
}

function getCarrito() {
    return JSON.parse(localStorage.getItem("carrito"));
}

function setCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function actualizarContadorCarrito() {
    let carrito = getCarrito();
    let total = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    let contador = document.getElementById("cart-count");
    if (contador) contador.textContent = total;
}

actualizarContadorCarrito();

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

function renderCarrito() {
    let carrito = getCarrito();
    let contenedor = document.getElementById("listaCarrito");
    let total = 0;

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>Tu carrito está vacío.</p>";
        document.getElementById("total").textContent = "Total: $0";
        actualizarContadorCarrito();
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
                    <p>Cantidad: x${item.cantidad}</p>
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

    actualizarContadorCarrito();
}

// CRUD dentro del carrito
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

// Vaciar carrito
document.getElementById("btnVaciar").addEventListener("click", () => {
    setCarrito([]);
    renderCarrito();
    actualizarContadorCarrito();
});

// GENERA TICKET PDF (jsPDF)

function imprimirTicket(carrito) {
    const { jsPDF } = window.jspdf; 
    const doc = new jsPDF();

    let y = 10;

    doc.setFontSize(18);
    doc.text("Ticket de compra", 10, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleString()}`, 10, y);
    y += 10;

    doc.text("----------------------------------------", 10, y);
    y += 10;

    let total = 0;

    carrito.forEach(item => {
        let subtotal = item.price * item.cantidad;
        total += subtotal;

        doc.text(`${item.name}`, 10, y); 
        y += 6;
        doc.text(`Cantidad: ${item.cantidad}  -  Precio: $${item.price}`, 10, y);
        y += 6;
        doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 10, y);
        y += 8;

        doc.text("----------------------------------------", 10, y);
        y += 10;
    });

    doc.text(`TOTAL: $${total.toFixed(2)}`, 10, y);
    y += 10;

    doc.text("¡Gracias por su compra!", 10, y);

    doc.save("ticket.pdf");
}

document.getElementById("btnComprar").addEventListener("click", () => {
    let carrito = getCarrito();

    if (carrito.length === 0) {
        alert("No hay productos en el carrito.");
        return;
    }

    // 1) Imprimir ticket (PDF)
    imprimirTicket(carrito);

    // 2) Vaciar carrito
    setCarrito([]);
    renderCarrito();
    actualizarContadorCarrito();

    // 3) Redirigir
    setTimeout(() => {
        window.location.href = "inicio.html";
    }, 800);
});

renderCarrito();
actualizarContadorCarrito();
