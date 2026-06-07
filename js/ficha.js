import { overlay } from "./main.js";


window.addEventListener('load', function(event) {
    navigatorBar();
    carouselThumbnails();
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
    comentContent.classList.remove("active-content");

    descNav.classList.add("active-navbar");
    comentNav.classList.remove("active-navbar");
}

// 
function setContenidos(e){
    // si el clicado es descNav
    // y no esta activo
    if ((e.currentTarget.classList.contains("descripcion")) && 
    (!e.currentTarget.classList.contains("active-navbar"))) {
        
        // activa descripcion
        descContent.classList.add("active-content");
        descNav.classList.add("active-navbar");
        // descativa comentarios
        comentContent.classList.remove("active-content");
        comentNav.classList.remove("active-navbar");
    
    }
    // si el clicado es comentNav
    // y no esta activo
    else if ((e.currentTarget.classList.contains("comentarios")) &&
    (!e.currentTarget.classList.contains("active-navbar"))) {

        // activa comentarios
        comentContent.classList.add("active-content");
        comentNav.classList.add("active-navbar");
        // descativa descripcion
        descContent.classList.remove("active-content");
        descNav.classList.remove("active-navbar");
    }
}


/*******************************************
 * CAROUSEL 
 * (thumbnails de imagen del libro) 
 *******************************************/
    
function carouselThumbnails(){
    const principalImage = document.querySelector(".principal-image");

    const thumbs = document.querySelectorAll(".carousel.thumbs .carousel-item");
    const track = document.querySelector(".carousel.thumbs .carousel-track");

    const prev = document.querySelector(".carousel.thumbs .prev");
    const next = document.querySelector(".carousel.thumbs .next");

    let currentIndex = 0;


    // EVENTOS 

    // Cambiar imagen grande principal
    thumbs.forEach((thumb, index) => {

        thumb.addEventListener("click", () => {

            // cambia src al src de la imagen seleccionada
            const image = thumb.querySelector("img");
            principalImage.src = image.src;

            // aparece activa en carousel (opacidad 1)
            thumbs.forEach(t =>
                t.classList.remove("active")
            );

            thumb.classList.add("active");

            // indice de imagen activa
            currentIndex = index;
        });

    });

    // Scroll carousel
    function updateCarousel(){
        const thumbWidth = thumbs[0].offsetWidth + 13;
        track.style.transform = `translateX(-${currentIndex * thumbWidth}px)`;
    }


    next.addEventListener("click", () => {
        if(currentIndex < thumbs.length - 1){
            currentIndex++;
            
            updateCarousel();
            thumbs[currentIndex].click();
        }
    });

    prev.addEventListener("click", () => {
        if(currentIndex > 0){
            currentIndex--;

            updateCarousel();
            thumbs[currentIndex].click();
        }
    });
}
