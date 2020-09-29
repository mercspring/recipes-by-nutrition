// Search results and recipe info divs start off as invisible

$("#search-results").attr("style", "display: none")
$("#recipe-info").attr("style", "display: none")
$("#topbar-search").attr("style", "opacity: 0.0")
$("#favorites").attr("style", "opacity: 0.0")

//This function displays the recipe info on the page
function displayNutritionInfo(recipeIndex) {
    var nutritionDiv = $("#recipe-nutrition");

    nutritionDiv.empty();

    var recipe = recipes[recipeIndex];
    var nutritionLabel = $("<div>");

    nutritionLabel.attr("id", "nutrition-label");
    nutritionDiv.append(nutritionLabel);

    nutritionLabel.nutritionLabel(new NutritionObject(recipe));

}
//This function constructs the object to be based to the nutrition label generater
function NutritionObject(recipe) {
    this.showDailyTotalFat = false;
    this.showDailyFibers = false;
    this.showAddedSugars = false;
    this.showCaffeine = false;
    if (typeof recipe.recipesInfo.servings != 'undefined') this.valueServingUnitQuantity = recipe.recipesInfo.servings;
    this.showIngredients = false;

    this.showServingUnitQuantity = false;
    if (typeof recipe.recipesInfo.title != 'undefined') this.itemName = recipe.recipesInfo.title;


    if (typeof recipe.totalNutrientsKCal.ENERC_KCAL != 'undefined') this.valueCalories = recipe.totalNutrientsKCal.ENERC_KCAL.quantity;
    if (typeof recipe.totalNutrientsKCal.FAT_KCAL != 'undefined') this.valueFatCalories = recipe.totalNutrientsKCal.FAT_KCAL.quantity;
    if (typeof recipe.totalNutrients.FAT != 'undefined') this.valueTotalFat = recipe.totalNutrients.FAT.quantity;
    if (typeof recipe.totalNutrients.FASAT != 'undefined') this.valueSatFat = recipe.totalNutrients.FASAT.quantity;
    if (typeof recipe.totalNutrients.FATRN != 'undefined') this.valueTransFat = recipe.totalNutrients.FATRN.quantity;
    if (typeof recipe.totalNutrients.CHOLE != 'undefined') this.valueCholesterol = recipe.totalNutrients.CHOLE.quantity;
    if (typeof recipe.totalNutrients.NA != 'undefined') this.valueSodium = recipe.totalNutrients.NA.quantity;
    if (typeof recipe.totalNutrients.CHOCDF != 'undefined') this.valueTotalCarb = recipe.totalNutrients.CHOCDF.quantity;
    if (typeof recipe.totalNutrients.FIBTG != 'undefined') this.valueFibers = recipe.totalNutrients.FIBTG.quantity;
    if (typeof recipe.totalNutrients.SUGAR != 'undefined') this.valueSugars = recipe.totalNutrients.SUGAR.quantity;
    if (typeof recipe.totalNutrients.PROCNT != 'undefined') this.valueProteins = recipe.totalNutrients.PROCNT.quantity;

    if (typeof recipe.totalNutrients.VITD != 'undefined') this.valueVitaminD = recipe.totalDaily.VITD.quantity;
    if (typeof recipe.totalNutrients.VITC != 'undefined') this.valueVitaminC = recipe.totalDaily.VITC.quantity;
    if (typeof recipe.totalNutrients.K != 'undefined') this.valuePotassium_2018 = recipe.totalDaily.K.quantity;
    if (typeof recipe.totalNutrients.CA != 'undefined') this.valueCalcium = recipe.totalDaily.CA.quantity;
    if (typeof recipe.totalNutrients.FE != 'undefined') this.valueIron = recipe.totalDaily.FE.quantity;
    this.showLegacyVersion = false;
}

// This function takes the index of the recipes array and appends the nutrution info to the corresponding recipe object
function getNutritionInfo(recipeIndex) {

    // $("#recipe-nutrition").empty();
    var recipe = recipes[recipeIndex];

    var edamamAppID = "33eb5757";
    var edamamAppKey = "3f49d15bad2ccb193b05ed14bf175958";
    var edamamQueryURL = `https://api.edamam.com/api/nutrition-details?app_id=${edamamAppID}&app_key=${edamamAppKey}&force`

    // var payload = { title: recipe.title, yield: recipe.servings, ingr: recipe.ingredients }

    $.ajax({
        method: "POST",
        url: edamamQueryURL,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify(recipe.payload),
        error: function () { nutritionDiv.empty(); nutritionDiv.append("<p> Not able to process nutritional info for this recipe.</p>") }
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

//On click handler for the individual list entries this function grabs the data-index attribute and feeds it into the getIngredients function
$(document).on("click", ".result", function (event) {
    event.preventDefault();
    $("#recipe-info").attr("style", "display: block")
    $("#results-list").attr("class", "panel is-primary mobile-hide")
    $("#mobile-buttons").removeClass("desktop-hide")
    $("#mobile-buttons").attr("class", "mobile-show")
    getIngredients($(this).attr("data-index"));
})

//On click handler for the induvidual favorites entries, this calls the function to display the saved recipe
$(document).on("click", ".favorite", function (event) {
    event.preventDefault();
    $("#recipe-info").attr("style", "display: block")
    displayFavoriteRecipe($(this).attr("data-mealID"));
})
//On click handler for the display favorites link, this calls the function to clear the page and generate the list of favorites
$(document).on("click", ".favorites-link", function (event) {
    event.preventDefault();
    generateListOfFavorites();
})

//On click handler to add something to the favorites object
$(document).on("click", "#add-favorite", function (event) {
    event.preventDefault();
    $("#add-favorite").text("⭑")
    addToFavorites($(this).attr("data-index"))
})

//On click handler to remove something from your favorites list
$(document).on("click", "#remove-favorite", function (event) {
    event.preventDefault();
    removeFavorite($(this).attr("data-mealID"))
})
//This function accepts a search term to be run through the spoonacular search api. It then populates the recipes array the resulting recipesInfo objects
function getRecipes(searchTerm) {

    searchTerm = searchTerm.trim()
    var spoontacularAPIKey = "5babb627a31c457eabcb2fd3a13e65c3";
    var spoontacularQueryURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${spoontacularAPIKey}&query=${searchTerm}&instructionsRequired=true&addRecipeInformation=true`
    $("#search-area").fadeTo("medium", "0.0")
    $("#search-area").attr("style", "display: none");
    $("#topbar-search").fadeTo("medium", "1.0");
    $("#favorites").fadeTo("medium", "1.0");
    $("#results-list").empty();
    $("#recipe-inst").empty();
    $("#recipe-title").empty();
    $("#recipe-nutrition").empty()
    var listTitle = $("<div>")
    listTitle.attr("class", "panel-heading")
    var listText = $("<h2>");
    listText.attr("class", "panel-title")
    listText.text("Search Results")
    listTitle.append(listText)
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
            listEntry.attr("class", "panel-block list-entry result");
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
        if (recipes.length === 0) {
            $("#search-results").attr("style", "display: block")
            $("#results-list").append("<p class='has-text-centered'>No Results</p>");
        }
    })
}

//Function that removes a favorite from the favorites object, updates localstorage and clears the recipe area
function removeFavorite(mealID) {
    delete savedFavorites[mealID];

    $("#results-list").empty();
    $("#recipe-inst").empty();
    $("#recipe-title").empty();
    $("#recipe-nutrition").empty();

    localStorage.setItem("savedFavorites", JSON.stringify(savedFavorites));
    generateListOfFavorites();
}

//Function that adds a favorite to the favorites object and updates localstorage
function addToFavorites(recipeIndex) {
    savedFavorites[`${recipes[recipeIndex].recipesInfo.id}`] = recipes[recipeIndex];
    localStorage.setItem("savedFavorites", JSON.stringify(savedFavorites));
}

//Function that clears the page and generates the list of saved favorites
function generateListOfFavorites() {
    $("#search-area").fadeTo("medium", "0.0")
    $("#search-area").attr("style", "display: none");
    $("#topbar-search").fadeTo("medium", "1.0");
    $("#favorites").fadeTo("medium", "1.0");
    $("#results-list").empty();
    $("#recipe-inst").empty();
    $("#recipe-title").empty();
    $("#recipe-nutrition").empty();
    var listTitle = $("<div>")
    listTitle.attr("class", "panel-heading")
    var listText = $("<h2>");
    listText.attr("class", "panel-title")
    listText.text("Favorites")
    listTitle.append(listText)
    $("#results-list").append(listTitle)
    if (jQuery.isEmptyObject(savedFavorites)) {
        $("#search-results").attr("style", "display: block")
        $("#results-list").append("<p class='has-text-centered'>No Saved Favorites</p>");
    } else {
        for (const mealID in savedFavorites) {
            $("#search-results").attr("style", "display: block")
            var listEntry = $("<a>");
            listEntry.attr("class", "panel-block list-entry favorite");
            listEntry.attr("data-mealID", mealID)
            var recipeDiv = $("<div>");
            recipeDiv.attr("class", "recipe-description");
            var recipeFig = $("<figure>");
            recipeFig.attr("class", "image is-128x128 recipe-img");
            var recipeImg = $("<img>");
            recipeImg.attr("src", savedFavorites[mealID].recipesInfo.image);
            var recipeTitle = $("<p>");
            recipeTitle.text(savedFavorites[mealID].recipesInfo.title)
            recipeTitle.attr("style", "font-weight: bold");
            var recipeTime = $("<p>");
            recipeTime.text("Minutes to prepare: " + savedFavorites[mealID].recipesInfo.readyInMinutes)
            var recipeServings = $("<p>");
            recipeServings.text("Serving size: " + savedFavorites[mealID].recipesInfo.servings)
            recipeFig.append(recipeImg)
            recipeDiv.append(recipeFig)
            recipeDiv.append(recipeTitle)
            recipeDiv.append(recipeTime)
            recipeDiv.append(recipeServings)
            listEntry.append(recipeDiv)
            $("#results-list").append(listEntry)
        }
    }
}

//Function that displays the saved favorite recipe when the entry in the saved favorites list is clicked on
function displayFavoriteRecipe(mealID) {
    var ingredients = $("<ol>");
    var recipe = savedFavorites[`${mealID}`]

    $("#recipe-title").html(`${recipe.payload.title} &nbsp; &nbsp; <span data-mealID="${mealID}" id="remove-favorite">⭑</span>`);
    for (var i = 0; i < recipe.payload.ingr.length; i++) {
        var ingredientIndiv = $("<li>");
        ingredientIndiv.text(recipe.payload.ingr[i]);
        ingredients.append(ingredientIndiv)

    }

    var recipeImg = $("<img>")
    recipeImg.attr("src", recipe.recipesInfo.image)

    $("#recipe-inst").empty()
    var instructions = $("<p>");
    instructions.html(recipe.recipesInfo.instructionsList);

    var instructionsTitle = $("<h3>");
    instructionsTitle.attr("class", "inst-title")
    instructionsTitle.text("Instructions: ")
    var ingredientsTitle = $("<h3>");
    ingredientsTitle.attr("class", "inst-title")
    ingredientsTitle.text("Ingredients: ")

    ingredients.attr("class", "ingredients-list")
    instructions.attr("class", "instructions-list")

    $("#recipe-inst").append(recipeImg)
    $("#recipe-inst").append(ingredientsTitle)
    $("#recipe-inst").append(ingredients)
    $("#recipe-inst").append(instructionsTitle)
    $("#recipe-inst").append(instructions);


    nutritionDiv.empty();

    if (typeof recipe.totalDaily === 'undefined') {
        nutritionDiv.append("<p> Not able to process nutritional info for this recipe.</p>")
    } else {
        var nutritionLabel = $("<div>");
        nutritionLabel.attr("id", "nutrition-label");
        nutritionDiv.append(nutritionLabel);
        nutritionLabel.nutritionLabel(new NutritionObject(recipe));
    }
}


//This function takes an index from the recipes array, querries the spoonacular api with the meal id (originaly obtained as part of the recipe) and adds the resulting ingredient info onto the induvidual recipe object in the form of a payload object
function getIngredients(recipeIndex) {

    var recipe = recipes[recipeIndex];
    var mealID = recipe.recipesInfo.id;
    recipe.recipesInfo.instructionsList = [];
    recipe.payload = {
        title: recipe.recipesInfo.title,
        yeild: recipe.recipesInfo.servings,
        url: recipe.recipesInfo.sourceUrl,
        ingr: []
    };
    var spoontacularAPIKey = "067c508c55684529951d621c0c9b2b92";



    var queryURL = `https://api.spoonacular.com/recipes/${mealID}/information?apiKey=${spoontacularAPIKey}&includeNutrition=false`
    $.ajax({
        method: "GET",
        url: queryURL
    }).then(function (response) {
        recipe.recipesInfo.instructionsBlob = response.instructions;

        var instructions = $("<ol>");

        for (var j = 0; j < response.analyzedInstructions.length; j++) {
            for (var k = 0; k < response.analyzedInstructions[j].steps.length; k++) {
                recipe.recipesInfo.instructionsList.push(response.analyzedInstructions[j].steps[k].step);
                var instructionsLi = $("<li>");
                instructionsLi.text(recipe.recipesInfo.instructionsList[k]);
                instructions.append(instructionsLi)

            }
        }

        var ingredients = $("<ol>");

        for (var i = 0; i < response.extendedIngredients.length; i++) {
            recipe.payload.ingr.push(response.extendedIngredients[i].original);
            var ingredientIndiv = $("<li>");
            ingredientIndiv.text(recipe.payload.ingr[i]);
            ingredients.append(ingredientIndiv)
            var recipeImg = $("<img>")
            recipeImg.attr("src", recipe.recipesInfo.image)

        }
        if (recipe.recipesInfo.id in savedFavorites) {
            $("#recipe-title").html(`${recipe.payload.title} &nbsp; &nbsp; <span>⭑</span>`);
        } else {
            $("#recipe-title").html(`${recipe.payload.title} &nbsp; &nbsp; <span data-index='${recipeIndex}' id="add-favorite">✩</span>`);
        }

        $("#recipe-inst").empty()

        var instructionsTitle = $("<h3>");
        instructionsTitle.attr("class", "inst-title")
        instructionsTitle.text("Instructions: ")
        var ingredientsTitle = $("<h3>");
        ingredientsTitle.attr("class", "inst-title")
        ingredientsTitle.text("Ingredients: ")

        ingredients.attr("class", "ingredients-list")
        instructions.attr("class", "instructions-list")

        $("#recipe-inst").append(recipeImg)
        $("#recipe-inst").append(ingredientsTitle)
        $("#recipe-inst").append(ingredients)
        $("#recipe-inst").append(instructionsTitle)
        $("#recipe-inst").append(instructions);


        getNutritionInfo(recipeIndex);
    })
}

$("#document").on("click", "#mobile-search", function(event) {
    event.preventDefault();
    $("#results-list").attr("style", "display: block");
    $("#recipe-info").attr("style", "display: none");
})

$("#document").on("click", "#mobile-recipe", function(event) {
    event.preventDefault();
    $("#results-list").attr("style", "display: none");
    $("#recipe-info").attr("style", "display: block");
    $("#recipe-inst").attr("style", "display: block");
    $("#recipe-nutrition").attr("style", "display: none");
})

$("#document").on("click", "mobile-nutrition", function(event) {
    event.preventDefault();
    $("#results-list").attr("style", "display: none");
    $("#recipe-info").attr("style", "display: block");
    $("#recipe-inst").attr("style", "display: none");
    $("#recipe-nutrition").attr("style", "display: block");
})