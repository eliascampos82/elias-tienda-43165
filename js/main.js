let productos = [];

fetch("./productos.json")
  .then((res) => res.json())
  .then((data) => {
    cargarProductos(data);
  });
 
const cargarProductos = (data) => {
  productos = data;
  const contenedor = document.getElementById("container");
  productos.forEach((producto, indice) => {
    let card = document.createElement("div");
  card.classList.add("card", "col-sm-4", "col-lg-2");
  let html = `
    <img src="${producto.imagen}" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${producto.nombre}</h5>
      <p class="card-text">$ ${producto.precio}</p>
      <a href="#cart" class="btn btn-dark" onClick="agregarAlCarrito(${indice})">Comprar</a>
    </div>
      `;
  card.innerHTML = html;
  contenedor.appendChild(card);
});
};



let modalCarrito = document.getElementById("cart");
let cart = [];
const agregarAlCarrito = (indiceDelArrayProducto) => {
  
  const indiceEncontradoCarrito = cart.findIndex((elemento) => {
    
    return elemento.id === productos[indiceDelArrayProducto].id;
  });
  if (indiceEncontradoCarrito === -1) {
     //agrego el producto
    const productoAgregar = productos[indiceDelArrayProducto];
    productoAgregar.cantidad = 1;
    cart.push(productoAgregar);
    dibujarCarrito();
  } else {
     //incremento cantidad
    cart[indiceEncontradoCarrito].cantidad += 1;
    actualizarStorage(cart);
    dibujarCarrito();
  }
};
let carritoContainer = document.getElementById("cart-container");
let total = 0;

const dibujarCarrito = () => {
  let total = 0;
  modalCarrito.className = "cart";
  modalCarrito.innerHTML = "";
  if (cart.length > 0) {
    cart.forEach((producto, indice) => {
      total = total + producto.precio * producto.cantidad;
      const carritoContainer = document.createElement("div");
      carritoContainer.className = "producto-carrito";
      carritoContainer.innerHTML = `
        
        <img class="car-img" src="${producto.imagen}"/>
        <div class="product-details">
          ${producto.nombre}
        </div>
        <div class="product-details" > Cantidad: ${producto.cantidad}</div>
        <div class="product-details"> Precio: $ ${producto.precio}</div>
        <div class="product-details"> Subtotal: $ ${
          producto.precio * producto.cantidad
        }</div>
        <button class="btn btn-danger"  id="remove-product" onClick="removeProduct(${indice})">Eliminar producto</button>
        `;
        
      modalCarrito.appendChild(carritoContainer);
    });
    // Dibujo el total y lo appendeo en el div capturado y guardado en la variable modalCarrito
    const totalContainer = document.createElement("div");
    totalContainer.className = "total-carrito";
    totalContainer.innerHTML = `<div class= "total"> TOTAL $ ${total}</div>
    <button class= "btn btn-danger finalizar" id="finalizar" onClick="finalizarCompra()"> FINALIZAR COMPRA </button>`;
    modalCarrito.appendChild(totalContainer);
  } else {
    modalCarrito.classList.remove("cart");
  }
};


//let cart = [];

const removeProduct = (indice) => {
  cart.splice(indice, 1);
  actualizarStorage(cart);
  dibujarCarrito();
};

const actualizarStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
  console.log(cart)
};

if (localStorage.getItem("cart")) {
  cart = JSON.parse(localStorage.getItem("cart"));
  dibujarCarrito();
}



const finalizarCompra = () => {
  const total = document.getElementsByClassName("total")[0].innerHTML;
  modalCarrito.innerHTML = "";
  const compraFinalizada = `<div class="compra-finalizada"><p class="compra-parrafo"> PASAME UNOS DATOS Y LA COMPRA ES TUYA, EL   ${total} </p></div>
  <div class="datos-cliente">
  <p class="datos-parrafo"> Completa el formulario con tus datos para coordinar la entrega</p>
  <button class= "btn btn-danger formulario" id="formulario" onClick="dibujarFormu()"> FORMULARIO </button>
  </div>`;
  modalCarrito.innerHTML = compraFinalizada;
};
const dibujarFormu = () => {
  modalCarrito.innerHTML = "";
  const formulario = `
  <h2 class="datos"> DATOS PARA EL ENVÍO </h2>
  <div class="contact__secction-container">
   <div class="row">
     <div class="contact__secction__item">
       <label>Nombre *</label>
       <input type="text" id="nombre" placeholder="Nombre "  />
     </div>
     <div class="contact__secction__item">
       <label>E-mail </label>
       <input type="email" id="email" placeholder="E-mail" />
     </div>
     <div class="contact__secction__item">
       <label>Telefono</label>
       <input type="number" id="telefono" placeholder="Telefono "  />
     </div>
     <div class="contact__secction__item">
       <label>Domicilio *</label>
       <input type="text" id="domicilio" placeholder="Domicilio " />
     </div>
     <div class="contact-button">
       <button type="button" class="btn btn-dark envio" onClick="mostrarMensaje()" >Confirmar</button>
     </div>
   </div>
 </div>`;
  modalCarrito.innerHTML = formulario;
};


const mostrarMensaje = () => {
  const nombreCliente = document.getElementById("nombre").value;
  if (nombreCliente.length < 3 ) {
    Toastify({
      text: "complete el campo nombre",
      position:"center",
    }).showToast();
    return false;
}
  const domicilioCliente = document.getElementById("domicilio").value;
  if (domicilioCliente < 5) {
    Toastify({
      text: "complete el campo domicilio",
      position:"center"
    }).showToast();
    return false;
  }
  modalCarrito.innerHTML = "";
  let mensaje = `<div class="mensaje-final">Gracias <b> ${nombreCliente} </b> por su compra! en 72 horas recibira su paquete en <b>${domicilioCliente}</b> </div>`;
  modalCarrito.innerHTML = mensaje;
};