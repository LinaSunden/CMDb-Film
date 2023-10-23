const cmdbUrl = "https://grupp6.dsvkurs.miun.se/api";
const omdbURL = "http://www.omdbapi.com/?";


async function getApiKey(){
    const endpoint = "/keys/grupp7/46bc07e8-d9d7-4078-8516-e544d35e21e7";
    const response = await fetch(cmdbUrl + endpoint);
    const data = await response.json();
    return data.apiKey;
}

async function getMoviesCmdb(moviesPerPage){
 
const response = await fetch(`https://grupp6.dsvkurs.miun.se/api/toplists?sort=DESC&limit=${moviesPerPage}&page=1&countLimit=4`);
    const movies = await await response.json();
    return movies;
}

async function getMovieOmdb(){
    const response = await fetch(omdbURL + new URLSearchParams({
        i: "tt6166392",
        apiKey: "5a4be969"  
    }));
    
    const oneMovie = await response.json();
    displayMovieList(oneMovie);

}

async function displayMovieList(movie)
{
   const top1 = document.querySelector('.movieImg1'); 
   top1.src = `${movie.Poster}`;

   const movieTitle1 = document.getElementById('movieTitle1');
   movieTitle1.textContent =`${movie.Title}`;

   console.log(movie); 
}


function handleError(error)
{
    console.log(error);
}

async function fetchMovies(){
    try {
        const movies = await getMoviesCmdb(10);
        const present = await getMovieOmdb();
       
        console.log(movies);
        
    } catch (error) {
        handleError(error);
    }
    
};

fetchMovies();


//https://www.omdbapi.com/?i=tt6166392&apikey=5a4be969




