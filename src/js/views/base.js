//We are going to put all of our DOM elements in base.js. We also put all the element for reusability
export const elements = {
	searchForm: document.querySelector('.search'),
	searchInput: document.querySelector('.search__field'),
	searchRes: document.querySelector('.results'),
	searchResultList: document.querySelector('.results__list'),
	searchResPages: document.querySelector('.results__pages'),
	recipe: document.querySelector('.recipe'),
	shopping: document.querySelector('.shopping__list'),
	likesMenu: document.querySelector('.likes__field'),
	likesList: document.querySelector('.likes__list')
};

export const elementStrings = {
	loader: 'loader'
};
export const renderLoader = (parent) => {
	const loader = `
        <div class= "${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;

	//Where we instert it in the DOM
	parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
	const loader = document.querySelector(`.${elementStrings.loader}`);

	if (loader) {
		//for deleting an element from the DOM, we have to go up to the parent and remove the child.

		loader.parentElement.removeChild(loader);
	}
};
