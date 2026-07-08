import { overlay } from "./main.js";


window.addEventListener('load', function(event) {
    navigatorBar();
    initThumbTabs();
});



/*******************************************
 * NAVIGATOR BAR 
 * (comentarios y descripcion del libro)
 *******************************************/

// Contenidos
const descContent = document.querySelector(".descripcion.contenido");
const comentContent = document.querySelector(".comentarios.contenido");

// Navigator Bar
const descNav = document.querySelector(".descripcion.navbar");
const comentNav = document.querySelector(".comentarios.navbar");
 

// EVENTOS

// Inicializa - descripción visible por defecto
function navigatorBar() {
    descNav.addEventListener("click", (e) => { setContenidos(e); });
    comentNav.addEventListener("click", (e) => { setContenidos(e); });

    descContent.classList.add("active-content");
    descContent.setAttribute("aria-hidden", "false");
    comentContent.classList.remove("active-content");
    comentContent.setAttribute("aria-hidden", "true");

    descNav.classList.add("active-navbar");
    descNav.setAttribute("aria-selected", "true");
    comentNav.classList.remove("active-navbar");
    comentNav.setAttribute("aria-selected", "false");
}

// 
function setContenidos(e){
    // si el clicado es descNav
    // y no esta activo
    if ((e.currentTarget.classList.contains("descripcion")) && 
    (!e.currentTarget.classList.contains("active-navbar"))) {
        
        // activa descripcion
        descContent.classList.add("active-content");
        descContent.setAttribute("aria-hidden", "false");
        descNav.classList.add("active-navbar");
        descNav.setAttribute("aria-selected", "true");
        // desactiva comentarios
        comentContent.classList.remove("active-content");
        comentContent.setAttribute("aria-hidden", "true");
        comentNav.classList.remove("active-navbar");
        comentNav.setAttribute("aria-selected", "false");
    
    }
    // si el clicado es comentNav
    // y no esta activo
    else if ((e.currentTarget.classList.contains("comentarios")) &&
    (!e.currentTarget.classList.contains("active-navbar"))) {

        // activa comentarios
        comentContent.classList.add("active-content");
        comentContent.setAttribute("aria-hidden", "false");
        comentNav.classList.add("active-navbar");
        comentNav.setAttribute("aria-selected", "true");
        // descativa descripcion
        descContent.classList.remove("active-content");
        descContent.setAttribute("aria-hidden", "true");
        descNav.classList.remove("active-navbar");
        descNav.setAttribute("aria-selected", "false");

    }
}





/*******************************************
 * CAROUSEL 
 * (thumbnails de imagen del libro) 
 *******************************************/

function initThumbTabs() {

    // container de thumbnails (carousel tablist)
    const carouselThumbs = document.querySelector('.carousel.thumbs');

    // todos los items thumbnail (tabs)
    const thumbTabs = [...carouselThumbs.querySelectorAll('[role="tab"]')];

    // container de imagen principal (tabpanel)
    const tabpanelImage = document.getElementById('cover-principal');
    // imagen
    const principalImage = tabpanelImage.querySelector('img');

    // botones prev/next
    const prevBtn = carouselThumbs.querySelector('.prev');
    const nextBtn = carouselThumbs.querySelector('.next');
    
    // track que se desplaza
    const track = carouselThumbs.querySelector('.carousel-track');


    // UTILIDADES ITEMS THUMBS

    // índice de thumb activa actual
    let currentIndex = 0;
    // índice máximo de thumbs
    const maxIndex = thumbTabs.length - 1;

    
    // UTILIDADES CAROUSEL THUMBS

    // número de miniaturas visibles a la vez en el carousel
    const visibleThumbs = 3;
    // índice de desplazamiento actual del carousel (0 = mostrando desde la primera)
    let currentIndexCarousel = 0;
    // índice máximo de desplazamiento del carousel
    const maxIndexCarousel = Math.max(0, thumbTabs.length - visibleThumbs);


    //////////////
    // FUNCIONES
    //////////////

    // Desplazamiento visual del carousel (transform) según currentIndexCarousel
    function carouselScroll() {
        // calcula el % ancho máximo de las cards dentro del container: 100 / 3 = 35%
        const cardWidthPercent = 100 / visibleThumbs;
    
        // calcular cuánto se desplaza el track 
        // ejemplo: i1 --> 1 * 35 % = translateX(-35%))
        const offset = currentIndexCarousel * cardWidthPercent;
        track.style.transform = `translateX(-${offset}%)`;

        // desabilita botones en los extremos del carousel
        prevBtn.disabled = currentIndexCarousel === 0;
        nextBtn.disabled = currentIndexCarousel === maxIndexCarousel;
    }


    // Sincroniza el desplazamiento del carousel para que el thumb activo quede visible
    function syncCarouselScroll(indexThumb) {
        // si el thumb activo queda por delante de la ventana visible, avanza el carousel
        // ejemplo: 
        // si indexThumb = 3 (ultimo thumb del track) y currentIndexCarousel = 0 (primera "pagina") 
        // 3 > (0 + 3 - 1) --> avanza currentIndexCarousel = 3 - 3 + 1 = 1
        if (indexThumb > currentIndexCarousel + visibleThumbs - 1) {
            currentIndexCarousel = indexThumb - visibleThumbs + 1;
        }
        // si el thumb activo queda por detrás de la ventana visible, retrocede el carousel
        else if (indexThumb < currentIndexCarousel) {
            currentIndexCarousel = indexThumb;
        }

        // Clamp por seguridad
        currentIndexCarousel = Math.max(0, Math.min(currentIndexCarousel, maxIndexCarousel));

        // Realiza scroll visual
        carouselScroll();
    }


    // Seleccionar y activar un thumb
    function activateThumb(index, moveFocus = true) {

        // Recorre los thumbs a activar y desactivar
        thumbTabs.forEach((tab, i) => {
            const selected = i === index;

            tab.setAttribute('aria-selected', selected ? "true" : "false");
            tab.tabIndex = selected ? 0 : -1;
            tab.classList.toggle('active', selected);
        });

        currentIndex = index;

        // Indica en container de imagen principal (tabpanel) el thumb activado
        const activeTab = thumbTabs[currentIndex];
        tabpanelImage.setAttribute('aria-labelledby', activeTab.id);

        // Cambia src y alt de imagen principal, visualiza el thumb activado
        const activeImg = activeTab.querySelector('img');
        principalImage.src = activeImg.src;
        principalImage.alt = activeImg.alt;

        // Foco en el thumb activado (evitando el scroll implícito del navegador,
        // se gestiona el scroll manualmente con syncCarouselScroll())
        if (moveFocus) activeTab.focus({ preventScroll: true });

        // Mantiene el thumb activo visible dentro del carousel
        syncCarouselScroll(currentIndex);
    }

    //////////////
    // EVENTOS
    //////////////

    // -- Navegación con teclado (flechas), seleccionar thumb con flechas
    carouselThumbs.addEventListener('keydown', (e) => {

        let nextIndex = currentIndex;

        if (e.key === 'ArrowRight' && currentIndex < maxIndex) {
            nextIndex++;
        }
        else if (e.key === 'ArrowLeft' && currentIndex > 0) {
            nextIndex--;
        }
        else if (e.key === 'Home') {
            nextIndex = 0;
        }
        else if (e.key === 'End') {
            nextIndex = maxIndex;
        }
        else return;

        e.preventDefault();
        activateThumb(nextIndex);
    });


    // -- Uso de ratón, seleccionar thumbs con click
    thumbTabs.forEach((tab, i) => tab.addEventListener('click', () => activateThumb(i)));


    // -- Scroll del carousel con botones prev/next
    // solo desplazan visualmente, no cambian la selección
    nextBtn.addEventListener("click", () => {
        if (currentIndexCarousel < maxIndexCarousel) {
            currentIndexCarousel++;
            carouselScroll();
        }
    });

    prevBtn.addEventListener("click", () => {
        if (currentIndexCarousel > 0) {
            currentIndexCarousel--;
            carouselScroll();
        }
    });


    // -- Tab / Tab + Shift por defecto
    // solo seleccionará los btnPrev / btnNext habilitados y el thumb activado (roving tabindex)


    // Inicializa: activa y selecciona el primer thumb, sin robar el foco al cargar la página
    activateThumb(0, false);
}