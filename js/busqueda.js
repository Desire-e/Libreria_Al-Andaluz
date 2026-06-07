import { overlay } from "./main.js";


window.addEventListener('load', function(event) {
    // limpieza inicial
    cleanFilters();

    initSelectOrden();
});


/*******************************************
 * BOTON LIMPIAR FILTROS
 *******************************************/

const btnCleanFilters = document.querySelector(".btn-clean");
const cbsFilters = document.querySelectorAll('.filtros-body input[type="checkbox"]');
            
btnCleanFilters.addEventListener("click", (e) => { cleanFilters(e); });

function cleanFilters(e) {
    // Limpiar checkboxes
    cbsFilters.forEach( cb => { cb.checked = false; });

    // Limpiar input range (precio)
    minRange.value = 1;
    maxRange.value = 100;
    update();               
}



/*******************************************
 * ACCORDIONS FILTROS
 *******************************************/
            
const accordions = document.querySelectorAll(".accordion-item");

accordions.forEach( accordion => {
    const header = accordion.querySelector(".accordion-header");

    // EVENTOS 
    
    // Evento inicializar
    document.addEventListener("DOMContentLoaded", () => {
        // Todos los accordion cerrados
        accordion.classList.remove("active");
    });


    // Evento click en accordion
    header.addEventListener("click",()=>{
        
        // Evita que se queden abiertos más de un accordion
        // cierra todos los demás accordion
        accordions.forEach(acc => {
            if(acc !== accordion) { acc.classList.remove("active"); }
        });

        // Abre accordion clickado 
        accordion.classList.toggle("active");
    });
});



/*******************************************
 * RANGO INPUT DOBLE (filtro precio)
 *******************************************/

const minRange = document.getElementById("minRange");
const maxRange = document.getElementById("maxRange");

const minValue = document.getElementById("minValue");
const maxValue = document.getElementById("maxValue");

// EVENTOS
minRange.addEventListener("input", update);
maxRange.addEventListener("input", update);

function update() {

    let min = parseInt(minRange.value);
    let max = parseInt(maxRange.value);

    if(min >= max){
        min = max - 1;
        minRange.value = min;
    }

    minValue.textContent = min + " €";
    maxValue.textContent = max + " €";
}

// ya en evento load implicito con clean...()
// update();



/*******************************************
 * SELECT CUSTOM 
 * (filtro orden, modal mobile) 
 *******************************************/

const btnFiltros = document.querySelector('.filtros-btn');
const filtros = document.querySelector('section.filtros');
const btnCloseFiltros = filtros.querySelector(".btn-close");

// EVENTOS
btnFiltros.addEventListener("click",abrirModalFiltros);
btnCloseFiltros.addEventListener("click", cerrarModalFiltros);
overlay.addEventListener("click", cerrarModalFiltros);

function cerrarModalFiltros(){
    filtros.classList.remove("active");
    overlay.classList.remove("active");
    
    document.body.classList.remove("overlay-active");
}

function abrirModalFiltros(){
    filtros.classList.toggle("active");
    overlay.classList.toggle("active");

    document.body.classList.add("overlay-active");
}


/*******************************************
 * CUSTOM SELECT 
 * (orden de resultados)
 *******************************************/

// container select
const select = document.querySelector('.custom-select.orden');
// boton desplegable con option seleccionado
const selectBtn = select.querySelector('.select-btn');
// container option seleccionado
const selectedOpt = select.querySelector('.selected');            
// option seleccionado
const selectedText = selectedOpt.querySelector("p:last-child");
// flechas
const arrowClose = select.querySelector(".bi.bi-chevron-down");
const arrowOpen = select.querySelector(".bi.bi-chevron-right");

// EVENTOS

// Abrir options
selectBtn.addEventListener('click', openSelect);

// Seleccionar option
select.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', () => {                    
        // cambiar texto del seleccionado
        selectedText.textContent = option.textContent.trim();

        // actualizar valor
        selectedOpt.dataset.selected = option.dataset.value;

        // cerrar
        closeSelect();
    });
});

function openSelect(){
    select.classList.toggle('open'); 

    let isOpen = select.classList.contains('open');
    arrowClose.style.display = isOpen ? 'none' : 'block';
    arrowOpen.style.display = isOpen ? 'block' : 'none'
}

function closeSelect(){
    select.classList.remove('open');

    let isOpen = select.classList.contains('open');
    arrowClose.style.display = isOpen ? 'none' : 'block';
    arrowOpen.style.display = isOpen ? 'block' : 'none'
}

// Inicializar
function initSelectOrden(){
    // Flechas en estado cerrado
    arrowClose.style.display = 'block';
    arrowOpen.style.display = 'none';

    // Option seleccionada por defecto (primer option)
    let defaultOpt = select.querySelector('.option:first-child');
        
    // cambiar texto del seleccionado
    selectedText.textContent = defaultOpt.textContent.trim();
    // actualizar valor
    selectedOpt.dataset.selected = defaultOpt.dataset.value;
}
// // Inicializar
// document.addEventListener("DOMContentLoaded", () => {
//     // Flechas en estado cerrado
//     arrowClose.style.display = 'block';
//     arrowOpen.style.display = 'none';

//     // Option seleccionada por defecto (primer option)
//     let defaultOpt = select.querySelector('.option:first-child');
        
//     // cambiar texto del seleccionado
//     selectedText.textContent = defaultOpt.textContent.trim();
//     // actualizar valor
//     selectedOpt.dataset.selected = defaultOpt.dataset.value;
//     // cerrar
//     // closeSelect();
// });



            


            


