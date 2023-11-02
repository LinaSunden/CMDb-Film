
// detalj: https://www.omdbapi.com/?i=tt3896198&apikey=5a4be969
// https://omdbapi.com/?i=tt4300958&plot=full&apikey=5a4be969

import { ratedMovies } from "./scoreRate.js"; 
import { scoreMovie } from './apiCalls.js';





// #region searchfunction

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

        scoreMovie(imdbID, score)
        .then(data => {
            console.log(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        }); 

        const ratingsElement = document.querySelector(`.rating2[data-id="${imdbID}"]`);
        if (ratingsElement) ratingsElement.style.display = 'none';
    }
}

const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

// #endregion



// #region searchbar
// load movies from API
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
document.getElementById('movie-search-box').addEventListener('keyup', findMovies);




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



function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
           
            const omdbResponse = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&plot=full&apikey=5a4be969`); //combine detta resultatet med cmdbs uppgifter, som läggs in i moviedetails
            const omdbMovieDetails = await omdbResponse.json();

            try {
                const cmdbResponse = await fetch(`https://grupp6.dsvkurs.miun.se/api/movies/${movie.dataset.id}`);
                if (cmdbResponse.status === 404) {
                    // Handle the case where the movie is not found in the CMDB
                    console.log("Movie not found in CMDB");
                    storeMovieData(omdbMovieDetails);
                    redirectToMovieDetails(omdbMovieDetails.imdbID);
                } else if (cmdbResponse.status === 200) {
                    const cmdbMovieDetails = await cmdbResponse.json();
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





function storeMovieData(movie) {
    console.log('Movie Data:', movie);

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
    console.log(imdbID);
    const url = constructMovieURL(imdbID);
    console.log(url);
    // Redirect to the detail page with the IMDb ID in the URL
    window.location.href = url;
}




// #endregion 
  






// #region searchpage
let movieCount = 0;
 

async function displayMovie(movie) {
    // Fetch the detailed information for the movie from the OMDB API

    const responseOMDB = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=5a4be969`);

    const detailsOMDB = await responseOMDB.json();

console.log(movie.imdbID);
    
    // const detailsCMDB = await responseCMDB.json();

    

    // Fetch the detailed information for the movie from the CMDb API
    const responseCMDB = await fetch(`https://grupp6.dsvkurs.miun.se/api/movies/${movie.imdbID}`);
    let detailsCMDB = { cmdbScore: 'N/A', count: 'N/A' }; // Default values
    console.log(detailsCMDB);

   

   
    if (responseCMDB.status === 200) {
        

       detailsCMDB = await responseCMDB.json();
        
    } else if (responseCMDB.status === 404) {
        console.log(`Movie with imdbID ${movie.imdbID} not found in CMDb API`);
    }
    
    const movieData = { ...detailsOMDB, ...detailsCMDB };
    console.log(movieData);
    storeMovieData(movieData);
   
    
    


    // Check if the poster is "N/A", and if it is, replace it with your own image URL
    const posterURL = detailsOMDB.Poster !== "N/A" ? movieData.Poster : "./img/image_not_found.png";

    // Check if the plot is "N/A", and if it is, replace it with your own default plot
    const plot = detailsOMDB.Plot !== "N/A" ? movieData.Plot : "Plot information not available.";

    // Create a new div for the movie
    const movieDiv = document.createElement('div');
    movieDiv.classList.add(movieCount % 2 === 0 ? 'result1' : 'result2', 'clearfix');
    movieDiv.setAttribute('data-imdb-id', movie.imdbID);

    // Set the content of the movie div
    movieDiv.innerHTML = `
        <div class="movie-poster">
        <a href="${posterURL}" target="_blank"> <img src="${posterURL}" alt="${movieData.Title}"/></a>
        </div>
        <div class="movie-summary">
            <h4>${movieData.Title} (${movieData.Year})</h4>
            <p>${plot}</p>
            <p>Runtime: ${movieData.Runtime}</p>
            <p>CMDB Score: ${movieData.cmdbScore}</p>
            <p>Count: ${movieData.count}</p>
        </div>
    `;

    movieDiv.addEventListener('click', (event) => {
        // Redirect to the movie details page
        
        console.log('Clicked on movie with IMDb ID:', movieData.imdbID);
        redirectToMovieDetails(movieData.imdbID);
    });

    // Check if the movie has already been rated
if (detailsCMDB.cmdbScore === 'N/A') {
    const rating = document.createElement('div');
    rating.classList.add('rating2');
    rating.setAttribute('data-id', movie.imdbID);
    const ratingOptions = ['1', '2', '3', '4'];

    const ratingList = document.createElement('ul');
    ratingList.classList.add('rating-list2');

    ratingOptions.forEach(option => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.classList.add("_"+ option + "2");
        link.textContent = option;

        link.addEventListener('click', function (event){
            event.preventDefault();
            rateMovie(movie.imdbID, option);

            rating.classList.add('hide');
        });

        listItem.appendChild(link);
        ratingList.appendChild(listItem);
    });

    rating.appendChild(ratingList);
    movieDiv.appendChild(rating);
}


// const searchResultElement = document.querySelector('.search-result');
// console.log(searchResultElement);
// // if (searchResultElement) {

//     searchResultElement.appendChild(movieDiv);
// // } else {
// //     console.log('Search result element not found');
// // }
// movieCount++;
// }
// const searchResultElement = document.querySelector('.search-result');
// searchResultElement.addEventListener('click', (event) => {
//     // Check if the clicked element is a movieDiv
//     const movieDiv = event.target.closest('.result1, .result2');
//     if (movieDiv) {
//         // Retrieve the IMDb ID from the data attribute
//         const imdbID = movieDiv.getAttribute('data-imdb-id');
//         console.log('Clicked on movie with IMDb ID:', imdbID);

//         // Store IMDb ID in local storage
//         localStorage.setItem('clickedMovieIMDbID', imdbID);

//         // Redirect to the movie details page
//         redirectToMovieDetails(imdbID);
//     }
const searchResultElement = document.querySelector('.search-result');
console.log(searchResultElement);

if (searchResultElement) {
    searchResultElement.appendChild(movieDiv);

    searchResultElement.addEventListener('click', (event) => {
        // Check if the clicked element is a movieDiv
        const movieDiv = event.target.closest('.result1, .result2');
        if (movieDiv) {
            // Retrieve the IMDb ID from the data attribute
            const imdbID = movieDiv.getAttribute('data-imdb-id');
            console.log('Clicked on movie with IMDb ID:', imdbID);

            // Store IMDb ID in local storage
            localStorage.setItem('clickedMovieIMDbID', imdbID);

            // Redirect to the movie details page
            redirectToMovieDetails(imdbID);
        }
    });
} else {
    console.log('search-result element not found');
}

movieCount++;

};




async function fetchAndDisplayMovies(searchTerm, pageNumber) {
        const URL = `https://www.omdbapi.com/?s=${searchTerm}&page=${pageNumber}&apikey=5a4be969`;
        const res = await fetch(URL);
        const data = await res.json();
        storeMovieData(data);
        const searchHeading = document.querySelector('.searchResultheadings h3');
      
    
        // Check if data.Response is "True"
        if (data.Response === "True") {
            // Display the movie information
            
            data.Search.forEach(movie => {
            console.log(movie.imdbID);  
            displayMovie(movie);



            });
            if (searchHeading) {
                searchHeading.textContent = data.Response === "True" ? `Your search: ${searchTerm}` : `No search results found`;
            }  


            
        } else {
            
            searchHeading.textContent = `No search results found`;
        }
}
  
//redirects, searchbutton







function redirectToSearchPage() {
    // Get the search value
    const searchValue = document.querySelector('#movie-search-box').value;
    console.log(searchValue);
    // Store the search value in localStorage
    localStorage.setItem('searchValue', searchValue);
  
    // Redirect to the search results page
    window.location.href = 'search.html';
  }
  
  // Attach the event handler to the search button
  document.querySelector('#searchbutton').addEventListener('click', redirectToSearchPage);

  
  
  // Fetch and display the movies for the search value from localStorage when the page loads
document.addEventListener('DOMContentLoaded', async function() {

    // Get the search value from localStorage
    const searchTerm = localStorage.getItem('searchValue');
    if (searchTerm){
    // Fetch and display the movies for page 1
    await fetchAndDisplayMovies(searchTerm, 1);
}
});

// Get the search box
const searchBox = document.querySelector('#movie-search-box');

// Add an event listener for the 'keypress' event
searchBox.addEventListener('keypress', function (event) {
  // Check if the pressed key was the Enter key
  if (event.key === 'Enter') {
    // Prevent the default action
    event.preventDefault();


    // Perform the search
    redirectToSearchPage();
  
  }
});













// #endregion


