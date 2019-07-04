/*
//Import
import str from './models/Search';
//import { add , multiply , ID } from './views/searchView';
//console.log(`Using imported functions! Add ID and number 2 is ${add(ID, 2)} and Multiply 3 and 5 is ${multiply(3, 5)} and the id of the person is ${str}`);

//Import with a different name
//import { add as newAdd, multiply as newMultiply, ID } from './views/searchView';
//console.log(`Using imported functions! Add ID and number 2 is ${newAdd(ID, 2)} and Multiply 3 and 5 is ${newMultiply(3, 5)} and the id of the person is ${str}`);

//Import everything as different name searchView in the searchView.js file
import * as searchView from './views/searchView';
console.log(`Using imported functions! Add ID and number 2 is ${searchView.add(searchView.ID, 2)} and Multiply 3 and 5 is ${searchView.multiply(3, 5)} and the id of the person is ${str}`);

*/
////////////////////////////////////////------------------------//////////////////////

//API Key from Food2Fork 10035e522edcde2c510633e5979f1f24
//https://www.food2fork.com/api/search

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as likesView from './views/likesView';
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader } from './views/base';
import { strictEqual } from 'assert';

//import { stat } from 'fs';
/* Global State of the App

* - Search object
* - Current Recipe object
* - Shopping list object
* - Liked recipes

*/

const state = {};
window.state = state;

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
	// 1) Get the query from the view
	const query = searchView.getInput(); //Todo

	if (query) {
		// 2) New Search Object and add to state
		state.search = new Search(query);

		// 3) Prepare the User interface for results
		searchView.clearInput();
		searchView.clearResults();
		renderLoader(elements.searchRes);

		try {
			// 4) Search for recipes
			await state.search.getResult();

			// 5) Render results on UI
			clearLoader();
			searchView.renderResults(state.search.result);
			console.log(state.search.results);
		} catch (err) {
			alert(err.name);
			alert(err.message);
			console.log(err);
			clearLoader();
		}
	}
};

elements.searchForm.addEventListener('submit', (e) => {
	e.preventDefault();
	controlSearch();
});

elements.searchResPages.addEventListener('click', (e) => {
	//.closest method find the closest element.
	const btn = e.target.closest('.btn-inline');
	if (btn) {
		const goToPage = parseInt(btn.dataset.goto, 10);
		searchView.clearResults();
		searchView.renderResults(state.search.result, goToPage);
	}
});

/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
	//Get the ID from the url
	const id = window.location.hash.replace('#', '');

	if (id) {
		//Prepare the UI for changes
		recipeView.clearRecipe();
		renderLoader(elements.recipe);

		//Highlight the Selected Search Item
		if (state.search) searchView.highlightSelected(id);

		//Create a new recipe object
		state.recipe = new Recipe(id);

		try {
			//Get recipe data and parse ingredients
			await state.recipe.getRecipe();
			state.recipe.parseIngredients();

			//Calculate time and servings
			state.recipe.calcServings();
			state.recipe.calcTime();

			//Render recipe
			clearLoader();
			recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
		} catch (err) {
			alert('Error processing Recipe');
		}
	}
};
//Reading Data from the Page URL
//window.addEventListener('hashchange', controlRecipe)

//Add the same event listener to multiple events
//window.addEventListener('hashchange', controlRecipe)
//window.addEventListener('load', controlRecipe);

[ 'hashchange', 'load' ].forEach((event) => window.addEventListener(event, controlRecipe));

/**
 * LIST CONTROLLER
 */
const controlList = () => {
	//Create a new list if there is none yet
	if (!state.list) state.list = new List();

	//Add each ingredient to the list and UI
	state.recipe.ingredients.forEach((el) => {
		const item = state.list.addItem(el.count, el.unit, el.ingredient);
		listView.renderItem(item);
	});
};

//Handle delete and update List Item events
elements.shopping.addEventListener('click', (e) => {
	const id = e.target.closest('.shopping__item').dataset.itemid;

	//Handle Delete Button on the list
	if (e.target.matches('.shopping__delete, .shopping__delete *')) {
		//Delete from State
		state.list.deleteItem(id);

		//Delete from UI
		listView.deleteItem(id);

		//Handle the count update
	} else if (e.target.matches('.shopping__count-value')) {
		const val = parseFloat(e.target.value, 10);
		state.list.updateCount(id, val);
	}
});

/**
 * LIKES CONTROLLER
 */

const controlLike = () => {
	if (!state.likes) state.likes = new Likes();
	const currentID = state.recipe.id;

	//User has not yet liked the current recipe
	if (!state.likes.isLiked(currentID)) {
		//Add the like to state
		const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img);
		//Toggle like button
		likesView.toggleLikeBtn(true);

		//Add like to the UI list
		likesView.renderLike(newLike);
		//console.log(state.recipe);

		//User has liked the current recipe
	} else {
		//Remove the like from the state
		state.likes.deleteLike(currentID);
		//Toggle like button
		likesView.toggleLikeBtn(false);

		//Remove like from the UI list
		likesView.deleteLike(currentID);
	}

	likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//Restore Liked recipes on page load
window.addEventListener('load', () => {
	state.likes = new Likes();

	//Read the storage
	state.likes.readStorage();

	//Toggle the like menu button
	likesView.toggleLikeMenu(state.likes.getNumLikes());

	//Render the existing likes
	state.likes.likes.forEach((like) => likesView.renderLike(like));
});

//Handling recipe button clicks
elements.recipe.addEventListener('click', (e) => {
	if (e.target.matches('.btn-decrease, .btn-decrease *')) {
		if (state.recipe.servings > 1) {
			//Decrease button is clicked
			state.recipe.updateServings('dec');
			recipeView.updateServingsIngredients(state.recipe);
		}
	} else if (e.target.matches('.btn-increase, .btn-increase *')) {
		//Increase button is clicked
		state.recipe.updateServings('inc');
		recipeView.updateServingsIngredients(state.recipe);
	} else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
		//Add ingredients to shopping list
		controlList();
	} else if (e.target.matches('.recipe__love, .recipe__love *')) {
		// Like Controller
		controlLike();
	}

	//console.log(state.recipe);
});
