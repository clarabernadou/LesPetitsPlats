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

// Display message when no recipes is found
async function noRecipesFound() {
    const cardSection = document.querySelector(".card_section");
    const message = document.createElement('p');
    message.innerHTML =`Aucune recette ne correspond à votre critère<br>Vous pouvez chercher « tarte aux pommes », « poisson », etc.`
    message.setAttribute('class', 'search-null')
    cardSection.appendChild(message)
    return (cardSection)
}

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
            ingredientsListForTags(recipesFound)
        })
}

// Filter the list of elements for tags
async function ingredientsListForTags(recipes){
    const searchBar = document.querySelector('.ingredients_input');
    const button = searchBar.closest('button');
    const elementsList = button.querySelector('.element-list');

    // Retrieve all ingredients
    let ingredients = extractAllIngredients(recipes);
    let tagColor = '#3282F7';

    searchBar.addEventListener('input', function(e) {
        let search = searchBar.value.toLowerCase()
        let ingredientsFound = new Set();

        // Add ingredients found in the set
        ingredients.forEach(ingredient => {
            if(ingredient.includes(search)){
                ingredientsFound.add(ingredient)
            }
        }); 

        // Filter elements of tags when searching for an element
        displayTagsElements(ingredientsFound, elementsList);
    })
    // Display original tag elements
    displayTagsElements(ingredients, elementsList);
    addTag(tagColor);
}

// Display elements for tags in DOM
async function displayTagsElements(elements, list){
    list.innerHTML = '';
    elements.forEach(element => {
        const a = document.createElement('a');
        a.setAttribute('class', 'ingredient-in-list');
        a.textContent = element;
        list.appendChild(a);
    })
}

async function addTag(tagColor){
    const allElements = document.querySelectorAll('.ingredient-in-list');
    allElements.forEach(element => {
        element.addEventListener('click', function(e) {
            displayTag(tagColor,element.text);
        })
    })
}

function displayTag(tagColor, tagContent) {
    const tagSection = document.querySelector('.tag_section');
    const tag = document.createElement('div');
    const text = document.createElement('p');
    const icon = document.createElement('i');
    
    tag.setAttribute('class', 'tag');
    tag.style.backgroundColor = tagColor;
    text.setAttribute('class', 'text-ingredient-tag');
    text.textContent = tagContent; 
    icon.setAttribute('class', 'far fa-times-circle');
        
    tag.appendChild(text);
    tag.appendChild(icon);
    tagSection.appendChild(tag);
};

// Buttons
displayBtn(recipes);
interactionsBtn();
// Cards
displayData(recipes);
// Search bar
filterRecipesWithSearchBar(recipes);
// Tags
ingredientsListForTags(recipes);