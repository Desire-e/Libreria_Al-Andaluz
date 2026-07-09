import { overlay } from "./main.js";


window.addEventListener('load', function(event) {
    // limpieza inicial
    cleanFilters();

    initSelectOrden();
});


/*******************************************
 * BOTON LIMPIAR FILTROS
 *******************************************/

const btnCleanFilters = document.querySelectorAll(".btn-clean");

const cbsFilters = document.querySelectorAll('.filtros-body input[type="checkbox"]');
            

btnCleanFilters.forEach( btn => {
    btn.addEventListener("click", cleanFilters);
});


function cleanFilters(e) {
    // Limpiar checkboxes
    cbsFilters.forEach( cb => { cb.checked = false; });

    // Limpia input range (precio) de mobile (dialog) y desktop (aside)
    document.querySelectorAll(".range-container").forEach(container => {

        const minRange = container.querySelector(".minRange");
        const maxRange = container.querySelector(".maxRange");

        minRange.value = 1;
        maxRange.value = 100;

        container.querySelector(".minValue").textContent = "1 €";
        container.querySelector(".maxValue").textContent = "100 €";
    });
}



/*******************************************
 * ACCORDIONS DE CADA FILTRO
 *******************************************/
// Acordeones
const accordions = document.querySelectorAll(".accordion-item");

// Recorre acordeones
accordions.forEach( (accordion, index) => {
    
    // Obtiene header (boton) de un accordion 
    const header = accordion.querySelector(".accordion-header");

    // Obtiene checkboxes del body de un accordion
    const cboxes = accordion.querySelectorAll('input[type="checkbox"]');

    const accordionOpen = false;
    
    
    // EVENTOS 
    
    // Evento inicializar
    document.addEventListener("DOMContentLoaded", () => {
        // Todos los accordion cerrados (opacidad 0 y display none)
        accordion.classList.remove("active");
        // Accesibilidad
        header.setAttribute("aria-expanded", "false");
    });

    // Evento click en accordion
    header.addEventListener("click",()=>{
        
        // Evita que se queden abiertos más de un accordion
        // cierra todos los demás accordion
        accordions.forEach(acc => {
            if(acc !== accordion) { 
                acc.classList.remove("active"); 
                // Accesibilidad
                acc.querySelector(".accordion-header").setAttribute("aria-expanded", "false");
            }
        });

        // Abre accordion clickado 
        const accordionOpen = accordion.classList.toggle("active");
        // Accesibilidad
        header.setAttribute("aria-expanded", accordionOpen);
    });


    // Accesibilidad. Evento navegación de checkboxes con teclado
    cboxes.forEach((cb, i) => {
        cb.addEventListener("keydown", e => {

            if(e.key==="Enter"){
                e.preventDefault();

                // marcar checkbox Enter
                cb.checked = !cb.checked;
            }
            else if(e.key==="ArrowDown"){
                e.preventDefault();

                // avanza si no llegó al final
                if(i < cboxes.length - 1){
                    cboxes[i + 1].focus();
                }
            }
            else if(e.key==="ArrowUp"){
                e.preventDefault();

                // retrocede si no llegó al inicio
                if(i > 0){
                    cboxes[i - 1].focus();
                }
            }
        });
    });
});

// Accesibilidad. Evento navegación de accordions con teclado

const headers = document.querySelectorAll(".accordion-header");

headers.forEach((header, index) => {
    header.addEventListener("keydown", e => {
        if(e.key==="ArrowDown"){
            e.preventDefault();

            // avanza si no llegó al final
            if(index < headers.length - 1){
                headers[index + 1].focus();
            }

        }
        else if(e.key==="ArrowUp"){
            e.preventDefault();

            // retrocede si no llegó al inicio
            if(index > 0){
                headers[index - 1].focus();
            }
            // si llegó al inicio, foco en el btn-clean correspondiente (aside o dialog)
            else {
                header.closest('aside, dialog').querySelector('.btn-clean').focus();
            }
        }
    });    
});




/*******************************************
 * RANGO INPUT DOBLE (filtro precio)
 *******************************************/

let minRanges =  document.querySelectorAll(".minRange");
let maxRanges = document.querySelectorAll(".maxRange");


minRanges.forEach(range => {
    range.addEventListener("input", update);
});
maxRanges.forEach(range => {
    range.addEventListener("input", update);
});


function update(e = null) {
    // Detecta si está en mobile (dialog) o desktop (aside)

    // obtener los elementos relativos al container del slider pulsado
    const container = e.currentTarget.closest(".range-container");

    const minRange = container.querySelector(".minRange");
    const maxRange = container.querySelector(".maxRange");

    const minValue = container.querySelector(".minValue");
    const maxValue = container.querySelector(".maxValue");


    let min = parseInt(minRange.value);
    let max = parseInt(maxRange.value);

    if(min >= max){
        min = max - 1;
        minRange.value = min;
    }

    minValue.textContent = min + " €";
    maxValue.textContent = max + " €";
}


/*******************************************
 * FILTROS, MOBILE VERSION (MODAL)
 *******************************************/
const btnFiltros = document.querySelector('.filtros-btn'); // Para abrir modal de filtros (MOBILE)
const dialog = document.querySelector('dialog#filtros'); // Modal de filtros (MOBILE)
const btnCloseFiltros = dialog.querySelector(".btn-close");  // Para cerrar modal

// EVENTOS
btnFiltros.addEventListener("click",abrirModalFiltros);
btnCloseFiltros.addEventListener("click", cerrarModalFiltros);

// .show() - Muestra la etiqueta dialog
// .showModal() - Muestra el dialog como un modal, bloqueando el resto del contenido.
// .close() - Oculta la etiqueta dialog

function cerrarModalFiltros(){
    // Closes the dialog
    dialog.close();
}

function abrirModalFiltros(){
    // Opens as non-modal (equivalent to dialog.show())
    // dialog.setAttribute('open', '');

    // Opens as modal (traps focus, blocks background)
    dialog.showModal();
}


/*******************************************
 * ORDEN DE RESULTADOS, CUSTOM SELECT
 *******************************************/

// container select
const selectContainer = document.querySelector('.custom-select.orden');

// boton desplegable con option seleccionado 
const select = selectContainer.querySelector('.select');

// todos los options
const optionsContainer = selectContainer.querySelector(".options");
const options = optionsContainer.querySelectorAll('.option');

// option seleccionado
const selectedOptText = select.querySelector("div span:nth-child(2)");

// flechas
const arrowClose = selectContainer.querySelector(".bi.bi-chevron-down");
const arrowOpen = selectContainer.querySelector(".bi.bi-chevron-right");

let isOpen = false;


// EVENTOS

// Abrir/cerrar custom-select
select.addEventListener('click', openCloseSelect);
selectContainer.addEventListener('focusout', (e) => {

    // e.relatedTarget = el elemento al que va el foco
    const next = e.relatedTarget;

    // si el foco no está dentro del custom-select, cerrar
    if (!selectContainer.contains(next)) {
        closeSelect();
    }
});


options.forEach((opt, i) => {

    // Seleccionar option    
    opt.addEventListener('click', ()=>{ newSelectedOption(opt) }); 

    // ACCESIBILIDAD. Navegación con teclado entre options
    opt.addEventListener("keydown", e => {
        if(e.key==="Enter"){
            e.preventDefault();

            // marcar option
            newSelectedOption(opt);
        }
        
        if(e.key==="ArrowDown"){
            e.preventDefault();

            // avanza si no llegó al final
            if(i < options.length - 1){
                options[i + 1].focus();
            }
        }
        
        if(e.key==="ArrowUp"){
            e.preventDefault();

            // retrocede si no llegó al inicio
            if(i > 0){
                options[i - 1].focus();
            }
        }

        if (e.key === "Escape") {
            closeSelect();
            return;
        }
    });
});

select.addEventListener("keydown", e =>{
    if (e.key === "Escape") {
        closeSelect();
        return;
    }
})


// Inicializar
function initSelectOrden(){
    // Flechas en estado cerrado
    arrowClose.style.display = 'block';
    arrowOpen.style.display = 'none';

    // Option seleccionada por defecto (primer option)
    const defaultOpt = document.querySelector('.options .option:first-child');
        
    
    // cambiar texto del seleccionado
    // selectedOptText.textContent = defaultOpt.querySelector('p').textContent.trim();
    selectedOptText.textContent = defaultOpt.textContent.trim();
    
    // actualizar valor
    select.dataset.selected = defaultOpt.dataset.value;

    options.forEach(opt => {
        // actualiza aria-selected="true"
        opt.setAttribute('aria-selected', opt === defaultOpt ? 'true' : 'false');
    
        // roving tabindex para solo navegar con flechas
        opt.setAttribute('tabindex', opt === defaultOpt ? '0' : '-1');
    });
}

function openCloseSelect(){
    selectContainer.classList.toggle('open');

    isOpen = selectContainer.classList.contains('open');

    arrowClose.style.display = isOpen ? 'none' : 'block';
    arrowOpen.style.display = isOpen ? 'block' : 'none';

    select.setAttribute("aria-expanded", isOpen);
}

function closeSelect() {
    selectContainer.classList.remove('open');

    isOpen = false;

    arrowClose.style.display = 'block';
    arrowOpen.style.display = 'none';

    select.setAttribute("aria-expanded", "false");
}

function newSelectedOption(option) {                    
    // cambiar texto del seleccionado
    selectedOptText.textContent = option.querySelector('p').textContent.trim();

    // actualizar valor
    select.dataset.selected = option.dataset.value;

    options.forEach(opt => {
        // actualiza aria-selected="true"    
        opt.setAttribute('aria-selected', opt === option ? 'true' : 'false');
        
        // roving tabindex para solo navegar con flechas
        opt.setAttribute('tabindex', opt === defaultOpt ? '0' : '-1');
    });

    // cerrar
    closeSelect();
}



