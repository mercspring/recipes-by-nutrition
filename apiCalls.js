function getNutritionInfo() {

    var testObject = {
        title: "Fresh Ham Roasted With Rye Bread and Dried Fruit Stuffing",
        prep: "1. Have your butcher bone and butterfly the ham and score the fat in a diamond pattern. ...",
        yield: "About 15 servings",
        ingr: [
            "1 fresh ham, about 18 pounds, prepared by your butcher (See Step 1)",
            "7 cloves garlic, minced",
            "1 tablespoon caraway seeds, crushed",
            "4 teaspoons salt",
            "Freshly ground pepper to taste",
            "1 teaspoon olive oil",
            "1 medium onion, peeled and chopped",
            "3 cups sourdough rye bread, cut into 1/2-inch cubes",
            "1 1/4 cups coarsely chopped pitted prunes",
            "1 1/4 cups coarsely chopped dried apricots",
            "1 large tart apple, peeled, cored and cut into 1/2-inch cubes",
            "2 teaspoons chopped fresh rosemary",
            "1 egg, lightly beaten",
            "1 cup chicken broth, homemade or low-sodium canned"
        ]
    }

    var edamamAppID = "b15b5751";
    var edamamAppKey = "83d297e6ece544701047f8a4c809793f";
    var edamamQueryURL = `https://api.edamam.com/api/nutrition-details?app_id=${edamamAppID}&app_key=${edamamAppKey}`

    $.ajax({
        method: "POST",
        url: edamamQueryURL,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify(testObject)
    }).then(function (response) {
        console.log(response)
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
        console.log(response.extendedIngredients.length)
        for (var i = 0; i < response.extendedIngredients.length; i++) {
            console.log(response.extendedIngredients[i].original)
        }
    })
}