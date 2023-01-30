import { getRecipes } from '../utils/helper.js'
import { cardFactory } from '../factories/card.js'

const { recipes } = await getRecipes()

export function extractIngredients(recipe) { 
    return recipe.ingredients.map(i => i.ingredient.toLowerCase())
}

function extractAllIngredients(recipes) {
    let ingredients = recipes.map(recipe => { return recipe.ingredient.map(i => i.toLowerCase()) })
    return new Set(ingredients.flat())
}

function extractAllAppliances(recipes) {
    let appliances = recipes.map(recipe => { return recipe.appliance.toLowerCase() })
    return new Set(appliances.flat())
}

function extractAllUstensils(recipes) {
    let ustensils = recipes.map(recipe => { return recipe.ustensils.map(i => i.toLowerCase()) })
    return new Set(ustensils.flat())
}

// Ingredient informations
function retrieveIngredientInformation(recipes){
    const searchBar = document.querySelector('.ingredients_input')
    let ingredients = extractAllIngredients(recipes)
    filterTagItems(searchBar, ingredients)
}

// Appliance informations
function retrieveApplianceInformation(recipes){
    const searchBar = document.querySelector('.appliances_input')
    let appliances = extractAllAppliances(recipes)
    filterTagItems(searchBar, appliances)
}

// Ustensil informations
function retrieveUstensilInformation(recipes){
    const searchBar = document.querySelector('.ustensils_input')
    let ustensils = extractAllUstensils(recipes)
    filterTagItems(searchBar, ustensils)
}

// Display buttons in the DOM
function displayBtn(recipes){
    const filterSection = document.querySelector(".filter_section")
    const btnModel = cardFactory(recipes)

    function blueBtn(){
        const btnDOM = btnModel.blueBtn()
        filterSection.appendChild(btnDOM)           
    }
    function greenBtn(){
        const btnDOM = btnModel.greenBtn()
        filterSection.appendChild(btnDOM)          
    }
    function redBtn(){
        const btnDOM = btnModel.redBtn()
        filterSection.appendChild(btnDOM)          
    }
    blueBtn(); greenBtn(); redBtn();
}

// Interactions to open and close buttons
function setSearchEvent(){
    const allMainBtn = document.querySelectorAll('.button')
    const allIconUp = document.querySelectorAll('.fa-chevron-up')
        
    allMainBtn.forEach(mainBtn => {
        const container = mainBtn.closest('.container')
        const searchBtn = container.querySelector('.input-btn')

        mainBtn.addEventListener('click', function(e){
            mainBtn.style.display = 'none'
            searchBtn.style.display = 'flex'
        })

        allIconUp.forEach(iconUp => {
            iconUp.addEventListener('click', function(e){
                mainBtn.style.display = 'flex'
                searchBtn.style.display = 'none'
            })
        })
    })
}

// Display message when no recipes is found
function noRecipesFound() {
    const cardSection = document.querySelector(".card_section")
    const message = document.createElement('p')
    message.innerHTML =`Aucune recette ne correspond à votre critère<br>Vous pouvez chercher « tarte aux pommes », « poisson », etc.`
    message.setAttribute('class', 'search-null')
    cardSection.appendChild(message)
    return (cardSection)
}

// Display cards in the DOM
function displayData(recipes) {
    const cardSection = document.querySelector(".card_section")
    cardSection.innerHTML = ""
    recipes.forEach((recipe) => {
        const cardModel = cardFactory(recipe)
        const CardDOM = cardModel.getCardDOM()
        cardSection.appendChild(CardDOM)
    })
}

// Filter recipes with text search
function filterRecipes(search) {
    let recipesFound = new Set()
    recipesFound = recipes.filter(recipe => {
        const name = recipe.name.toLowerCase()
        const description = recipe.description.toLowerCase()
        return (
            name.includes(search) ||
            description.includes(search) ||
            recipe.ingredient.includes(search)
        )
    })
    return recipesFound
}

function initFilterRecipes(recipes){
    let searchBar = document.querySelector('.search_bar')

    searchBar.addEventListener('input', function(e){
        let search = searchBar.value.toLowerCase()
        let recipesFound = filterRecipes(search)

        // Condition to launch the search from 3 characters entered
        if(search.length >= 3){
            displayData(recipesFound)  
        }else{
            displayData(recipes)
        }

        // Condition to launch a message if no recipe is found
        if(!recipesFound.length){
            noRecipesFound()
        }

        // If we search for recipes in the search bar, the list of ingredients is filtered
        retrieveIngredientInformation(recipesFound)
        retrieveApplianceInformation(recipesFound)
        retrieveUstensilInformation(recipesFound)
    })
}

// Filter the list of elements for tags
function filterTagItems(searchBar, elements){
    const button = searchBar.closest('button')
    const elementsList = button.querySelector('.element-list')

    searchBar.addEventListener('input', function(e) {
        let search = searchBar.value.toLowerCase()
        let elementsFound = new Set()
        elements.forEach(element => {
            if(element.includes(search)){
                elementsFound.add(element)
            }
        })
        displayTagItemsInTheDOM(elementsFound, elementsList) // Filter elements of tags when searching for an element
    })
    displayTagItemsInTheDOM(elements, elementsList) // Display the elements of the tags when they are not filtered
}

// Display elements for tags in DOM
function displayTagItemsInTheDOM(elements, list){
    list.innerHTML = ''
    elements.forEach(element => {
        const a = document.createElement('a')
        a.setAttribute('class', 'ingredient-in-list')
        a.textContent = element
        list.appendChild(a)
    })
}

// Buttons
displayBtn(recipes)
setSearchEvent()
// Cards
displayData(recipes)
// Search bar
initFilterRecipes(recipes)
// Infos
retrieveIngredientInformation(recipes)
retrieveApplianceInformation(recipes)
retrieveUstensilInformation(recipes)