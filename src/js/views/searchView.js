import {elements} from './base.js';
export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
}
export const clearResults = () => {
elements.searchResList.innerHTML='';
elements.paginationButtons.innerHTML='';
}
const limitReceipeTitles = (title,limit=17)=>{
    const newTitle = [];
   if(title.length>limit){
      title.split(' ').reduce((acc,curr)=>{
       if(acc+curr.length <= limit){
           newTitle.push(curr);
       }
       return acc+curr.length;
      },0);
      return  `${newTitle.join(' ')} ...`;
   }
   return title;
}
const renderRecipe = receipe => {
    const markup = `  
    <li>
     <a class="results__link" href="#${receipe.recipe_id}">
        <figure class="results__fig">
            <img src="${receipe.image_url}" alt="Test">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitReceipeTitles(receipe.title)}</h4>
            <p class="results__author">${receipe.publisher}</p>
        </div>
     </a>
  </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend',markup);

}

const createButton = (page,type)=>{
    const button = `<button class="btn-inline results__btn--${type}" data-goto=${type=='prev'?page-1:page+1}>
    <span>${type=='prev'?page-1:page+1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type=='prev'?'left':'right'}"></use>
    </svg>
   </button>
`;
elements.paginationButtons.insertAdjacentHTML('afterbegin',button);


}
const renderButtons = (page,numOfResults,resPerPage)=> {
  const pages = Math.ceil(numOfResults/resPerPage);
  let button;
  if(page===1 && pages >1){
   button = createButton(page,'next');
  }else if (page<pages){
      button = `
      ${button = createButton(page,'prev')}
      ${button = createButton(page,'next')}
      `;

  }else if(pages > 1 && page == pages){
    button = createButton(page,'prev');
  }



};
export const renderResults = (recipes,page=1,resPerPage=10) => {
    const start = (page-1)*resPerPage;
    const end  = page*resPerPage;
    recipes.slice(start,end).forEach(renderRecipe);
    renderButtons(page,recipes.length,resPerPage);
};

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelector('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    })
    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
}