
//0524a6d7e41cac4a0df826e9aa80cc37
//https://www.food2fork.com/api/search


import Search from './models/Search.js';
import {elements,renderLoader,clearLoader} from './views/base.js';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import Recipe from './models/recipe';
import List from './models/list';
//Global state for Object
//search object . current recipe Object . Shopping list Object.liked recipes
const state ={

};
const controlSearch = async()=>{
  //Get query from view
//   const query = searchView.getInput();
const query = 'pizza';
  //
  if(query){
      //new search object and add it to state
      state.search = new Search(query);
      // Prepate UI for results
      searchView.clearInput();
      searchView.clearResults();
      renderLoader(elements.searchResLoader);
      // Serch for recipses
      await state.search.getResults();
      //Render Results to UI
      clearLoader();
      searchView.renderResults(state.search.result);
      

  }
}
elements.searchForm.addEventListener('submit',e=>{
    e.preventDefault();
    controlSearch();
});

elements.paginationButtons.addEventListener('click',e =>{
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto,10);
        searchView.clearResults();
        searchView.renderResults(state.search.result,goToPage);
    }
});


// Receipe Controller

// Multiple event handlets 

const controlRecipe = async () => {
    const id = window.location.hash.replace('#','');

    if(id){
        //Prepare Ui for Changes
        recipeView.clearRecipe();
         renderLoader(elements.recipe);
         //Highlight selector
        if(state.search){
           
         searchView.highlightSelected(id);}
        // Create a new recipe Object
       state.recipe = new Recipe(id);
       

       try {
           console.log(state.recipe);
           
           await state.recipe.getRecipe();
           //Calculate servinfs and Time 
           state.recipe.parseIngredients();
           debugger;
           console.log(state.recipe.ingredients);
           state.recipe.calcTime();
           state.recipe.calcServings();

           // Render recipe

           clearLoader();
          recipeView.renderRecipe(state.recipe);
       }catch(err){
           console.log("error nbjjk");
       }
    }
};
//List Controlelr 


const controlList = () => {
    // Create a new List if there is a none yet

    if(!state.list){
        state.list = new List();
    }

    //Add each Ingredient to List and UI

    state.recipe.ingredients.forEach(el=>{
         const item = state.list.addItem(el.count,el.unit,el.ingredient);
         listView.renderItem(item);
    });
}

//Like Controller 








['hashchange','load'].forEach(event=>window.addEventListener(event,controlRecipe));

//Handling Reciepe button clicks

elements.recipe.addEventListener('click',e =>{
    if(e.target.matches('.btn-decrease,.btn-decrease *')){
        if(state.recipe.servings >1){
        state.recipe.updateServings('dec');
        recipeView.updateServingsIngredients(state.recipe);
        }
    }
    else if(e.target.matches('.btn-increase,.btn-increase *')){
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }else if(e.target.matches('.recipe__btn--add,.recipe__btn--add *')){
        controlList();

    }
    
});

// Handlist delete and update list item ecvens

elements.shopping.addEventListener('click',e =>{
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //Handle delete 

    if(e.target.matches('.shopping__delete,.shopping__delete *')){

        //delete from state

        state.list.deleteItem(id);

        //UI delete

       listView.deleteItem(id);
    }else if (e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value,10);
        state.list.updateCpount(id,val);
    }
})
