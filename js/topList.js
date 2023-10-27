let ratedMovies = [];


// #region Api calls

const cmdbUrl = "https://grupp6.dsvkurs.miun.se/api";
const omdbURL = "http://www.omdbapi.com/?";

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
 * Create a movie container for the top list.
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

                if (!ratedMovies.includes(imdbID)) {
                  const ratingScore = parseInt(option);
            
                  scoreMovie(imdbID, ratingScore)
                    .then(response => {
                      console.log('Movie scored:', response);
            
                      // Update the UI to show the user's rating
                      link.textContent = 'You scored ' + option;
            
                      ratedMovies.push(imdbID);
            
                     
                    })
                    .catch(error => {
                      console.error('Error scoring movie:', error);
                    });
                } else {
                  // Display a message to inform the user they've already rated the movie
                  alert('You have already rated this movie.');
                }
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
                // Construct the URL with query parameters
                const movieData = { ...movie };
                const reviewsData = JSON.stringify(movieData.reviews);
                const queryParams = new URLSearchParams();
                queryParams.set('title', movieData.Title);
                queryParams.set('year', movieData.Year);
                queryParams.set('runtime', movieData.Runtime);
                queryParams.set('plot', movieData.Plot);
                queryParams.set('poster', movieData.Poster);
                queryParams.set('score', movieData.cmdbScore);
                queryParams.set('numberCmdbVotes', movieData.count);
                queryParams.set('reviewsData', reviewsData);
                const url = `movie.html?${queryParams.toString()}`;
              
                // Redirect to the detail page with query parameters
                window.location.href = url;
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
 * @param {*} error Error message
 */
  function handleError(error) {
    console.error(error);
  }

// #endregion

