import { extractIngredients } from '../pages/index.js'

export async function getRecipes() {
    let jsonFile = "../../data/recipes.json";
    let data = await fetch(jsonFile);
    let { recipes } = await data.json();
    let response = recipes.map(recipe => {
        recipe.ingredient = extractIngredients(recipe)
        return recipe
    })
    return { recipes : response }
}