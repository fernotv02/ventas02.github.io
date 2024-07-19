var carritoVisible = false;

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

function ready() {
    var botonesEliminarItem = document.getElementsByClassName('btn-eliminar');
    for (var i = 0; i < botonesEliminarItem.length; i++) {
        var button = botonesEliminarItem[i];
        button.addEventListener('click', eliminarItemCarrito);
    }

    var botonesSumarCantidad = document.getElementsByClassName('sumar-cantidad');
    for (var i = 0; i < botonesSumarCantidad.length; i++) {
        var button = botonesSumarCantidad[i];
        button.addEventListener('click', sumarCantidad);
    }

    var botonesRestarCantidad = document.getElementsByClassName('restar-cantidad');
    for (var i = 0; i < botonesRestarCantidad.length; i++) {
        var button = botonesRestarCantidad[i];
        button.addEventListener('click', restarCantidad);
    }

    var botonesAgregarAlCarrito = document.getElementsByClassName('boton-item');
    for (var i = 0; i < botonesAgregarAlCarrito.length; i++) {
        var button = botonesAgregarAlCarrito[i];
        button.addEventListener('click', agregarAlCarritoClicked);
    }

    document.getElementsByClassName('btn-pagar')[0].addEventListener('click', pagarClicked);
}

function pagarClicked() {
    var carritoItems = document.getElementsByClassName('carrito-items')[0];
    var items = [];
    for (var i = 0; i < carritoItems.childNodes.length; i++) {
        var item = carritoItems.childNodes[i];
        if (item.nodeType === 1) {  
            var titulo = item.getElementsByClassName('carrito-item-titulo')[0].innerText;
            var precio = item.getElementsByClassName('carrito-item-precio')[0].innerText;
            var cantidad = item.getElementsByClassName('carrito-item-cantidad')[0].value;
            items.push({ titulo: titulo, precio: precio, cantidad: cantidad });
        }
    }

    var total = document.getElementsByClassName('carrito-precio-total')[0].innerText;

    var boleta = {
        items: items,
        total: total
    };

    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("DETALLE DE TU COMPRA", 10, 10);
    let yPosition = 20;

    boleta.items.forEach((item, index) => {
        doc.text(`Item ${index + 1}:`, 10, yPosition);
        yPosition += 10;
        doc.text(`Titulo: ${item.titulo}`, 10, yPosition);
        yPosition += 10;
        doc.text(`Precio: ${item.precio}`, 10, yPosition);
        yPosition += 10;
        doc.text(`Cantidad: ${item.cantidad}`, 10, yPosition);
        yPosition += 10;
    });

    doc.text(`Total: ${boleta.total}`, 10, yPosition + 10);

    doc.save('boleta.pdf');

    alert("Gracias por la compra");

    while (carritoItems.hasChildNodes()) {
        carritoItems.removeChild(carritoItems.firstChild);
    }
    actualizarTotalCarrito();
    ocultarCarrito();
}

function agregarAlCarritoClicked(event) {
    var button = event.target;
    var item = button.parentElement;
    var stock = parseInt(item.getAttribute('data-stock'));
    if (stock <= 0) {
        alert("Lo siento, este artículo está agotado.");
        return;
    }

    var titulo = item.getElementsByClassName('titulo-item')[0].innerText;
    var precio = item.getElementsByClassName('precio-item')[0].innerText;
    var imagenSrc = item.getElementsByClassName('img-item')[0].src;

    agregarItemAlCarrito(titulo, precio, imagenSrc);

    item.setAttribute('data-stock', stock - 1);
    hacerVisibleCarrito();
}

function hacerVisibleCarrito() {
    carritoVisible = true;
    var carrito = document.getElementsByClassName('carrito')[0];
    carrito.style.marginRight = '0';
    carrito.style.opacity = '1';

    var items = document.getElementsByClassName('contenedor-items')[0];
    items.style.width = '60%';
}

function agregarItemAlCarrito(titulo, precio, imagenSrc) {
    var item = document.createElement('div');
    item.classList.add = ('item');
    var itemsCarrito = document.getElementsByClassName('carrito-items')[0];

    var nombresItemsCarrito = itemsCarrito.getElementsByClassName('carrito-item-titulo');
    for (var i = 0; i < nombresItemsCarrito.length; i++) {
        if (nombresItemsCarrito[i].innerText == titulo) {
            alert("El item ya se encuentra en el carrito");

            return;
        }
    }

    var itemCarritoContenido = `
        <div class="carrito-item">
            <img src="${imagenSrc}" width="80px" alt="">
            <div class="carrito-item-detalles">
                <span class="carrito-item-titulo">${titulo}</span>
                <div class="selector-cantidad">
                    <i class="fa-solid fa-minus restar-cantidad"></i>
                    <input type="text" value="1" class="carrito-item-cantidad" disabled>
                    <i class="fa-solid fa-plus sumar-cantidad"></i>
                </div>
                <span class="carrito-item-precio">${precio}</span>
            </div>
            <button class="btn-eliminar">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;
    item.innerHTML = itemCarritoContenido;
    itemsCarrito.append(item);

    item.getElementsByClassName('btn-eliminar')[0].addEventListener('click', eliminarItemCarrito);
    item.getElementsByClassName('sumar-cantidad')[0].addEventListener('click', sumarCantidad);
    item.getElementsByClassName('restar-cantidad')[0].addEventListener('click', restarCantidad);

    actualizarTotalCarrito();
}

function eliminarItemCarrito(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    actualizarTotalCarrito();
    ocultarCarrito();
}

function actualizarTotalCarrito() {
    var carritoContenedor = document.getElementsByClassName('carrito')[0];
    var carritoItems = carritoContenedor.getElementsByClassName('carrito-item');
    var total = 0;

    for (var i = 0; i < carritoItems.length; i++) {
        var item = carritoItems[i];
        var precioElemento = item.getElementsByClassName('carrito-item-precio')[0];
        var precio = parseFloat(precioElemento.innerText.replace('S/.', '').replace('.', ''));
        var cantidadElemento = item.getElementsByClassName('carrito-item-cantidad')[0];
        var cantidad = cantidadElemento.value;

        total = total + (precio * cantidad);
    }

    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('carrito-precio-total')[0].innerText = 'S/.' + total.toLocaleString("es") + ",00";
}

function ocultarCarrito() {
    var carritoItems = document.getElementsByClassName('carrito-items')[0];
    if (carritoItems.childElementCount == 0) {
        var carrito = document.getElementsByClassName('carrito')[0];
        carrito.style.marginRight = '-100%';
        carrito.style.opacity = '0';
        carritoVisible = false;

        var items = document.getElementsByClassName('contenedor-items')[0];
        items.style.width = '100%';
    }
}

function sumarCantidad(event) {
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    var cantidadActual = parseInt(selector.getElementsByClassName('carrito-item-cantidad')[0].value);
    var tituloItem = selector.parentElement.getElementsByClassName('carrito-item-titulo')[0].innerText;
    var items = document.getElementsByClassName('item');
    var itemEnTienda;

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var titulo = item.getElementsByClassName('titulo-item')[0].innerText;
        if (titulo === tituloItem) {
            itemEnTienda = item;
            break;
        }
    }

    var stock = parseInt(itemEnTienda.getAttribute('data-stock'));
    if (cantidadActual < stock) {
        cantidadActual++;
        selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
        actualizarTotalCarrito();
    } else {
        alert("No hay suficiente stock disponible");
    }
}

function restarCantidad(event) {
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    var cantidadActual = parseInt(selector.getElementsByClassName('carrito-item-cantidad')[0].value);
    if (cantidadActual > 1) {
        cantidadActual--;
        selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
        actualizarTotalCarrito();
    }
}
