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
const imdbRating = movieData.imdbRating;
const imdbVotes = movieData.imdbVotes;
const otherRatings = JSON.stringify(movieData.Ratings);
//#endregion







 

//#region functions calls
movieInfo();
movieCmdbRating();
otherMovieRatings();
showReviews();
rateMovieDetailpage();
//#endregion


//#region functions for movie details

/**
 * Function that presents title, plot, runtime, release year, poster of the movie and more
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
 * Function that presents the imdb rating and the other ratings
 */
function otherMovieRatings(){
//imdb rating
const imdbContainer = document.createElement('div');
imdbContainer.classList.add('imdb');

const imdbHeadline = document.createElement('h2');
imdbHeadline.textContent = 'IMDb';

const imdbVotesText = document.createElement('p');
const imdbVotesSpan = document.createElement('span');
imdbVotesSpan.textContent = 'Votes: ';
imdbVotesText.textContent = imdbVotes;
imdbVotesText.prepend(imdbVotesSpan);

const imdbRatingText = document.createElement('p');
const imdbRatingSpan = document.createElement('span');
imdbRatingSpan.textContent = 'Rating: ';
imdbRatingText.textContent = imdbRating;
imdbRatingText.prepend(imdbRatingSpan);

imdbContainer.appendChild(imdbHeadline);
imdbContainer.appendChild(imdbVotesText);
imdbContainer.appendChild(imdbRatingText);

//The other ratings
const otherRatingsContainer = document.querySelector('.otherRatings');
otherRatingsContainer.appendChild(imdbContainer);

const otherRatingsArray = JSON.parse(otherRatings);
otherRatingsArray.forEach(rating => {
  const otherRatingContainer = document.createElement('div');
  otherRatingContainer.classList.add('otherRating');

  const otherRatingHeadline = document.createElement('h2');
  otherRatingHeadline.textContent = rating.Source;

  const otherRatingText = document.createElement('p');
  const otherRatingSpan = document.createElement('span');
  otherRatingSpan.textContent = 'Rating: ';
  otherRatingText.textContent = rating.Value;
  otherRatingText.prepend(otherRatingSpan);

  otherRatingContainer.appendChild(otherRatingHeadline);
  otherRatingContainer.appendChild(otherRatingText);

  otherRatingsContainer.appendChild(otherRatingContainer);
});
  
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


const scoresArray = JSON.parse(categorizedScores);
 console.log(scoresArray);


const scoreSection = document.querySelector('.see-rating-section');

const countArray = [];

//iterate over the array and create html elements
scoresArray.forEach(item => {
  //create a new div for each item
  const scoreItem = document.createElement('div');

  countArray.push(item.count);

//append the created div to the section
scoreSection.appendChild(scoreItem);
});










//#region user interface dynamic changes for rating

// Update the UI with the score
function updateRatingUI(score) {
  score = Math.max(1, Math.min(4, score));

  // Calculate the margin based on specific conditions
  let marginValue;

  if (score === 1) {
    marginValue = 1;
  } else if (score === 2) {
    marginValue = 52;
  } else if (score === 3) {
    marginValue = 104;
  } else if (score === 4) {
    marginValue = 200;
  } else {
    // For scores between integers, interpolate the margin value
    const interval = 52; // Adjust this based on your desired margin between scores
    marginValue = (score - 1) * interval;
  }
  // Set the margin-left dynamically
  document.getElementById('rating-stroke').style.marginLeft = `${marginValue}px`;
  document.getElementById('number').style.marginLeft = `${marginValue}px`;
}
updateRatingUI(score);



// Update the bars with the vote colors
function updateVoteColors(scoresArray) {
  const totalVotes = scoresArray.reduce((sum, item) => sum + item.count, 0);

  scoresArray.forEach(item => {
    const percentage = (item.count / totalVotes) * 100;
    const selector = getSelector(item.score);
    if (selector) {
      document.querySelector(selector).style.background = `linear-gradient(to right, ${getColor(selector)} ${percentage}%, gray 0%)`;
    }
  });
}

function getSelector(score) {
  switch (score) {
    case 4:
      return '.green-vote';
    case 3:
      return '.lightgreen-vote';
    case 2:
      return '.orange-vote';
    case 1:
      return '.red-vote';
    default:
      return '';
  }
}

function getColor(selector) {
  switch (selector) {
    case '.green-vote':
      return 'green';
    case '.lightgreen-vote':
      return '#8CA047';
    case '.orange-vote':
      return 'orange';
    case '.red-vote':
      return 'red';
    default:
      return '';
  }
}
updateVoteColors(scoresArray);


//function that updates the  counts
function updateVoteCounts(scoresArray) {
  scoresArray.forEach(item => {
    const selector = getSelectorClass(item.score);
    const countElement = document.getElementById(`${selector}`);

    if (countElement) {
      countElement.textContent = `${item.count} st`;
    }
  });
}


function getSelectorClass(score) {
  switch (score) {
    case 4:
      return 'greentext';
    case 3:
      return 'lightgreentext';
    case 2:
      return 'orangetext';
    case 1:
      return 'redtext';
    default:
      return '';
  }
}
updateVoteCounts(scoresArray);

//#endregion




export {movieInfo, showReviews}



