
// detalj: https://www.omdbapi.com/?i=tt3896198&apikey=5a4be969
// https://omdbapi.com/?i=tt4300958&plot=full&apikey=5a4be969



const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

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


function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID;
        movieListItem.classList.add('search-list-item');
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
           
            const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&plot=full&apikey=5a4be969`); //combine detta resultatet med cmdbs uppgifter, som läggs in i moviedetails
            const movieDetails = await result.json();

            // const cmdbResponse = await fetch(`https://grupp6.dsvkurs.miun.se/api/movies/${movie.dataset.id}`);
            // const cmdbMovieDetails = await cmdbResponse.json();
            
            // const combinedMovieDetails = { ...omdbMovieDetails, ...cmdbMovieDetails };
            
            // Store movie data and redirect to details page  //TOG BORT FÖR FICK MASSA ERRORS
            storeMovieData(result);
           
            redirectToMovieDetails(movieDetails.imdbID);
         
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
    const url = constructMovieURL(imdbID);
    // Redirect to the detail page with the IMDb ID in the URL
    window.location.href = url;
}

// Byte till söksidan
function redirectToSearchPage() {  
    const searchTerm = document.getElementById('movie-search-box').value.trim();
    if (searchTerm.length > 0) {
        window.location.href = `search.html?searchTerm=${searchTerm}`;
    } else {
        window.location.href = 'search.html';
        console.log('$searchTerm')
    }
} 







function displayMovieDetails(details){
    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"} alt = "movie poster"> 
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors:</b> ${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `;

}

// function loadMovieDetails(){
//     const searchListMovies = searchList.querySelectorAll('.search-list-item');
//     searchListMovies.forEach(movie => {
//         movie.addEventListener('click', async () => {
//             // console.log(movie.dataset.id);  får fram id
//             searchList.classList.add('hide-search-list');
//             movieSearchBox.value = "";
//             const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=5a4be969`);
//             const movieDetails = await result.json();
//             // console.log(movieDetails)
//             displayMovieDetails(movieDetails);
//         });
//     });
// }

