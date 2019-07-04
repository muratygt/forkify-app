/* export default 'I am an exported string' */

import axios from 'axios';
import { key } from '../config';

export default class Search {
	constructor(query) {
		this.query = query;
	}
	//This is the method for search
	async getResult() {
		try {
			const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
			this.result = res.data.recipes;
			console.log(this.result);
		} catch (error) {
			alert(error);
		}
	}
}
