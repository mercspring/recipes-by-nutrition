// Search results and recipe info divs start off as invisible

$("#search-results").attr("style", "display: none")

$("#recipe-info").attr("style", "display: none")

// This function takes the index of the recipes array and appends the nutrution info to the corresponding recipe object
function getNutritionInfo(recipeIndex) {

    var recipe = recipes[recipeIndex];

    var edamamAppID = "b15b5751";
    var edamamAppKey = "83d297e6ece544701047f8a4c809793f";
    var edamamQueryURL = `https://api.edamam.com/api/nutrition-details?app_id=${edamamAppID}&app_key=${edamamAppKey}`

    // var payload = { title: recipe.title, yield: recipe.servings, ingr: recipe.ingredients }

    $.ajax({
        method: "POST",
        url: edamamQueryURL,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify(recipe.payload)
    }).then(function (response) {
        recipe.totalDaily = response.totalDaily;
        recipe.totalNutrients = response.totalNutrients;
        recipe.totalNutrientsKCal = response.totalNutrientsKCal;
    })
}

//Returns search results on click from the input field and feeds it into the getRecipes function
$("#search").on("click", function (event) {
    event.preventDefault();
    recipes = [];
    if (!$("#recipe-search").val()) return;
    getRecipes($("#recipe-search").val());
})

//On click handler for the induvidual list entries this function grabs the data-index attribute and feeds it into the getIngredients function
$(document).on("click", ".list-entry", function (event) {
    event.preventDefault();
    $("#recipe-info").attr("style", "display: block")
    getIngredients($(this).attr("data-index"));
})


//This function accepts a search term to be run through the spoonacular search api. It then populates the recipes array the resulting recipesInfo objects
function getRecipes(searchTerm) {

    console.log("running search")
    searchTerm = searchTerm.trim()
    var spoontacularAPIKey = "6f83f09047444b16b026a6461826992c";
    var spoontacularQueryURL = `https://api.spoonacular.com/recipes/search?apiKey=${spoontacularAPIKey}&query=${searchTerm}`

    $.ajax({
        method: "GET",
        url: spoontacularQueryURL
    }).then(function (response) {

        // Pushes the res
        for (var i = 0; i < response.results.length; i++) {
            recipes.push({});
            recipes[i].recipesInfo = response.results[i];
            $("#search-results").attr("style", "display: block")
            var listEntry = $("<a>");
            listEntry.attr("class", "panel-block list-entry");
            listEntry.attr("data-index", i)
            var recipeDiv = $("<div>");
            recipeDiv.attr("class", "recipe-description");
            var recipeFig = $("<figure>");
            recipeFig.attr("class", "image is-128x128 recipe-img");
            var recipeImg = $("<img>");
            recipeImg.attr("src", "https://spoonacular.com/recipeImages/" + recipes[i].recipesInfo.image);
            var recipeTitle = $("<p>");
            recipeTitle.text(recipes[i].recipesInfo.title)
            recipeTitle.attr("style", "font-weight: bold");
            var recipeTime = $("<p>");
            recipeTime.text("Minutes to prepare: " + recipes[i].recipesInfo.readyInMinutes)
            var recipeServings = $("<p>");
            recipeServings.text("Serving size: " + recipes[i].recipesInfo.servings)
            recipeFig.append(recipeImg)
            recipeDiv.append(recipeFig)
            recipeDiv.append(recipeTitle)
            recipeDiv.append(recipeTime)
            recipeDiv.append(recipeServings)
            listEntry.append(recipeDiv)
            $("#results-list").append(listEntry)
        }
    })
}




//This function takes an index from the recipes array, querries the spoonacular api with the meal id (originaly obtained as part of the recipe) and adds the resulting ingredient info onto the induvidual recipe object in the form of a payload object
function getIngredients(recipeIndex) {

    var recipe = recipes[recipeIndex];
    var mealID = recipe.recipesInfo.id;
    recipe.recipesInfo.instructionsList = [];

    recipe.payload = { title: recipe.recipesInfo.title, yeild: recipe.recipesInfo.servings, ingr: [] };
    var spoontacularAPIKey = "067c508c55684529951d621c0c9b2b92";

    var queryURL = `https://api.spoonacular.com/recipes/${mealID}/information?apiKey=${spoontacularAPIKey}&includeNutrition=false`
    $.ajax({
        method: "GET",
        url: queryURL
    }).then(function (response) {
        recipe.recipesInfo.instructionsBlob = response.instructions;
        console.log(response)


        for (var j = 0; j < response.analyzedInstructions.length; j++) {
            for (var k = 0; k < response.analyzedInstructions[j].steps.length; k++) {
                recipe.recipesInfo.instructionsList.push(response.analyzedInstructions[j].steps[k].step);
                var instructions = $("<p>");
                instructions.html(recipe.recipesInfo.instructionsList);
                

            }
        }

       

        var ingredients = $("<ol>");

        for (var i = 0; i < response.extendedIngredients.length; i++) {
            recipe.payload.ingr.push(response.extendedIngredients[i].original);
            $("#recipe-title").text(recipe.payload.title);
            var ingredientIndiv = $("<li>");
            ingredientIndiv.text(recipe.payload.ingr[i]);
            ingredients.append(ingredientIndiv)
            var recipeImg = $("<img>")
            recipeImg.attr("src", "https://spoonacular.com/recipeImages/" + recipe.recipesInfo.image)

        }

        var instructionsTitle = $("<h3>");
        instructionsTitle.text("Instructions: ")
        var ingredientsTitle = $("<h3>");
        ingredientsTitle.text("Ingredients: ")


        $("#recipe-inst").append(recipeImg)
        $("#recipe-inst").append(ingredientsTitle)
        $("#recipe-inst").append(ingredients)
        $("#recipe-inst").append(instructionsTitle)
        $("#recipe-inst").append(instructions);

    
    })
}
