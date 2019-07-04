/*
export const add = (a,b) => a+b;
export const multiply = (a,b) => a*b;
export const ID = 23;
*/
import { elements } from './base';
//import { isBuffer } from 'util';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
	elements.searchInput.value = '';
};

export const clearResults = () => {
	elements.searchResultList.innerHTML = '';
	elements.searchResPages.innerHTML = '';
};

export const highlightSelected = (id) => {
	const resultsArr = Array.from(document.querySelectorAll('.results__link'));
	resultsArr.forEach((el) => {
		el.classList.remove('results__link--active');
	});
	document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};

//Cutting the Words more than the limit

//Here is how is work for 'Pasta with Tomato and Spinach:
//acc=0: acc + cur.length = 5 -> newTitle = ['Pasta']
//acc=5: acc + cur.length = 9 -> newTitle = ['Pasta', 'with']
//acc=9: acc + cur.length = 15 -> newTitle = ['Pasta', 'with', 'Tomato']
//acc=15: acc + cur.length = 18 -> newTitle = ['Pasta', 'with', 'Tomato']
//acc=18: acc + cur.length = 25 -> newTitle = ['Pasta', 'with', 'Tomato']

export const limitRecipeTitle = (title, limit = 17) => {
	const newTitle = [];
	if (title.length > limit) {
		title.split(' ').reduce((acc, cur) => {
			if (acc + cur.length <= limit) {
				newTitle.push(cur);
			}
			return acc + cur.length;
		}, 0);

		return `${newTitle.join(' ')} ...`;
	}

	return title;
};

const renderRecipe = (recipe) => {
	const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
	elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

//Since we have too many same code inside the renderButtons. We will take those to outside func.

//type: 'prev' and 'next'
//We are using data-* attribute here to go to the specific page
const createButton = (page, type) => `

    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
        
    </button>

`;

const renderButtons = (page, numResults, resPerPage) => {
	//How many pages there are. simply divide number of results by the number of respond per page with ceil.
	const pages = Math.ceil(numResults / resPerPage);

	//Since arrow func. is blocked scoped, we will not have the access to the variable 'button' outside of those if statements. That's why we create it before the if statements.

	let button;
	if (page === 1 && pages > 1) {
		//Only Button to go to next page
		button = createButton(page, 'next');
	} else if (page < pages) {
		//This is one of the middle pages so we need both next and previous button
		button = `
        ${createButton(page, 'prev')}
        ${createButton(page, 'next')}
        `;
	} else if (page === pages && pages > 1) {
		//This is the last page so we only need to go to previous page.
		button = createButton(page, 'prev');
	}
	elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
	//Render results of current page
	const start = (page - 1) * resPerPage;
	const end = page * resPerPage;

	//Now we need to loop through all of the recipes array. We want to part of the array by implementing the slice() method so we can determine where to start and end. slice() methodunda end number included degil.
	recipes.slice(start, end).forEach(renderRecipe);

	//Render Pagination Buttons
	renderButtons(page, recipes.length, resPerPage);
};
