//Global Varibles
// var recipes = [{recipesInfo:{}, payload:{} totalDaily:{}, totalNutrients:{}, totalNutrientsKCal:{}}]
var recipes = [];
var nutritionDiv = $("#recipe-nutrition");

// Grabs the saved favorites from localstorage if there are any
if (!localStorage.getItem("savedFavorites")) {
    var savedFavorites = {};
} else{
    savedFavorites = JSON.parse(localStorage.getItem("savedFavorites"))
}

