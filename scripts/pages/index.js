import { getRecipes } from '../utils/helper.js'
import { cardFactory } from '../factories/card.js'

const { recipes } = await getRecipes()

export function extractIngredients(recipe) { 
    return recipe.ingredients.map(i => i.ingredient.toLowerCase())
}

export function extractUstensils(recipe) {
    return recipe.ustensils.map(u => u.toLowerCase())
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
    let tagClass = 'tag_ingredient'
    let tagColor = '#3282F7'
    initTagItems(searchBar, ingredients, tagClass, tagColor)
}

// Appliance informations
function retrieveApplianceInformation(recipes){
    const searchBar = document.querySelector('.appliances_input')
    let appliances = extractAllAppliances(recipes)
    let tagClass = 'tag_appliance'
    let tagColor = '#68D9A4'
    initTagItems(searchBar, appliances, tagClass, tagColor)
}

// Ustensil informations
function retrieveUstensilInformation(recipes){
    const searchBar = document.querySelector('.ustensils_input')
    let ustensils = extractAllUstensils(recipes)
    let tagClass = 'tag_ustensil'
    let tagColor = '#ED6454'
    initTagItems(searchBar, ustensils, tagClass, tagColor)
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
function filterRecipes() {
    let searchBar = document.querySelector('.search_bar')
    let search = searchBar.value.toLowerCase()

    let recipesFound = []

    let tags = Array.from(document.querySelectorAll(".tag")).map(t => t.textContent.toLowerCase())
    let tagsIngredient = Array.from(document.querySelectorAll(".tag_ingredient")).map(t => t.textContent.toLowerCase())
    let tagsAppliances = Array.from(document.querySelectorAll(".tag_appliance")).map(t => t.textContent.toLowerCase())
    let tagsUstensils = Array.from(document.querySelectorAll(".tag_ustensil")).map(t => t.textContent.toLowerCase())

    // If there is no search or tag
    if(!tags.length && search == undefined){
        return recipes
    }

    // Filter recipes with a search
    for(let recipe of recipes){
        const name = recipe.name.toLowerCase()
        const description = recipe.description.toLowerCase()
        if(name.indexOf(search) >= 0 || description.indexOf(search) >= 0 || recipe.ingredient.indexOf(search) >= 0){
            recipesFound.push(recipe)
        }       
    }

    // Iterate on each element of the list
    function customEvery(list, fn, recipeList){
        let responses = []
    
        for(let element of list){
            let rlt = fn(recipeList, element)
            responses.push(rlt)
        }
    
        for(let r of responses){
            if(!r){ return false }
        }
        return true
    }

    // Do the elements appear in the recipes ?
    function isInList(list, element){
        if(list.indexOf(element) >= 0){ return true }
        return false
    }

    let keptRecipes = []

    // Filter recipes with tags
    for(let recipe of recipes){
        const ustensil = extractUstensils(recipe)

        const keepRecipeIngredients = customEvery(tagsIngredient, isInList, recipe.ingredient)
        const keepRecipeAppliances = customEvery(tagsAppliances, isInList, recipe.appliance.toLowerCase())
        const keepRecipeUstensils = customEvery(tagsUstensils, isInList, ustensil)

        if(keepRecipeIngredients && keepRecipeAppliances && keepRecipeUstensils){
            keptRecipes.push(recipe)
        }
    }

    recipesFound = keptRecipes
    return recipesFound
}

function initRecipes(recipes){
    let searchBar = document.querySelector('.search_bar')
    const tagSection = document.querySelector('.tag_section')

    searchBar.addEventListener('input', function(e){
        let search = searchBar.value.toLowerCase()
        let recipesFound = filterRecipes()

        // Condition to remove tags
        if(search.length){
            tagSection.innerHTML = ''
            displayData(recipesFound)
        }

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

        // If we search recipes, the list of ingredients is filtered
        retrieveIngredientInformation(recipesFound)
        retrieveApplianceInformation(recipesFound)
        retrieveUstensilInformation(recipesFound)
    })
}

// Filter the list of elements for tags
function filterTagItems(elements, search, elementsList){
    let elementsFound = new Set()
    elements.forEach(element => {
        if(element.includes(search)){
            elementsFound.add(element)
        }
    })
    displayTagItemsInDOM(elementsFound, elementsList) // Filter elements of tags when searching for an element
}

function initTagItems(searchBar, elements, tagClass, tagColor){
    const elementsList = searchBar.closest('button').querySelector('.element-list')
    searchBar.addEventListener('input', function(e){
        let search = searchBar.value.toLowerCase()
        filterTagItems(elements, search, elementsList)
        initTag(elementsList, tagClass, tagColor)
    })
    displayTagItemsInDOM(elements, elementsList) // Display the elements of the tags when they are not filtered
    initTag(elementsList, tagClass, tagColor)
}

// Display elements for tags in DOM
function displayTagItemsInDOM(elements, list){
    let tags = Array.from(document.querySelectorAll(".tag")).map(t => t.textContent.toLowerCase())
    list.innerHTML = ''
    elements.forEach(element => {
        if(tags.includes(element)){
            console.log('This tag is already in use');
        }else{
            const a = document.createElement('a')
            a.setAttribute('class', 'element-in-list')
            a.textContent = element
            list.appendChild(a)            
        }
    })
}

// Display tag in DOM
function displayTagInDOM(tagClass, tagColor, tagContent) {
    const tagSection = document.querySelector('.tag_section');
    const tag = document.createElement('div');
    const text = document.createElement('p');
    const icon = document.createElement('i');
                        
    tag.setAttribute('class', `tag ${tagClass}`);
    tag.style.backgroundColor = tagColor;
    text.setAttribute('class', 'text-ingredient-tag');
    text.textContent = tagContent; 
    icon.setAttribute('class', 'far fa-times-circle');
        
    tag.appendChild(text);
    tag.appendChild(icon);
    tagSection.appendChild(tag);
}

function initTag(list, tagClass, tagColor) {
    const elementsInList = list.querySelectorAll('.element-in-list')
    elementsInList.forEach(element => {
        element.addEventListener('click', function(e){
            displayTagInDOM(tagClass, tagColor, element.text)
            removeTag()

            let recipesFound = filterRecipes()
            displayData(recipesFound)

            // If we search recipes, the list of ingredients is filtered
            retrieveIngredientInformation(recipesFound)
            retrieveApplianceInformation(recipesFound)
            retrieveUstensilInformation(recipesFound)
        })
    })
}

// Remove tag in DOM
function removeTag(){
    const allCloseIcon = document.querySelectorAll('.fa-times-circle')
    allCloseIcon.forEach(closeIcon => {
        closeIcon.addEventListener('click', function(e){
            const closeBtn = closeIcon.closest('.tag')
            closeBtn.remove()

            let recipesFound = filterRecipes()
            displayData(recipesFound)

            // If we search recipes, the list of ingredients is filtered
            retrieveIngredientInformation(recipesFound)
            retrieveApplianceInformation(recipesFound)
            retrieveUstensilInformation(recipesFound)
        })
    })
}

// Buttons
displayBtn(recipes)
setSearchEvent()
// Cards
displayData(recipes)
// Search bar
initRecipes(recipes)
// Infos
retrieveIngredientInformation(recipes)
retrieveApplianceInformation(recipes)
retrieveUstensilInformation(recipes)