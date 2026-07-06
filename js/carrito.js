// En los módulos ES (type="module"), importar un solo elemento 
// de un módulo hace que se ejecute todo el módulo (una única vez).
import { overlay, setStatusMessage } from "./main.js";



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

    } 
    else if (!hasArticle){
        containerArticles.querySelector('.no-articles').style.display = 'block';

        // focus en mensaje
        containerArticles.querySelector('.no-articles').focus();
    }
}



/*******************************************
 * CODIGO PROMOCIONAL
 *******************************************/

const formsCodePromo = document.querySelectorAll("form.code-promo");

formsCodePromo.forEach(formCodePromo => {
    let codePromo = formCodePromo.querySelector(".code-promo-input");

    formCodePromo.addEventListener("submit", (e)=>{
        e.preventDefault();

        cleanFormError();   

        const regex = /^[A-Za-z]{2}\d{4}$/;

        if(codePromo.value.trim() > 6 
        || codePromo.value.trim() <= 0 
        || !regex.test(codePromo.value.trim())){
            setFormError("Código promocional inválido");        
            setStatusMessage("Código promocional inválido");
            codePromo.setAttribute("aria-invalid", "true");
            
            return;
        }

        setStatusMessage("Código promocional aplicado");
        if(codePromo.hasAttribute("aria-invalid")){
            codePromo.removeAttribute("aria-invalid");
        }    
        codePromo.value="";
        
        return;
    }); 



    function setFormError(message){
        // Crear elemento error
        const pError = document.createElement("p");
        pError.textContent = message;
        pError.classList.add("form-error", "text-sm");

        // Añadir error al final del form
        formCodePromo.append(pError);
    }

    function cleanFormError(){
        // Comprobar si hay mensajes de error
        // Eliminar un hijo por referencia
        const pError = formCodePromo.querySelector(".form-error");
        if(pError) pError.remove(); 
    }

});


