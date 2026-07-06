// Overlay general para modales, hamburgers ...
export const overlay = document.querySelector(".overlay");

// Inicializa tras cargar página completamente
window.addEventListener('load', function(event) {
    setCarousels();
    buttonUpPage();
    setStatusMessage('Cargando resultados...');

    // index.html
    // showBestSeller();
});

/** BOTON BUSCAR */
const searchBtn = document.querySelector(".search-button");

searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "busqueda.html";
    
});

/*******************************************
 * CARRUSELS
 *******************************************/

function setCarousels(){
    // NodeList de carousels
    const carousels = document.querySelectorAll(".carousel"); 

    // Cards visibles según viewport
    function getVisibleCards() {
        if (window.innerWidth <= 700) { return 1; } 
        else if (window.innerWidth <= 900) { return 2; } 
        else { return 3; }
    }


    // Recorre NodeList
    carousels.forEach(carousel => {
        // track (contenedor con todas las carousel-item)
        const track = carousel.querySelector(".carousel-track");

        // botones de desplazamiento 
        const nextBtn = carousel.querySelector(".next");
        const prevBtn = carousel.querySelector(".prev");

        
        // Si no hay track ni botones, salir
        if (!track || !nextBtn || !prevBtn) return;


        // posición actual (grupo de cards visibles en el track)
        let index = 0; 
        // cards máximas visibles
        const visibleCards = getVisibleCards();

        // Cuánto desplazar track:
        // Desktop de 3 en 3
        // Tablet de 2 en 2
        // Mobile de 1 en 1
        function updateCarousel() {
            
            // Si no hay cards, salir
            const cards = track.querySelectorAll(".carousel-item");
            if (cards.length === 0) return;

            // Calcula tamaño máximo de una card + gap entre cards            
            const cardWidth = cards[0].offsetWidth;
            const gap = parseFloat(getComputedStyle(track).gap) || 0;


            // Calcula cuántos px mover el track en base a lo anterior
            const totalMove = index * (cardWidth + gap);
            track.style.transform = `translateX(-${totalMove}px)`;
        }

        // Límite máximo de desplazar track - da index máximo del track
        // Si 6 cards, avanza de 1 en 1, y son visibles 3 cards: 
        // solo se puede desplazar adelante 3 veces más (cards restantes)
        function getMaxIndex() {
            const totalCards = track.querySelectorAll(".carousel-item").length;
            return totalCards - visibleCards;
        }


        // Eventos
        nextBtn.addEventListener("click", () => {
            if (index < getMaxIndex()) {
                index++;
                updateCarousel();
            }
        });

        prevBtn.addEventListener("click", () => {
            if (index > 0) {
                index--;
                updateCarousel();
            }
        });

        // ACCESIBILIDAD. Con teclas de dirección <- ->
        carousel.addEventListener("keydown",(e)=>{
            if(e.key==="ArrowRight"){
                index++;
                updateCarousel();
            }
            if(e.key==="ArrowLeft"){
                index--;
                updateCarousel();  
            }
        });


        // Recalcula en cambios de tamaño de pantalla
        window.addEventListener("resize", updateCarousel);
    });
}



/*******************************************
 * BOTÓN SUBIR A PARTE SUPERIOR DE LA PÁGINA
 *******************************************/

// Mostrar botón
function buttonUpPage() {
    const btn = document.getElementById("btnSubir");

    // Cada que haga scroll, se ejecutará la función.
    window.addEventListener("scroll", () => {
        // Si scrollY > 0 (ha hecho scroll hacia abajo)
        if (window.scrollY > 0) {
            // cambia estilo de btn a display = "block" (visible)
            btn.style.display = "block";
        } 
        else { btn.style.display = "none"; }
    });

    btn.addEventListener("click", scrollToTop);
}

// Subir a parte superior tras click
function scrollToTop() {
    // window.scrollTo(x, y)     método para hacer scroll hacia posición específica.
    window.scrollTo({ top: 0, behavior: 'smooth' });
}



/*******************************************
 * ATAJO DE TECLADO
 * Alt + flecha hacia arriba
 * Lleva a la posición superior de la página
 *******************************************/

document.addEventListener("keydown", function(e) {
    // Alt + ArrowUp
    if (e.altKey && e.key === "ArrowUp") {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});



/*******************************************
 * ACCESIBILIDAD. MENSAJES PARA LECTORES DE PANTALLA
 *******************************************/

const statusMessage = document.getElementById('statusMessage');
// Crear mensajes de estado
export function setStatusMessage(message) {
    // inserta mensaje
    statusMessage.textContent = message; 
    
    // queda insertado 3 segundos y después lo limpia
    setTimeout(() => {  statusMessage.textContent = ''; }, 3000); 
}



/*******************************************
 * HAMBURGER MENU MOBILE 
 * (Header Side Navigation)
 *******************************************/

// botón para abrir
const hamburger = document.querySelector('.hamburger');
// navegador mobile
const nav = document.querySelector('.nav-mobile');
// botón para cerrar
const btnCloseNav = nav.querySelector(".btn-close");
// ACCESIBILIDAD. Primer enlace del menu
const primerEnlace = nav.querySelector("a");


// EVENTOS 

hamburger.addEventListener("click", () => {

    nav.style.display = "flex";

    // ejecuta esto justo antes de que el navegador vuelva a pintar la pantalla
    requestAnimationFrame(() => {
        const abierto = nav.classList.add("active");
        // overlay.classList.toggle("active", abierto);
        overlay.classList.add("active");
        // document.body.classList.toggle("overlay-active", abierto);
        document.body.classList.add("overlay-active");

        // ACCESIBILIDAD. Indicar menu abierto y focus en primer enlace
        hamburger.setAttribute("aria-expanded","true");
        primerEnlace.focus();
    });
});

// ACCESIBILIDAD. Navegación con teclado

nav.addEventListener("keydown", e => {
    // Selecciona todos los elementos focusables en el Side Navigator
    let focusableNodeList = nav.querySelectorAll(
        'a, button, input, [tabindex]:not([tabindex="-1"])'
    );
    const focusable = [...focusableNodeList];

    // Indice de actual focus, actualizado cada vez se presiona una tecla 
    const current = focusable.indexOf(document.activeElement);


    // Cerrar con Escape
    if (e.key === "Escape") {
        closeNavHeaderMobile();
        return;
    }
    
    // Navegación con Tab
    if (e.key === "Tab") {
        // Retroceso
        if (e.shiftKey) {
            // si esta en primero, salta al ultimo focusable
            if (current <= 0) {
                e.preventDefault();
                focusable[focusable.length - 1].focus();
            } // si no, retrocede normal
        }
        // Avance
        else {
            // si esta en el ultimo, salta al primer focusable
            if (current === focusable.length - 1) {
                e.preventDefault();
                focusable[0].focus();
            } // si no, avanza normal
        }

        return;
    }
    
    // Navegación con flechas
    // Retroceso
    if (e.key == "ArrowUp") {
        e.preventDefault();

        if (current <= 0){
            focusable[focusable.length - 1].focus();
        } 
        else { focusable[current - 1].focus(); }

        return;
    }

    // Avance    
    if (e.key == "ArrowDown") {
        e.preventDefault();

        if (current >= focusable.length - 1) {
            focusable[0].focus();
        }
        else { focusable[current + 1].focus(); }

        return;            
    }
});

overlay.addEventListener("click", closeNavHeaderMobile);
btnCloseNav.addEventListener("click", closeNavHeaderMobile);

function closeNavHeaderMobile(){
    nav.classList.remove("active");

    // Tras la transición de desaparición, display:none y limpia listener 
    nav.addEventListener("transitionend", function cerrar() {
        nav.style.display = "none";
        nav.removeEventListener("transitionend", cerrar);

        overlay.classList.remove("active");
        document.body.classList.remove("overlay-active");

        // ACCESIBILIDAD. Indicar menu cerrado y focus en botón que lo abre 
        hamburger.setAttribute("aria-expanded","false");
        hamburger.focus();
    });
}



/*** Animación canvas de carga ***/
/*
var canvas = document.getElementById("canvas");
var dibujo = canvas.getContext("2d");

var progress = 0; // variable de control de animación

function dibujaLibro() {
    dibujo.clearRect(0, 0, canvas.width, canvas.height); // Limpia el lienzo    
    dibujo.beginPath();    // evita que el nuevo dibujo se mezcle con otras figuras previamente trazadas en el canvas.
                        // en este caso, el lápiz se uniría ae estas lineas en lugar de ser un trazo independiente.

    dibujo.rect(150, 100, 100, 100); // Define el rectángulo (será el libro)
    dibujo.fillStyle = "#FFF"; // Define el relleno del rectángulo
    dibujo.fill(); // DIBUJA el relleno del rectángulo, para que sea visible
    dibujo.strokeStyle = "#8B4513"; // Define el estilo del borde del rectángulo
    dibujo.lineWidth = 4; // Define el grosor del borde del rectángulo
    dibujo.stroke(); // DIBUJA el borde del rectángulo

    
    dibujo.beginPath();
    dibujo.strokeStyle = "#000"; // Define el estilo de la línea negra a la mitad del rectángulo para el lomo
    dibujo.lineWidth = 1; // Define el grosor de la línea
    dibujo.moveTo(200, 100); // vector de partida
    dibujo.lineTo(200, 200); // vector final
    dibujo.stroke(); // DIBUJA la línea

    
    dibujo.font = "16px Arial"; // Define la fuente del texto
    dibujo.fillStyle = "black"; // Define el estilo del texto
    dibujo.fillText("Cargando...", 160, 80); // DIBUJA el texto
}


// CONTROL DEL ANIMACIÓN.
// - El vector de partida va modificando su posición x en cada incremento de progreso
// - Lo mismo con el vector final (movimiento horizontal lineal)
function dibujaLapiz(progress) {
    dibujo.beginPath();
    dibujo.moveTo(180 + progress * 20, 140); // vector de partida
    dibujo.lineTo(190 + progress * 20, 160); // vector final
    dibujo.strokeStyle = "black";
    dibujo.lineWidth = 2;
    dibujo.stroke();
}


// CONTROL DEL ANIMACIÓN.
// ** Variable progreso va progresando de 0 a 1 en incremento de 0.02 cada bucle.
// - Primero, animacion() se ejecuta y dibuja el libro y la pluma en su posición inicial, pasando a cada función la variable progreso 
// como parametro para actualizar posiciones.
// - Luego, setTimeout(animacion, 16) hace que se ejecute de nuevo esta misma funcion animacion() cada 16ms.
// - Este proceso se repite hasta que progress llegue a 1 (es decir, hasta que la animación termine).
function animacion() {
    if (progress < 1) {
        progress += 0.02;
        dibujaLibro(progress);
        dibujaLapiz(progress);
        setTimeout(animacion, 16);
    }
}

animacion();

// Simula que la página ha cargado después de 3 segundos
setTimeout(() => {
    document.getElementById("canvas").style.display = "none"; // Oculta el canvas completo tras 3 segundos
}, 3000);
*/