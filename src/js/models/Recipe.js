import axios from 'axios';
import {key} from '../config';
import { IncomingMessage } from 'http';

export default class Recipe {
    constructor(id) {
        this.id = id
    }

    async getRecipe(){
        try{
            const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.image = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
            
        }
        catch(error){
            alert('Something went wrong.');
        }
    }

    calcTime(){
        //we assume that there are 15 min for every 3 ingredients
        const numOfIng = this.ingredients.length;
        const periods = Math.ceil(numOfIng / 3);
        this.time = periods * 15;
    }

    calcServings(){
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pound'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];

        const newIngredients = this.ingredients.map(el => {
            //1. Uniform all the units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            })  
            //2. Remove parantesis
            //We are using Regular Expressions
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //3. Parse Ingredients into count, unit and ingredient

            const arrayIng = ingredient.split(' ');
            //This is a loop with includes where it returns the index of the el2
            const unitIndex = arrayIng.findIndex(el2 => unitsShort.includes(el2));

            let objIng;
            if(unitIndex > -1){
                //There is a unit
                //Ex: 4 1/2 cups, arrCount is [4, 1/2] --> (4+1/2)--> eval(4+1/2) = 4.5
                //Ex: 4 cups, arrCount is [4]

                const arrCount = arrayIng.slice(0, unitIndex);
                let count;
                if(arrCount.length === 1){
                    count = eval(arrayIng[0].replace('-', '+'));
                }else {
                    //Evaluate string makes the JS calculate it. 
                    count = eval(arrayIng.slice(0, unitIndex).join('+'));
                }
                objIng = {
                    count,
                    unit: arrayIng[unitIndex],
                    ingredient: arrayIng.slice(unitIndex + 1).join(' ')
                };

            }else if(parseInt(arrayIng[0], 10)){
                //There is NO unit but the first element is number
                objIng = {
                    count: parseInt(arrayIng[0], 10),
                    unit: '',
                    ingredient: arrayIng.slice(1).join(' ')
                }
            }else if(unitIndex === -1){
                //There is no unit and NO number in the first position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIng;

        });

        this.ingredients = newIngredients;

    }

    updateServings(type) {
        //Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        //Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });
        
        this.servings = newServings;
    }
}