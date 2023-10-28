//place the ratedMovies in a local storage and if it is empty, create an empty array
let ratedMovies = localStorage.getItem('ratedMovies') ? JSON.parse(localStorage.getItem('ratedMovies')) : [];


//#region functions for score/set rating
/**
 * Check if the user has rated the movie before.
 * If not, rate the movie and update the UI.
 * If yes, display a message that the movie already been rated.
 * @param {*} imdbID 
 * @param {*} option 
 * @param {*} ratedMovies 
 * @param {*} link 
 */
function rateMovie(imdbID, option, ratedMovies, link) {
  if (!ratedMovies.includes(imdbID)) {
    const ratingScore = parseInt(option);

    scoreMovie(imdbID, ratingScore)
      .then(response => {
        console.log('Movie scored:', response);

        // Update the UI to show the user's rating
        link.textContent = 'You scored ' + option;

        ratedMovies.push(imdbID);   
  
        // Update ratedMovies in local storage
        localStorage.setItem('ratedMovies', JSON.stringify(ratedMovies));
      })
      .catch(error => {
        console.error('Error scoring movie:', error);
      });
  } else {
    // Display a message to inform the user they've already rated the movie
    alert('You have already rated this movie.');
  }
}


/**
 * Handle the API PUT request to score a movie.
 * @param {*} imdbID 
 * @param {*} score 
 */
async function scoreMovie(imdbID, score) {
  try {
    const response = await fetch(`https://grupp6.dsvkurs.miun.se/api/movies/rate/${imdbID}/${score}`, {
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
export {rateMovie, scoreMovie, ratedMovies};
//#endregion