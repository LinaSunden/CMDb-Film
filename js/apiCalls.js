//#region API URLs
const cmdbUrl = "https://grupp6.dsvkurs.miun.se/api";
const omdbURL = "http://www.omdbapi.com/?";
//#endregion

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

async function getMovieOmdbFullPlot(imdbID){
  const response = await fetch(omdbURL + new URLSearchParams({
      i: `${imdbID}`,
      plot: "full",
      apiKey: `${await getApiKey()}`  
  }));
  
  const oneMovie = await response.json();
  console.log(oneMovie);
  return oneMovie;
}

/**
 * Handle the API PUT request to score a movie.
 * @param {*} imdbID 
 * @param {*} score 
 */
async function scoreMovie(imdbID, score) {
    try {
        const endpoint = `/movies/rate/${imdbID}/${score}`;
        const response = await fetch(cmdbUrl + endpoint, {
        method: 'PUT',
      });
  
      if (!response.ok) {
        throw new Error(`Failed to rate the movie. Status: ${response.status}`);
      }
  
      const movieScored = await response.json();
      return movieScored;
      
    } catch (error) {
      console.error('Error rating movie:', error);
      throw error;
    }
  }

//#endregion

//#region export
export {getMoviesCmdb, getMovieOmdb, scoreMovie, getMovieOmdbFullPlot};
//#endregion