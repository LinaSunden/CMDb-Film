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

async function getMovieOmdb(imdbID){
    const response = await fetch(omdbURL + new URLSearchParams({
        i: `${imdbID}`,
        apiKey: `${await getApiKey()}`  
    }));
    
    const oneMovie = await response.json();
    //displayMovieList(oneMovie);
    return oneMovie;
}

async function fetchMovies(){
const top1Container = document.querySelector('.topp1');
const top2To3Container = document.querySelector('.topp2-3-container');
const top4To10Container = document.querySelector('.topp4-10-container');

try {
    const movies = await getMoviesCmdb(10);

    movies.movies.forEach(async (movie, index) => {
      const imdbID = movie.imdbID;
      const oneMovie = await getMovieOmdb(imdbID);

      const movieContainer = document.createElement('div');
      movieContainer.classList.add('movie-container');

      const movieTitle = document.createElement('h3');
      movieTitle.classList.add('movie-title');
      movieTitle.textContent = `${oneMovie.Title}`;

      const movieImg = document.createElement('img');
      movieImg.classList.add('movie-img');
      movieImg.src = `${oneMovie.Poster}`;
      movieImg.alt = `Poster of ${oneMovie.Title}`;

      const summary = document.createElement('div');
      summary.classList.add('summary');

      const movieScore = document.createElement('p');
      movieScore.classList.add('movie-score');
      movieScore.textContent = `Score: ${movie.cmdbScore}`;

      const moviePlot = document.createElement('p');
      moviePlot.classList.add('movie-plot');
      moviePlot.textContent = `${oneMovie.Plot}`;

      const readMoreButton = document.createElement('button');
      readMoreButton.classList.add('read-more-button');
      readMoreButton.textContent = 'Read more...';

      const setRating = document.createElement('span');
      setRating.classList.add('set-rating');
      setRating.textContent = 'Score movie';
      
      const rating = document.createElement('div');
      rating.classList.add('rating');
      const ratingOptions = ['1', '2', '3', '4'];
      ratingOptions.forEach(option => {
          const listItem = document.createElement('li');
          const link = document.createElement('a');
          link.href = '#';
          link.classList.add("_"+ option);
          link.textContent = option;
          listItem.appendChild(link);
          rating.appendChild(listItem);
      });

      summary.appendChild(movieScore);
      summary.appendChild(setRating);
      summary.appendChild(rating);
      summary.appendChild(moviePlot);
      summary.appendChild(readMoreButton);

      movieContainer.appendChild(movieTitle);
      movieContainer.appendChild(movieImg);
      movieContainer.appendChild(summary);

  
     
      if (index === 0) {
        top1Container.appendChild(movieContainer);
      } else if (index >= 1 && index <= 2) {
        top2To3Container.appendChild(movieContainer);
      } else {
        top4To10Container.appendChild(movieContainer);
      }
    });
  } catch (error) {
    handleError(error);
  }
}

fetchMovies();


function handleError(error)
{
    console.log(error);
}

/*

async function displayMovieList(movie)
{
   const top1 = document.querySelector('.movieImg1'); 
   top1.src = `${movie.Poster}`;

   const movieTitle1 = document.getElementById('movieTitle1');
   movieTitle1.textContent =`${movie.Title}`;

   const plot = document.getElementById('plotTop1');
   plot.textContent =`${movie.Plot}`;

   console.log(movie); 
}






async function fetchMovies(){

    try {
        const movies = await getMoviesCmdb(10);
        //const present = await getMovieOmdb();
        console.log(movies);
       
        const firstMovie = movies.movies[0];
        console.log(firstMovie);

        const imdbID = firstMovie.imdbID;
        const scoreTop1 = document.getElementById('scoreMovie1');
        scoreTop1.textContent = `Betyg ${firstMovie.cmdbScore}`;
        getMovieOmdb(imdbID);
        
     
      
        
        
    } catch (error) {
        handleError(error);
    }
   
};



fetchMovies();


//https://www.omdbapi.com/?i=tt6166392&apikey=5a4be969

*/


