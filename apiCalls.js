// Search results and recipe info divs start off as invisible

$("#search-results").attr("style", "display: none")

$("#recipe-info").attr("style", "display: none")


function displayNutritionInfo(recipeIndex) {

    nutritionDiv.empty();

    var recipe = recipes[recipeIndex];
    var nutritionLabel = $("<div>");

    nutritionLabel.attr("id", "nutrition-label");
    nutritionDiv.append(nutritionLabel);

    nutritionLabel.nutritionLabel({
        showDailyTotalFat: false,
        showDailySodium: false,
        showDailyFibers: false,
        showDailyAddedSugars: false,
        showDailyCalcium: false,
        showDailyIron: false,
        showCaffeine: false,
        valueServingUnitQuantity : recipe.recipesInfo.servings,
        showIngredients : false,

        showServingUnitQuantity: false,
        itemName: recipe.recipesInfo.title,

        showPolyFat: false,
        showMonoFat: false,

        valueCalories: recipe.totalNutrientsKCal.ENERC_KCAL.quantity,
        valueFatCalories: recipe.totalNutrientsKCal.FAT_KCAL.quantity,
        valueTotalFat: recipe.totalNutrients.FAT.quantity,
        valueSatFat: recipe.totalNutrients.FASAT.quantity,
        valueTransFat: recipe.totalNutrients.FATRN.quantity,
        valueCholesterol: recipe.totalNutrients.CHOLE.quantity,
        valueSodium: recipe.totalNutrients.NA.quantity,
        valueTotalCarb: recipe.totalNutrients.CHOCDF.quantity,
        valueFibers: recipe.totalNutrients.FIBTG.quantity,
        valueSugars: recipe.totalNutrients.SUGAR.quantity ,
        valueProteins: recipe.totalNutrients.PROCNT.quantity,
        valueVitaminD: recipe.totalNutrients.VITD.quantity,
        valuePotassium_2018: recipe.totalNutrients.K.quantity,
        valueCalcium: recipe.totalNutrients.CA.quantity,
        valueIron: recipe.totalNutrients.FE.quantity,
        showLegacyVersion: false

    });

}
$("#topbar-search").attr("style", "opacity: 0.0")

// This function takes the index of the recipes array and appends the nutrution info to the corresponding recipe object
function getNutritionInfo(recipeIndex) {

    // $("#recipe-nutrition").empty();
    var recipe = recipes[recipeIndex];
    console.log(recipeIndex)
    console.log(recipe)

    var edamamAppID = "54341639";
    var edamamAppKey = "2b934b4fbdc728a5963000b8634dddce";
    var edamamQueryURL = `https://api.edamam.com/api/nutrition-details?app_id=${edamamAppID}&app_key=${edamamAppKey}&force`

    // var payload = { title: recipe.title, yield: recipe.servings, ingr: recipe.ingredients }

    $.ajax({
        method: "POST",
        url: edamamQueryURL,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify(recipe.payload),
        error: function(){nutritionDiv.empty(); nutritionDiv.append("<p> Not able to process nutritional info for this recipe.</p>")}
    }).then(function (response) {
        recipe.totalDaily = response.totalDaily;
        recipe.totalNutrients = response.totalNutrients;
        recipe.totalNutrientsKCal = response.totalNutrientsKCal;
        displayNutritionInfo(recipeIndex)
    })
}

//Returns search results on click from the input field and feeds it into the getRecipes function
$("#search").on("click", function (event) {
    event.preventDefault();
    recipes = [];
    if (!$("#recipe-search").val()) return;
    getRecipes($("#recipe-search").val());
})

$("#search-2").on("click", function (event) {
    event.preventDefault();
    recipes = [];
    if (!$("#recipe-search-2").val()) return;
    getRecipes($("#recipe-search-2").val());
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
    var spoontacularAPIKey = "5babb627a31c457eabcb2fd3a13e65c3";
    var spoontacularQueryURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${spoontacularAPIKey}&query=${searchTerm}&instructionsRequired=true&addRecipeInformation=true`
    $("#search-area").fadeTo("medium", "0.0")
    $("#search-area").attr("style", "display: none");
    $("#topbar-search").fadeTo("medium", "1.0");
    $("#results-list").empty();
    var listTitle = $("<p>")
    listTitle.attr("class", "panel-heading results-title");
    listTitle.text("Search Results")
    $("#results-list").append(listTitle)

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
            recipeImg.attr("src", recipes[i].recipesInfo.image);
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

    recipe.payload = { title: recipe.recipesInfo.title,
        yeild: recipe.recipesInfo.servings,
        url: recipe.recipesInfo.sourceUrl,
        ingr: [] };
    var spoontacularAPIKey = "6f83f09047444b16b026a6461826992c";

   

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
            recipeImg.attr("src", recipe.recipesInfo.image)

        }

        $("#recipe-inst").empty()

        var instructionsTitle = $("<h3>");
        instructionsTitle.text("Instructions: ")
        var ingredientsTitle = $("<h3>");
        ingredientsTitle.text("Ingredients: ")

        $("#recipe-inst").append(recipeImg)
        $("#recipe-inst").append(ingredientsTitle)
        $("#recipe-inst").append(ingredients)
        $("#recipe-inst").append(instructionsTitle)
        $("#recipe-inst").append(instructions);

    
    getNutritionInfo(recipeIndex);
    })
}
