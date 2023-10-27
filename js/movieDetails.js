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
const runtime = movieData.Runtime;
const plot = movieData.Plot;
const numberCmdbVotes = movieData.count;
const reviewsData = JSON.stringify(movieData.reviews);

//#endregion

//#region functions calls
movieInfo();
movieCmdbRating();
showReviews();
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

//release year
const releaseYearText = document.createElement('p');
const releaseYearSpan = document.createElement('span');
releaseYearText.textContent = year;
releaseYearSpan.textContent = 'Release year: ';
releaseYearText.prepend(releaseYearSpan);
infoMovie.appendChild(releaseYearText);


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


//#endregion
