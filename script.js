//Global Varibles
// var recipes = [{recipesInfo:{}, payload:{} totalDaily:{}, totalNutrients:{}, totalNutrientsKCal:{}}]
var recipes = [];
var nutritionDiv = $("#recipe-nutrition");
if (!localStorage.getItem("savedFavorites")) {
    var savedFavorites = {};
} else{
    savedFavorites = JSON.parse(localStorage.getItem("savedFavorites"))
}

