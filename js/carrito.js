// En los módulos ES (type="module"), importar un solo elemento 
// de un módulo hace que se ejecute todo el módulo (una única vez).
import { overlay, setStatusMessage } from "./main.js";

// Inicializa tras cargar página completamente
window.addEventListener('load', function(event) {
    setStatusMessage('Cargando resultados...');
    hasArticles();
});


/*******************************************
 * CONTAINER DE ARTICULOS
 *******************************************/

// articulos
const articles = [...document.getElementsByClassName('articulo')]; // HTMLCollection viva
// container
const containerArticles = document.querySelector('.container-articulos');

// EVENTOS

articles.forEach( art => {
    art.querySelector('.article-plus-btn').addEventListener('click', (e)=> { setArticleAmount(e) });
    art.querySelector('.article-minus-btn').addEventListener('click', (e)=> { setArticleAmount(e) });    
});

// Cambiar cantidad del articulo
function setArticleAmount(e){
    let btn = e.currentTarget;
    let articleAmount;            

    if (btn.classList.contains('article-plus-btn')){
        articleAmount = btn.previousElementSibling;
        articleAmount.value++;
        
        setStatusMessage("Cantidad actualizada");
    }
    else if (btn.classList.contains('article-minus-btn')){
        articleAmount = btn.nextElementSibling;
        if(articleAmount.value > 0){
            articleAmount.value--;
            
            setStatusMessage("Cantidad actualizada");
        }

        if(articleAmount.value <= 0){
            let article = articleAmount.parentElement.parentElement.parentElement
            let hr = article.nextElementSibling

            article.remove();
            if (hr) hr.remove();

            setStatusMessage("Artículo eliminado");
            
            hasArticles();
        }
    }
}

// Detecta si quedan articulos en cesta
function hasArticles(){
    let hasArticle = containerArticles.querySelectorAll('.articulo').length > 0;

    if (hasArticle) {
        containerArticles.querySelector('.no-articles').style.display = 'none';

        // focus en siguiente articulo
        containerArticles.querySelector('.articulo .cover-wrapper a').focus();
        
        return;
    } 
    containerArticles.querySelector('.no-articles').style.display = 'block';

    // focus en mensaje
    containerArticles.querySelector('.no-articles').focus();

    setStatusMessage("No hay artículos en su cesta");
}



/*******************************************
 * CODIGO PROMOCIONAL
 * Para form mobile y form desktop
 *******************************************/

const formsCodePromo = document.querySelectorAll("form.code-promo");

formsCodePromo.forEach(formCodePromo => {

    // Obtiene su input según sea el formulario mobile o desktop
    let codePromoInput = formCodePromo.classList.contains("mobile") ? 
    formCodePromo.querySelector("#code-promo-input-mobile") :
    formCodePromo.querySelector("#code-promo-input-desk");

    // EVENTOS

    // Submit
    formCodePromo.addEventListener("submit", (e)=>{
        // Detiene comportamiento por defecto
        e.preventDefault();
        
        // Limpia mensajes error
        cleanFormError(); 
        
        
        // Validación
        const regex = /^[A-Za-z]{2}\d{4}$/;
        let valid = true;        
        if(!regex.test(codePromoInput.value.trim())) valid = false;


        // Texto para mensaje statusMessage polite y mensaje de error si aplica
        let message = valid ? "Código promocional aplicado" : "Código promocional inválido";
         
        // statusMessage
        setStatusMessage(message);
        // aria-invalid
        codePromoInput.setAttribute("aria-invalid", !valid);

        // Invalido:
        // - Mensaje de error visual
        // - No limpia input
        // - Aplica aria-describedby al input
        if (!valid) { 
            let errorMessage = setFormError(message);
            codePromoInput.setAttribute("aria-describedby", errorMessage.id);
            
            return;
        }
        
        // Limpia input si aplica (válido) 
        codePromoInput.value="";
        
        return;
    }); 


    // Crea mensaje de error visual y devuelve el elemento creado
    function setFormError(message){
        // Crear elemento error
        const pError = document.createElement("p");
        pError.textContent = message;
        pError.classList.add("form-error", "text-sm");
        pError.id="code-promo-error";

        // Añadir error al final del form
        formCodePromo.append(pError);

        return pError;
    }

    // Elimina mensaje de error visual
    function cleanFormError(){
        // Comprobar si hay mensajes de error
        // Eliminar un hijo por referencia
        const pError = formCodePromo.querySelector(".form-error");
        
        if(pError){
            pError.remove(); 
            codePromoInput.removeAttribute("aria-describedby"); // evita referencia a un id ya eliminado
        } 
    }

});


