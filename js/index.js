import { overlay } from "./main.js";


window.addEventListener('load', function(event) {
    showBestSeller();
});


/*******************************************
 * ANIMACIÓN FADE-IN AL APARECER EN PANTALLA 
 * (sección Best-Seller)
 * Usando Observable API
 *******************************************/

function showBestSeller(){
    // Crea un observador:
    // - Detecta cuando un elemento entra o sale del viewport
    // - Ejecuta acciones cuando eso sucede
    const observer = new IntersectionObserver(

        // entries - los elementos observados, que están entrando o saliendo del viewport.
        // observer - el propio observador
        (entries, observer) => {
            // recorre todos los elementos observados
            entries.forEach(entry => {
                // si el elemento está dentro del viewport
                if (entry.isIntersecting) {
                    // le añade .visible al elemento observado 
                    entry.target.classList.add("visible");
                }
                else { entry.target.classList.remove("visible"); }
            });
        },
        { threshold: 0.1  } // Se activa cuando al menos el 10% del elemento es visible
    
    );

    // selecciona el elemento a observar
    const target = document.querySelector(".destacada");
    
    // si el elemento seleccionado existe, comienza a observarlo.
    if (target) { observer.observe(target); } // Observa el elemento 
}

