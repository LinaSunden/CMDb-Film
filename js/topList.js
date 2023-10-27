//#region imports
import { rateMovie, ratedMovies } from './scoreRate.js';
import { getMoviesCmdb, getMovieOmdb } from './apiCalls.js';
// #endregion



//#region functions calls

console.log(combineResults());
fetchMoviesTop3();
fetchMoviesFromTop4();
// #endregion

// #region functions for top list

/**
 * Take the results from the CMDB and the OMDB API and combine them into one object.
 * @returns {Promise<Array>} An array of combined movie objects.
 */
async function combineResults(){
    const moviesCmdb = await getMoviesCmdb(10);
    const moviePromises = moviesCmdb.movies.map(async (movie) => {
        const imdbID = movie.imdbID;
        const movieOmdb = await getMovieOmdb(imdbID);
        return { ...movie, ...movieOmdb };
    });

    const combinedMovies = await Promise.all(moviePromises);
    return combinedMovies;
}


/**
 * Fetch the top 3 movies from the CMDB with data from OMDB API.
 */
async function fetchMoviesTop3(){
    const topContainers = [
        document.getElementById('top1'),
        document.getElementById('top2'),
        document.getElementById('top3')
    ];

    const rankElements = [];

try {
    const combinedMovies = await combineResults(); 
    
    combinedMovies.slice(0, 3).forEach(async (movie, index) => {
        createMovieContainer(movie, topContainers[index]);

    const rankElement = document.createElement('h1');
    rankElement.id = `rank${index + 1}`;
    rankElement.textContent = index + 1;
    rankElements.push(rankElement);
    
  });

  // Append the rank elements to the respective top containers
  rankElements.forEach((rankElement, index) => {
    topContainers[index].appendChild(rankElement);
  });
  } catch (error) {
    handleError(error);
  }
}

/**
 * Fetch the top 4-10 movies from the CMDB with data from OMDB API.
 */
async function fetchMoviesFromTop4() {
    const topContainers = [];

    for (let i = 4; i <= 10; i++) {
      const topContainer = document.createElement('div');
      topContainer.classList.add('flex-item-4-10');
      topContainer.id = `top${i}`;
  
      const rankElement = document.createElement('h1');
      rankElement.id = `rank${i}`;
      rankElement.textContent = i;
  
      topContainer.appendChild(rankElement);
      topContainers.push(topContainer);
    }

    const top4To10Container = document.querySelector('.top4-10-container');
    topContainers.forEach(container => top4To10Container.appendChild(container));
  
    try {
      const combinedMovies = await combineResults();
  
      combinedMovies.slice(3, 3 + topContainers.length).forEach(async (movie, index) => {
        createMovieContainer(movie, topContainers[index]);
      });
    } catch (error) {
      handleError(error);
    }
  }

/**
 * Create the movie container with title, poster, score, rating, plot, read more button and to movie details button.
 * @param {} movie 
 * @param {*} targetContainer 
 */
  function createMovieContainer (movie, targetContainer){
    const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
  
        const movieTitle = document.createElement('h3');
        movieTitle.classList.add('movie-title');
        movieTitle.textContent = `${movie.Title}`;
  
        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.src = `${movie.Poster}`;
        movieImg.alt = `Poster of ${movie.Title}`;
  
        const summary = document.createElement('div');
        summary.classList.add('summary');
  
        const movieScore = document.createElement('p');
        movieScore.classList.add('movie-score');
        movieScore.textContent = `Score: ${movie.cmdbScore}`;
  
        const setRating = document.createElement('span');
          setRating.classList.add('set-rating');
          setRating.textContent = 'Score movie';
          
          const rating = document.createElement('div');
          rating.classList.add('rating');
          const ratingOptions = ['1', '2', '3', '4'];

          const ratingList = document.createElement('ul');

          ratingOptions.forEach(option => {
              const listItem = document.createElement('li');
              const link = document.createElement('a');
              link.href = '#';
              link.classList.add("_"+ option);
              link.textContent = option;

              link.addEventListener('click', function (event){
                event.preventDefault();
                const imdbID = movie.imdbID;
                rateMovie(imdbID, option, ratedMovies, link);
              });

              listItem.appendChild(link);
              rating.appendChild(listItem);
            });
    
          const moviePlot = document.createElement('p');
          moviePlot.classList.add('movie-plot');
          moviePlot.textContent = `${movie.Plot}`;
    
          const readMoreButton = document.createElement('button');
          readMoreButton.classList.add('read-more-button');
          readMoreButton.textContent = 'Read more...';
    
          readMoreToggler(readMoreButton, moviePlot);
    
          const toMovieDetails = document.createElement('button');
            toMovieDetails.classList.add('to-movie-details');
            toMovieDetails.textContent = 'To movie details';
    
            toMovieDetails.addEventListener('click', function() {
              goToMovieDetails(movie);
              
          });

          rating.appendChild(ratingList);

          summary.appendChild(movieScore);
          summary.appendChild(setRating);
          summary.appendChild(rating);
          summary.appendChild(moviePlot);
          summary.appendChild(readMoreButton);
    
          movieContainer.appendChild(movieTitle);
          movieContainer.appendChild(movieImg);
          movieContainer.appendChild(summary);
          movieContainer.appendChild(toMovieDetails);

          targetContainer.appendChild(movieContainer);
  }


  /**
 * Create a toggle function for the read more button.
 * @param {*} readMoreButton 
 * @param {*} moviePlot 
 */
function readMoreToggler (readMoreButton, moviePlot) {
    readMoreButton.addEventListener('click', () => {
        moviePlot.classList.toggle('expanded');
        if (moviePlot.classList.contains('expanded')) {
            readMoreButton.textContent = 'Read less...';
        } else {
            readMoreButton.textContent = 'Read more...';
        }
    });
}

/**
 * Create a local storage with all the movie data.
 * Redirect to the movie details page.
 * @param {*} movie 
 */
function goToMovieDetails(movie) {
  // Store the movie object in local storage
  const movieString = JSON.stringify(movie);
  const movieKey = `movieData_${movie.imdbID}`;
  localStorage.setItem(movieKey, movieString);

 // Construct the URL with a query parameter for the IMDb ID
const queryParams = new URLSearchParams();
queryParams.set('imdbID', movie.imdbID);
const url = `movie.html?${queryParams.toString()}`;

// Redirect to the detail page with the IMDb ID in the URL
window.location.href = url;
}
  
/**
 * @param {*} error Error message
 */
  function handleError(error) {
    console.error(error);
  }

// #endregion


