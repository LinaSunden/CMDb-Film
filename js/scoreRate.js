//#region imports
import { scoreMovie } from "./apiCalls.js";
//#endregion

//#region variables
//place the ratedMovies in a local storage and if it is empty, create an empty array
let ratedMovies = localStorage.getItem('ratedMovies') ? JSON.parse(localStorage.getItem('ratedMovies')) : [];
//#endregion

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
        console.log('Your rating is ', response);

        // Update the UI to show the user's rating
        link.textContent = 'Your rating is ' + option;

        ratedMovies.push(imdbID);   
  
        // Update ratedMovies in local storage
        localStorage.setItem('ratedMovies', JSON.stringify(ratedMovies));
      })
      .catch(error => {
        console.error('Error rate movie:', error);
      });
  } else {
    // Display a message to inform the user they've already rated the movie
    alert('You have already rated this movie.');
  }
}

//#endregion

//#region export
export {rateMovie, ratedMovies};
//#endregion