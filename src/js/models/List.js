import uniqid from 'uniqid';
export default class List {
    constructor(){
        this.likes = []
    }
    //Add an item
    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.likes.push(item);
        return item;
    }
    //Delete an item
    deleteItem(id){

        //We want to find out the position of the passed in id to start with

        const index = this.items.findIndex(el => el.id === id);
        //Splice() Ex: [2,4,8] if we do splice(1, 1) means start from index 1 and take 1 element out --> Returns 4 Array: [2,8]
        //Slice() Ex: [2,4,8] if we do splice(1, 2) means StartIndex 1 and EndIndex 2 (not included) --> Returns 4 Array: [2,4,8]

        this.items.splice(index, 1);
    }

    //Update the Count
    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
    }
}