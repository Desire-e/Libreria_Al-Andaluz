// 1) Importar la clase
import ShoppingCart from './ShoppingCart.mjs';

// 2) Crear (o cargar) un carrito
const cart = new ShoppingCart();          // por defecto usa key='carrito' y 21 % de IVA

// 3) Función que refresca el pequeño widget
function renderCart() {
  // Totales
  document.querySelector('#cant').textContent = cart.totalQty;
  document.querySelector('#sub').textContent = cart.subtotal.toFixed(2);
  document.querySelector('#iva').textContent = cart.tax.toFixed(2);
  document.querySelector('#tot').textContent = cart.total.toFixed(2);

  // Listado
  const lista = document.querySelector('#lista');
  lista.innerHTML = '';

  for (const [name, { qty, price }] of cart.cart) {
    lista.appendChild(generateCartLiText(name, qty, price));
  }
}

// Función de ayuda que define el estilo y distribución de los elementos
function generateCartLiText(name, qty, price) {
  return htmlToElement(
    `<li>
            ${qty} × ${name} — ${(qty * price).toFixed(2)} €
            <button class="btn-add-line" data-name="${name}" data-price="${price}" aria-label="Sumar uno">+</button>
            <button class="btn-sub-line" data-name="${name}" aria-label="Restar uno">−</button>
            <button class="btn-del-line" data-name="${name}" aria-label="Eliminar">✕</button>
        </li>
      `);
}

function htmlToElement(html) {
  var template = document.createElement("template");
  html = html.trim(); // Never return a text node of whitespace as the result 
  template.innerHTML = html;
  return template.content.firstChild;
}


// 4) Al cargar la página, pintamos lo que ya estuviera guardado
renderCart();

// 5) Delegamos clics en todo el catálogo
Array.from(document.querySelectorAll('.catalogo')).map(
  a => a.addEventListener('click', (e) => {
    if (!e.target.matches('.btn-add')) return;

    // Datos del artículo (tomados de atributos data-* del <article>)
    const card = e.target.closest('.producto');
    const name = card.dataset.name;
    const price = Number(card.dataset.price);
    const img = card.dataset.img;

    cart.add(name, price, { img });   // qty = 1 por defecto
    renderCart();
  }));

// 6) Botones para incrementar el carrito
document.querySelector('#lista').addEventListener('click', (e) => {
  const btn = e.target;

  // +1 unidad
  if (btn.matches('.btn-add-line')) {
    const name = btn.dataset.name;
    const price = Number(btn.dataset.price);     // viene del data-price del botón
    cart.add(name, price);                       // añade 1
  }

  // −1 unidad
  else if (btn.matches('.btn-sub-line')) {
    const name = btn.dataset.name;
    cart.reduce(name);                           // resta 1
  }

  // eliminar toda la línea
  else if (btn.matches('.btn-del-line')) {
    const name = btn.dataset.name;
    cart.remove(name);
  }

  renderCart();                                  // refresca siempre
});


// 6) Vaciar carrito
document.querySelector('#vaciar').addEventListener('click', () => {
  cart.clear();
  renderCart();
});


