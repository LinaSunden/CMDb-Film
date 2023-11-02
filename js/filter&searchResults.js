import { rateMovie, ratedMovies } from './scoreRate.js';
import { getMoviesCmdb, getMovieOmdb } from './apiCalls.js';  

const movieSearchBox = document.getElementById('movie-search-box');


async function loadMovies(searchTerm){
    const URL = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=5a4be969`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    //console.log(data.Search);
    if(data.Response == "True") displayMovieList(data.Search);
}


function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length> 0 ){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    }  else {
        searchList.classList.add('hide-search-list');
    }     
}
searchBox.addEventListener('keypress', function (event) {
    // Check if the pressed key was the Enter key
    if (event.key === 'Enter') {
      // Prevent the default action
      event.preventDefault();
  
  
      // Perform the search
      redirectToSearchPage();
    
    }
  });

  function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID;
        movieListItem.classList.add('search-list-item');

        let moviePoster;
        if(movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else
            moviePoster = "image_not_found.png";

        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
        <img src = "${moviePoster}"> 
    </div>
    <div class = "search-item-info">
        <h3>${movies[idx].Title}</h3>
        <p>${movies[idx].Year}</p>
    </div>
    `;
    searchList.appendChild(movieListItem)             
    }
    loadMovieDetails();
}