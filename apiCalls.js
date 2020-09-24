// This function takes the index of the recipes array and appends the nutrution info to the corresponding recipe object
function getNutritionInfo(recipeIndex) {

    var recipe = recipes[recipeIndex];

    var edamamAppID = "b15b5751";
    var edamamAppKey = "83d297e6ece544701047f8a4c809793f";
    var edamamQueryURL = `https://api.edamam.com/api/nutrition-details?app_id=${edamamAppID}&app_key=${edamamAppKey}`

    var payload = {title: recipe.title, yield: recipe.servings, ingr: recipe.ingredients}

    $.ajax({
        method: "POST",
        url: edamamQueryURL,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify(payload)
    }).then(function (response) {
        recipe.totalDaily = response.totalDaily;
        recipe.totalNutrients = response.totalNutrients;
        recipe.totalNutrientsKCal = response.totalNutrientsKCal;
    })
}

function getRecipes() {

    var searchTerm = "pasta"
    var spoontacularAPIKey = "6f83f09047444b16b026a6461826992c";
    var spoontacularQueryURL = `https://api.spoonacular.com/recipes/search?apiKey=${spoontacularAPIKey}&query=${searchTerm}`
    
    $.ajax({
        method: "GET",
        url: spoontacularQueryURL
    }).then(function (response) {
        console.log(response)
    })
}