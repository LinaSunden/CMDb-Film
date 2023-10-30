//# region Import
import { rateMovie, ratedMovies } from './scoreRate.js';
// #endregion

//#region Get the movieData from the local storage
const urlParams = new URLSearchParams(window.location.search);
const imdbID = urlParams.get('imdbID');
const movieKey = `movieData_${imdbID}`;
const movieString = localStorage.getItem(movieKey);
const movieData = JSON.parse(movieString);

//contains all the data for the movie
console.log(movieData); 

// All data we view at the moment for each movie
const title = movieData.Title;
const poster = movieData.Poster;
const score = movieData.cmdbScore;
const year = movieData.Year;
const realeased = movieData.Released;
const runtime = movieData.Runtime;
const plot = movieData.Plot;
const numberCmdbVotes = movieData.count;
const reviewsData = JSON.stringify(movieData.reviews);
const genre = movieData.Genre;
const categorizedScores = JSON.stringify(movieData.categorizedScores);
const language = movieData.Language;
const actors = movieData.Actors;
const director = movieData.Director;
const writer = movieData.Writer;
const awards = movieData.Awards;
//awards, språk, director, actor, writer

const scoresArray = JSON.parse(categorizedScores);
 //#endregion


const scoreSection = document.querySelector('.see-rating-section');

//iterate over the array and create html elements
scoresArray.forEach(item => {
  //create a new div for each item
  const scoreItem = document.createElement('div');

  //set the content of the div to display the score and count
  scoreItem.textContent = `Score: ${item.score}, Count: ${item.count}`;

//append the created div to the section
scoreSection.appendChild(scoreItem);
});
 

//#region functions calls
movieInfo();
movieCmdbRating();
showReviews();
rateMovieDetailpage();
//#endregion


//#region functions for movie details

/**
 * Function that presents title, plot, runtime, release year and poster of the movie
 */
function movieInfo() {
//title
const infoMovie = document.querySelector('.info-movie');
const titleText = document.createElement('h1');
titleText.textContent = title;
infoMovie.appendChild(titleText);

//plot
const plotText = document.createElement('p');
const plotSpan = document.createElement('span');
plotSpan.textContent = 'Plot: ';
plotText.textContent = plot;
plotText.prepend(plotSpan);
infoMovie.appendChild(plotText);

//runtime
const runtimeText = document.createElement('p');
const runtimeSpan = document.createElement('span');
runtimeText.textContent = runtime;
runtimeSpan.textContent = 'Runtime: ';
runtimeText.prepend(runtimeSpan);
infoMovie.appendChild(runtimeText);

//Year
const releaseYearText = document.createElement('p');
const releaseYearSpan = document.createElement('span');
releaseYearText.textContent = year;
releaseYearSpan.textContent = 'Year: ';
releaseYearText.prepend(releaseYearSpan);
infoMovie.appendChild(releaseYearText);

//released
const releasedText = document.createElement('p');
const releasedSpan = document.createElement('span');
releasedText.textContent = realeased;
releasedSpan.textContent = 'Released: ';
releasedText.prepend(releasedSpan);
infoMovie.appendChild(releasedText);

//imdb id, temorär grej TABORT INNAN INLÄMNING
const imdbIDText = document.createElement('p'); 
const imdbIDSpan = document.createElement('span');
imdbIDText.textContent = `IMDb ID: ${imdbID}`;
imdbIDText.id = `imdbIDDisplay`;
imdbIDText.prepend(imdbIDSpan);
infoMovie.appendChild(imdbIDText);

//genre
const genreText = document.createElement('p');
const genreSpan = document.createElement('span');
genreText.textContent = genre;
genreSpan.textContent = 'Genre: ';
genreText.prepend(genreSpan);
infoMovie.appendChild(genreText);

//language
const languageText = document.createElement('p');
const languageSpan = document.createElement('span');
languageText.textContent = language;
languageSpan.textContent = 'Language: ';
languageText.prepend(languageSpan);
infoMovie.appendChild(languageText);

//actors
const actorsText = document.createElement('p');
const actorsSpan = document.createElement('span');
actorsText.textContent = actors;
actorsSpan.textContent = 'Actors: ';
actorsText.prepend(actorsSpan);
infoMovie.appendChild(actorsText);

//director
const directorText = document.createElement('p');
const directorSpan = document.createElement('span');
directorText.textContent = director;
directorSpan.textContent = 'Director: ';
directorText.prepend(directorSpan);
infoMovie.appendChild(directorText);

//writer
const writerText = document.createElement('p');
const writerSpan = document.createElement('span');
writerText.textContent = writer;
writerSpan.textContent = 'Writer: ';
writerText.prepend(writerSpan);
infoMovie.appendChild(writerText);

//awards
const awardsText = document.createElement('p');
const awardsSpan = document.createElement('span');
awardsText.textContent = awards;
awardsSpan.textContent = 'Awards: ';
awardsText.prepend(awardsSpan);
infoMovie.appendChild(awardsText);



//poster
const posterContainer = document.createElement('div');
posterContainer.classList.add('moviePoster');

const posterLink = document.createElement('a');
posterLink.href = poster;
posterLink.target = '_blank';

const posterImage = document.createElement('img');
posterImage.src = poster;
posterImage.alt = `${title} poster`;

posterLink.appendChild(posterImage);
posterContainer.appendChild(posterLink);

const posterContainers = document.querySelectorAll('.flex-posters');
posterContainers.forEach(container => container.appendChild(posterContainer));
}

/**
 * Function that presents the cmdb rating and number of votes
 */
function movieCmdbRating() {

const cmdbScore = document.querySelector('.rating-number');
const cmdbVotes = document.querySelector('.votes');

cmdbScore.textContent = score;
cmdbVotes.textContent = `Based on: ${numberCmdbVotes} votes`;
}

/**
 * Function that presents the reviews of the movie
 */
function showReviews() {
    const reviewContainer = document.querySelector('.read-review');
    const reviewsArray = JSON.parse(reviewsData);
    reviewsArray.forEach(review => {
      if (review.reviewer === null || review.review === null) {
        return;
      }
 
  const reviewWrapper = document.createElement('div');
  reviewWrapper.classList.add('review-entry');
  
  const reviewerInfo = document.createElement('h4');
  reviewerInfo.textContent = `${review.reviewer} ${review.date}`;
  
  const reviewText = document.createElement('p');
  reviewText.textContent = review.review;
  
  
  reviewWrapper.appendChild(reviewerInfo);
  reviewWrapper.appendChild(reviewText);
  reviewContainer.appendChild(reviewWrapper);
  });
}

/**
 * Function that handles the rating of the movie on the detailpage
 */
function rateMovieDetailpage(){
  const ratingLinks = document.querySelectorAll('.set-rating-detailpage .rating ul li a');
  // Add event listeners to rating buttons
  ratingLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const ratingOption = link.textContent;
      rateMovie(imdbID, ratingOption, ratedMovies, link);
    });
  });
}
//#endregion


export {movieInfo, showReviews}



