import { getRecipes } from '../utils/helper.js';
import { cardFactory } from '../factories/card.js';

const { recipes } = await getRecipes();

export function extractIngredients(recipe) {
    return recipe.ingredients.map(i => i.ingredient.toLowerCase())
}

function extractAllIngredients(recipes) {
    let ingredients = recipes.map(recipe => {
        return recipe.ingredient.map(i => i.toLowerCase())
    })
    return new Set(ingredients.flat())
};

function extractAllAppliances(recipes) {
    let appliances = recipes.map(recipe => {
        return recipe.appliance.toLowerCase()
    })
    return new Set(appliances.flat())
};

function extractAllUstensils(recipes) {
    let ustensils = recipes.map(recipe => {
        return recipe.ustensils.map(i => i.toLowerCase())
    })
    return new Set(ustensils.flat())
};

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
        const searchBtn = container.querySelector('.input-btn');

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

// Display message when no recipes is found
async function noRecipesFound() {
    const cardSection = document.querySelector(".card_section");
    const message = document.createElement('p');
    message.innerHTML =`Aucune recette ne correspond à votre critère<br>Vous pouvez chercher « tarte aux pommes », « poisson », etc.`
    message.setAttribute('class', 'search-null')
    cardSection.appendChild(message)
    return (cardSection)
}

// Display cards in the DOM
async function displayData(recipes) {
    const cardSection = document.querySelector(".card_section");
    cardSection.innerHTML = "";
    recipes.forEach((recipe) => {
        const cardModel = cardFactory(recipe);
        const CardDOM = cardModel.getCardDOM();
        cardSection.appendChild(CardDOM);
    });
};

async function filterRecipesWithSearchBar(recipes){
    let searchBar = document.querySelector('.search_bar');
    let recipesFound = new Set();

    // Perform a search using the search bar 
        searchBar.addEventListener('input', function(e){
            let search = searchBar.value.toLowerCase();
            
            recipesFound = recipes.filter(recipe => {
                const name = recipe.name.toLowerCase();
                const description = recipe.description.toLowerCase();
                return (
                    name.includes(search) ||
                    description.includes(search) ||
                    recipe.ingredient.includes(search)
                )
            })

            // Condition to launch the search from 3 characters entered
            if(search.length >= 3){
                displayData(recipesFound);                
            }else{
                displayData(recipes)
            }

            // Condition to launch a message if no recipe is found
            if(!recipesFound.length){
                noRecipesFound()
            }

            // If we search for recipes in the search bar, the list of ingredients is modified
            ingredients(recipesFound);
            appliances(recipesFound);
            ustensils(recipesFound);
        })
}

// Filter the list of elements for tags
async function elementsListForTags(searchBar, elements, elementsFound){
    const button = searchBar.closest('button');
    const elementsList = button.querySelector('.element-list');

    searchBar.addEventListener('input', function(e) {
        let search = searchBar.value.toLowerCase()
        elementsFound = new Set();
        
        // Add ingredients found in the set
        elements.forEach(element => {
            if(element.includes(search)){
                elementsFound.add(element);
            }
        });

        // Filter elements of tags when searching for an element
        displayTagsElements(elementsFound, elementsList);
    })
    // Display original tag elements
    displayTagsElements(elements, elementsList);
}

// Ingredient information for tag elements
function ingredients(recipes){
    const searchBar = document.querySelector('.ingredients_input');
    let ingredients = extractAllIngredients(recipes);
    let ingredientsFound = new Set();
    let tagId = 'ingredients';
    elementsListForTags(searchBar, ingredients, ingredientsFound);
}

// Appliance information for tag elements
function appliances(recipes){
    const searchBar = document.querySelector('.appliances_input');
    let appliances = extractAllAppliances(recipes);
    let appliancesFound = new Set();
    let tagId = 'appliances';
    elementsListForTags(searchBar, appliances, appliancesFound);
}

// Ustensil information for tag elements
function ustensils(recipes){
    const searchBar = document.querySelector('.ustensils_input');
    let ustensils = extractAllUstensils(recipes);
    let ustensilsFound = new Set();
    let tagId = 'ustensils';
    elementsListForTags(searchBar, ustensils, ustensilsFound);
}

// Display elements for tags in DOM
async function displayTagsElements(elements, list){
    list.innerHTML = '';
    elements.forEach(element => {
        const a = document.createElement('a');
        a.setAttribute('class', 'ingredient-in-list');
        a.textContent = element;
        list.appendChild(a);
    });
}

// Buttons
displayBtn(recipes);
interactionsBtn();
// Cards
displayData(recipes);
// Search bar
filterRecipesWithSearchBar(recipes);
// Infos
ingredients(recipes);
appliances(recipes);
ustensils(recipes);