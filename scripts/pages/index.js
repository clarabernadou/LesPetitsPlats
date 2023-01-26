import { getRecipes } from '../utils/helper.js';
import { cardFactory } from '../factories/card.js';

const { recipes } = await getRecipes();

export function extractIngredients(recipe) {
    return recipe.ingredients.map(i => i.ingredient.toLowerCase())
}

// Display buttons in the DOM
function displayBtn(recipes){
    const filterSection = document.querySelector(".filter_section");
    const btnModel = cardFactory(recipes);

    function blueBtn(){
        const btnDOM = btnModel.blueBtn();
        filterSection.appendChild(btnDOM);           
    }
    function greenBtn(){
        const btnDOM = btnModel.greenBtn();
        filterSection.appendChild(btnDOM);          
    }
    function redBtn(){
        const btnDOM = btnModel.redBtn();
        filterSection.appendChild(btnDOM);          
    }
    blueBtn(); greenBtn(); redBtn();
};

// Interactions to open and close buttons
function interactionsBtn(){
    const allMainBtn = document.querySelectorAll('.button');
    const allIconUp = document.querySelectorAll('.fa-chevron-up');
        
    allMainBtn.forEach(mainBtn => {
        const container = mainBtn.closest('.container');
        const searchBtn = container.querySelector('.input');

        mainBtn.addEventListener('click', function(e){
            mainBtn.style.display = 'none';
            searchBtn.style.display = 'flex';
        })

        allIconUp.forEach(iconUp => {
            iconUp.addEventListener('click', function(e){
                mainBtn.style.display = 'flex';
                searchBtn.style.display = 'none';
            })
        })
    });
};

// Display cards in the DOM
async function displayData(recipes) {
    const cardSection = document.querySelector(".card_section");
    recipes.forEach((recipe) => {
        const cardModel = cardFactory(recipe);
        const CardDOM = cardModel.getCardDOM();
        cardSection.appendChild(CardDOM);
    });
};

// Buttons
displayBtn(recipes);
interactionsBtn();
// Cards
displayData(recipes);

