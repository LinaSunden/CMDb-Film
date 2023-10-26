//#region Retrieve query parameters from the URL
const urlParams = new URLSearchParams(window.location.search);
const title = urlParams.get('title');
const poster = urlParams.get('poster');
const score = urlParams.get('score');
const year = urlParams.get('year');
const runtime = urlParams.get('runtime');
const plot = urlParams.get('plot');
const numberCmdbVotes = urlParams.get('numberCmdbVotes');
const reviews = urlParams.get('reviews');
//#endregion


//#region functions calls
movieInfo();
movieCmdbRating();

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


function movieCmdbRating() {

const cmdbScore = document.querySelector('.rating-number');
const cmdbVotes = document.querySelector('.votes');

cmdbScore.textContent = score;
cmdbVotes.textContent = `Based on: ${numberCmdbVotes} votes`;



}


//#endregion
