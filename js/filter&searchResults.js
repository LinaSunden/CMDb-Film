import { ratedMovies } from "./scoreRate.js"; 
import {getMoviesCmdb, scoreMovieWithReturn, getMovieOmdb, getMovieOmdbShortPlot, scoreMovie, getMovieOmdbFullPlot, latestReview, searchForMoviesOmdb, getMoviesCmdbPaging, cmdbScoreFilter, getMoviesByGenre, getMovieDetailsFromCMDB} from './apiCalls.js';
import {storeMovieData, constructMovieURL, redirectToMovieDetails} from './search.js';
    


// const searchButton = document.getElementById('searchbutton');
const movieSearchBox = document.getElementById('movie-search-box');
// const movieSearchBox = document.querySelector('.onlysearchpage .form-control');
const searchButton = document.querySelector('.onlysearchpage .search-button');
const movieResults = document.getElementById('movie-results');



async function loadMovies(searchTerm){
    const searchResults = await searchForMoviesOmdb(searchTerm);
    if(searchResults){
        displayMovieList(searchResults);
    }
}

function findMovies2(){
    

    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        sessionStorage.setItem('searchTerm', searchTerm);
        loadMovies(searchTerm);

        updateRecentSearches(searchTerm);
        displayRecentSearches();

        const searchHeader = document.querySelector('h3');
        searchHeader.textContent = `Your search: ${searchTerm}`;
    }
}

searchButton.addEventListener('click', findMovies2);

movieSearchBox.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
       
        findMovies2();
    }
});



async function displayMovieList(movies){
    const movieResults = document.querySelector('#movie-results');
    movieResults.innerHTML = "";

    for(let idx = 0; idx < movies.length; idx++){
        console.log(movies[idx]); // Add this line
        let movieDiv = document.createElement('div');
        movieDiv.dataset.id = movies[idx].imdbID;
        movieDiv.classList.add('result1', 'clearfix');
        movieDiv.style.display = 'block';

        let moviePoster;
        if(movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else
            moviePoster = "img/img-not-found.png";

            const movieDetails = await getMovieOmdbShortPlot(movies[idx].imdbID);
            console.log(movieDetails);
            const cmdbDetails = await getMovieDetailsFromCMDB(movies[idx].imdbID);
            console.log(cmdbDetails);
            console.log(movieDetails);

            if (cmdbDetails) {
                const cmdbScore = cmdbDetails.cmdbScore;
                movieDiv.innerHTML = `
                    <div class="movie-poster">
                        <a href="${moviePoster}" target="_blank">
                            <img src="${moviePoster}" alt="${movies[idx].Title}"/>
                        </a>
                    </div>
                    <div class="movie-summary">
                        <h4>${movies[idx].Title} (${movies[idx].Year})</h4>
                        <p class="plot">${movieDetails.Plot}</p>
                        <p class="genre">Genre: ${movieDetails.Genre}</p>
                        <p class="runtime">Runtime: ${movieDetails.Runtime}</p>
                        <p class="cmdb-score">Cmdb Score: ${cmdbScore}</p>                        
                    </div>
                `;
            } else {
                movieDiv.innerHTML = `
            <div class="movie-poster">
                <a href="${moviePoster}" target="_blank">
                    <img src="${moviePoster}" alt="${movies[idx].Title}"/>
                </a>
            </div>
            <div class="movie-summary">
                <h4>${movies[idx].Title} (${movies[idx].Year})</h4>
                <p class="plot">${movieDetails.Plot}</p>
                <p class="genre">Genre: ${movieDetails.Genre}</p>
                <p class="runtime">Runtime: ${movieDetails.Runtime}</p>
               
            </div>
        `;
       
        
    const scoreElement = movieDiv.querySelector('.cmdb-score');
    const rating = document.createElement('div');
    rating.classList.add('rating2');
    rating.setAttribute('data-id', movies[idx].imdbID);

    const ratingOptions = ['1', '2', '3', '4'];
    const ratingList = document.createElement('ul');
    ratingList.classList.add('rating-list2');

    ratingOptions.forEach(option => {
        const listItem = document.createElement('li');
        listItem.classList.add('_' + option + '2');

        const link = document.createElement('a');
        link.textContent = option;
        link.href = '#';

        link.addEventListener('click', function (event){
            event.preventDefault();
            event.stopPropagation();
            rateMovie(movies[idx].imdbID, option);
            let scoreElement = movieDiv.querySelector('.cmdb-score');
            if (!scoreElement) {
                scoreElement = document.createElement('p');
                scoreElement.classList.add('cmdb-score');
                movieDiv.querySelector('.movie-summary').appendChild(scoreElement);
            }
            scoreElement.textContent = `CMDB Score: ${option}`;
        });

        listItem.appendChild(link);
        ratingList.appendChild(listItem);
    });

    rating.appendChild(ratingList);
    movieDiv.appendChild(rating);

}

        movieResults.appendChild(movieDiv);
    }
    
    loadMovieDetails();
}


function rateMovie(imdbID, score) {
    console.log(imdbID);
    const ratedMovie = ratedMovies.find(movie => movie.imdbID === imdbID);
    if (ratedMovie) {
        alert(`You've already rated this movie.`);
    } else {
        ratedMovies.push({
            imdbID: imdbID,
            ratingScore: parseInt(score),
        });
        localStorage.setItem('ratedMovies', JSON.stringify(ratedMovies));

        scoreMovieWithReturn(imdbID, score)
    .then(newAverageScore => {   
        const scoreElement = document.querySelector(`.result1[data-id="${imdbID}"] .cmdb-score`);
        if (scoreElement) {
            scoreElement.textContent = `CMDB Score: ${newAverageScore.toFixed(2)}`;
        }             
    })
        .catch((error) => {
            console.error('Error:', error);
        }); 

        const ratingsElement = document.querySelector(`.rating2[data-id="${imdbID}"]`);
        if (ratingsElement) ratingsElement.style.display = 'none';
    }
}

function loadMovieDetails() {
    const searchListMovies = movieResults.querySelectorAll('.result1');
   console.log(searchListMovies);

    searchListMovies.forEach(movie => {
      
        movie.addEventListener('click', async (event) => { 
          
            console.log(movie.dataset.id);
            
            movieSearchBox.value = "";
           
            const omdbMovieDetails = await getMovieOmdb(movie.dataset.id);

            try {
                const cmdbMovieDetails = await getMovieDetailsFromCMDB(movie.dataset.id);
                if (!cmdbMovieDetails) {
                  
                    console.log("Movie not found in CMDB");
                    storeMovieData(omdbMovieDetails);
                    redirectToMovieDetails(omdbMovieDetails.imdbID);
                } else {
                    const combinedMovieDetails = { ...omdbMovieDetails, ...cmdbMovieDetails };
                    
                    storeMovieData(combinedMovieDetails);
                    redirectToMovieDetails(combinedMovieDetails.imdbID);
                }
            } catch (error) {
                console.error("Error fetching movie details:", error);
            }
        });
    });
}

//searches


function updateRecentSearches(searchTerm) {
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    recentSearches.unshift(searchTerm);
    if (recentSearches.length > 10) {
        recentSearches.pop();
    }
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
}
 
  

function displayRecentSearches() {
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    const toppTodaySearch = document.getElementById('topp-today-search');
    toppTodaySearch.innerHTML = '';
    recentSearches.forEach((searchTerm, index) => {
        const p = document.createElement('p');
        p.innerHTML = `<span class="topp-search-number">${index + 1}.</span> ${searchTerm} <span class="type"></span>`;
        toppTodaySearch.appendChild(p);
    });
}
window.onload = displayRecentSearches;
