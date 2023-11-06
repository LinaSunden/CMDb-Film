import { ratedMovies } from "./scoreRate.js"; 
import {getMoviesCmdb, scoreMovieWithReturn, getMovieOmdb, getMovieOmdbShortPlot, scoreMovie, getMovieOmdbFullPlot, latestReview, searchForMoviesOmdb, getMoviesCmdbPaging, cmdbScoreFilter, getMoviesByGenre, getMovieDetailsFromCMDB} from './apiCalls.js';


const messageSearchResult = document.getElementById('yoursearch');
const movieSearchBox = document.getElementById('movie-search-box');
const searchButton = document.getElementById('searchbutton')
const movieResults = document.getElementById('movie-results');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');


// Step 2. Fetches the movies from OMDB, if found calls method to display them )
async function loadMovies(searchTerm){
    const searchResults = await searchForMoviesOmdb(searchTerm);
    
   
    if(searchResults && searchResults.length > 0){
        displayMovieList(searchResults);
        displayMovieListSearchBar(searchResults);
    } 
    if (!messageSearchResult) return; // If the element doesn't exist, do nothing
}

// Step 1. Takes the searchTerm from the search box and call the loadMovies method
function findMovies(){
   
    const movieSearchBox = document.getElementById('movie-search-box');

    let searchTerm = (movieSearchBox.value).trim();

    if(searchTerm.length > 0){       
        loadMovies(searchTerm);
        searchList.classList.remove('hide-search-list');
    
        sessionStorage.setItem('searchTerm', searchTerm);
        
    } else {       
            searchList.classList.add('hide-search-list');      
    }
}


// If key has been pressed, call the findMovies method (NOT on search.html)
if (!window.location.href.includes('search.html')) {
    document.getElementById('movie-search-box').addEventListener('keyup', findMovies);
    
    const searchBox = document.getElementById('movie-search-box');

    searchBox.addEventListener('keyup', function(event) {
        // Check if the key that was pressed was Enter
        if (event.key === 'Enter') {
            const searchTerm = searchBox.value.trim();
            if (searchTerm) {
                // Store the search term in localStorage
                localStorage.setItem('searchValue', searchTerm);

                // Redirect to the search results page
                window.location.href = 'search.html';
            }
        } else {
            findMovies(event.target.value);
        }
    });
}

// If search button is clicked, call the findMovies method
searchButton.addEventListener('click', function() {
    const searchValue = document.querySelector('#movie-search-box').value;
    if (searchValue.length > 1) {
        // Store the search term in localStorage
        localStorage.setItem('searchValue', searchValue);

        // Redirect to the search results page
        window.location.href = 'search.html';
    }
});

window.onload = function() {
    // Check if the current page is 'search.html'
    if (window.location.pathname.endsWith('search.html')) {
        // Get the search term from localStorage 
        const searchTerm = localStorage.getItem('searchValue');
        // Use the search term to display the results
        if (searchTerm) {
            loadMovies(searchTerm);

            const yourSearchElement = document.getElementById('yoursearch');
            yourSearchElement.innerHTML = `Your search: ${searchTerm}`;

            let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
            recentSearches.unshift(searchTerm);
            if (recentSearches.length > 10) {
                recentSearches.pop();
            }
            localStorage.setItem('recentSearches', JSON.stringify(recentSearches));

            const toppTodaySearchElement = document.getElementById('topp-today-search');
            toppTodaySearchElement.innerHTML = recentSearches.map((searchTerm, index) => `
                <p><span class="topp-search-number">${index + 1}.</span> ${searchTerm} <span class="type"></span></p>
            `).join('');
        }
    }
};






//#region Search bar
function displayMovieListSearchBar(movies){
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
    loadMovieDetailsSearchBar();
}


function loadMovieDetailsSearchBar() {
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
           
            const omdbMovieDetails = await getMovieOmdbFullPlot(movie.dataset.id);

            try {
                const cmdbMovieDetails = await getMovieDetailsFromCMDB(movie.dataset.id);
                if (!cmdbMovieDetails) {
                    // Handle the case where the movie is not found in the CMDB
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

//#endregion Search bar


//#region functions to save, load and display movies


function storeMovieData(movie) {
    // Store the movie object in local storage
    const movieString = JSON.stringify(movie);
    const movieKey = `movieData_${movie.imdbID}`;
    localStorage.setItem(movieKey, movieString);
}

function constructMovieURL(imdbID) {
    // Construct the URL with a query parameter for the IMDb ID
    const queryParams = new URLSearchParams();
    queryParams.set('imdbID', imdbID);
    const url = `movie.html?${queryParams.toString()}`;
    return url;
}

function redirectToMovieDetails(imdbID) {
    const url = constructMovieURL(imdbID);
    
    window.location.href = url;
}



//#endregion


async function displayMovieList(movies){
    const movieResults = document.querySelector('#movie-results');
    if (movieResults) {
        movieResults.innerHTML = '';
   

    for(let idx = 0; idx < movies.length; idx++){
        
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
       
        
        // const scoreElement = movieDiv.querySelector('.cmdb-score');
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
} else {
    return;
}
}




function loadMovieDetails() {
    const searchListMovies = movieResults.querySelectorAll('.result1');
   console.log(searchListMovies);

    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async (event) => { 
            console.log(movie.dataset.id);
            movieSearchBox.value = "";
            const omdbMovieDetails = await getMovieOmdbFullPlot(movie.dataset.id);
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

//#region Rating 
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
//#endregion Rating



//searches

// Takes searchTerm , stores it, redirects to search.html
function redirectToSearchPage() {
    // Get the search value
    const searchValue = document.querySelector('#movie-search-box').value;
    console.log(searchValue);
    // Store the search value in localStorage
    localStorage.setItem('searchValue', searchValue);
    
    // Redirect to the search results page
    window.location.href = 'search.html';
}

