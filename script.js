const searchBox = document.querySelector(".searchBox");
const searchBtn = document.querySelector(".searchBtn");
const recipeContainer = document.querySelector(".recipe-container ");

const recipeDetailsContent = document.querySelector(".recpie-details-content");
const recipeCloseBtn = document.querySelector(".recipe-close-btn");

// function to get recipe
const fetchRecipes = async (query) => {
  recipeContainer.innerHTML = "<h2>Fetching recipes....</h2>";
  try {
    const data = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );

    const response = await data.json();

    // Adding recpie data

    recipeContainer.innerHTML = "";
    response.meals.forEach((meal) => {
      const recipeDiv = document.createElement("div");
      recipeDiv.classList.add("recipe");
      recipeDiv.innerHTML = `
    <img src ="${meal.strMealThumb}">
    <h3>${meal.strMeal}</h3> 
    <p><span>${meal.strArea}</span> Dish</p> 
    <p>Belongs to <span>${meal.strCategory}</span> category</p>`;

      // Button
      const button = document.createElement("button");
      button.textContent = "View Recipe";
      recipeDiv.appendChild(button);

      // adding event listner to button
      button.addEventListener("click", () => {
        openRecipePopup(meal);
      });

      recipeContainer.appendChild(recipeDiv);
    });
  } catch (error) {
    recipeContainer.innerHTML = `<div><h2> Error in fetching recipes...</h2> <img src="./images/404.png" class="image" alt="404-image" width="400px"/></div>`;
  }
};

// function to fetch ingredients
const fetchIngredients = (meal) => {
  let ingredientsList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      const measure = meal[`strMeasure${i}`];
      ingredientsList += `<li>${measure} ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredientsList;
};

// function for meal popup
const openRecipePopup = (meal) => {
  recipeDetailsContent.innerHTML = `<h2>${meal.strMeal}</h2>
  <h3>Ingredients:</h3>
  <ul>${fetchIngredients(meal)}</ul>
  <div>
  <h3 class="instructions">Instructions:</h3>
  <p class="recpieInstructions">${meal.strInstructions}</p></div>`;

  recipeDetailsContent.parentElement.style.display = "block";
  recipeContainer.style.filter = "blur(3px)";
};
recipeCloseBtn.addEventListener("click", () => {
  recipeDetailsContent.parentElement.style.display = "none";
  recipeContainer.style.filter = "none";
});

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchInput = searchBox.value.trim();
  if (!searchInput) {
    recipeContainer.innerHTML = `<h2>Type the meal in the search box.</h2>`;
    return;
  }
  fetchRecipes(searchInput);
});
