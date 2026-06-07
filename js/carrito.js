import { overlay } from "./main.js";



/*******************************************
 * CONTAINER DE ARTICULOS
 *******************************************/

// Articulos
const articles = [...document.getElementsByClassName('articulo')]; // HTMLCollection viva
// Container
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
    }
    else if (btn.classList.contains('article-minus-btn')){
        articleAmount = btn.nextElementSibling;
        if(articleAmount.value > 0){
            articleAmount.value--;
        }

        if(articleAmount.value <= 0){
            let article = articleAmount.parentElement.parentElement.parentElement
            let hr = article.nextElementSibling

            article.remove();
            if (hr) hr.remove();

            hasArticles();
        }
    }
}

// Detecta si quedan articulos en cesta
function hasArticles(){
    let hasArticle = containerArticles.querySelectorAll('.articulo').length > 0;

    if (hasArticle) {
        document.querySelector('.no-articles').style.display = 'none';
    } 
    else if (!hasArticle){
        document.querySelector('.no-articles').style.display = 'block';
    }
}