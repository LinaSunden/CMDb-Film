const cmdbUrl = "https://grupp6.dsvkurs.miun.se/api";
const omdbURL = "http://www.omdbapi.com/?";

//#region API calls functions
/**
 * 
 * @returns {Promise<string>} The API key for the OMDB API.
 */
async function getApiKey(){
    const endpoint = "/keys/grupp7/46bc07e8-d9d7-4078-8516-e544d35e21e7";
    const response = await fetch(cmdbUrl + endpoint);
    const data = await response.json();
    return data.apiKey;
}

/**
 * 
 * @param {*} moviesPerPage is the number of movies to be returned from the CMDB API.
 * @returns return the top movies from the CMDB API.
 */
async function getMoviesCmdb(moviesPerPage){
 const endpoint = `/toplists?sort=DESC&limit=${moviesPerPage}&page=1&countLimit=2`;
const response = await fetch(cmdbUrl + endpoint);
    const movies = await await response.json();
    return movies;
}

/**
 * 
 * @param {*} imdbID 
 * @returns fetch the movie with the specifik imdbID from the OMDB API.
 */
async function getMovieOmdb(imdbID){
    const response = await fetch(omdbURL + new URLSearchParams({
        i: `${imdbID}`,
        apiKey: `${await getApiKey()}`  
    }));
    
    const oneMovie = await response.json();
    return oneMovie;
}

//#endregion


export {getMoviesCmdb, getMovieOmdb};