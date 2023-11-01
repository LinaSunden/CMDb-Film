import { ratedMovies } from './scoreRate.js';


// Constants
const imdbID = getImdbIDFromURL();
const messageContainer = document.getElementById('message-container');
const scoreInput = document.getElementById('score');
const buttonReview2 = document.getElementById('button-review2');


// Functions
function getImdbIDFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('imdbID');
}

// Initial UI setup based on whether the movie has been rated
if (ratedMovies) {
  const ratedMovie = ratedMovies.find(movie => movie.imdbID === imdbID);

  if (ratedMovie) {
    // Movie has been rated, display a message with the previous rating
    messageContainer.textContent = `You have rated this movie with ${ratedMovie.ratingScore}.`;

    messageContainer.style.backgroundColor = '#DEF4CC';
    messageContainer.style.border = '1px solid black';
    messageContainer.style.color = 'black';
    messageContainer.style.padding = '15px';
    messageContainer.style.margin = '10px';
    messageContainer.style.borderRadius = '2px';
    messageContainer.style.fontSize = '16px';
    messageContainer.style.fontWeight = 'bold';
    messageContainer.style.display = 'block';


    scoreInput.style.display = 'none';
  } else {
    // Movie hasn't been rated, offer the dropdown box
    // Show the form or any UI elements you want to display for submitting a review
    scoreInput.style.display = 'block';
  }
}

// Event listener for the review submission
buttonReview2.addEventListener('click', function(event) {
  event.preventDefault();

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const fullName = `${firstName}${lastName ? ` ${lastName}` : ''}`;
  const date = document.getElementById("date").value;
  const review = document.getElementById("review").value;

  const scoreInput = document.getElementById("score");
  const ratedMovie = ratedMovies.find(movie => movie.imdbID === imdbID);
  const score = ratedMovie ? parseInt(ratedMovie.ratingScore) : parseInt(scoreInput.value);

  // Check for required fields and whether the movie has been rated

  if (!firstName || !date || !review) {
    alert('Please fill in the required fields');
    return;
  } else {
    // Submit the review
    submitReviewToAPI(imdbID, fullName, score, review, date);

    // Hide the score input after submission
    scoreInput.style.display = 'none';

    // Clear the form
    document.getElementById("firstName").value = '';
    document.getElementById("lastName").value = '';
    document.getElementById("date").value = '';
    document.getElementById("review").value = '';
  }
});

// Function to submit the review to the API
async function submitReviewToAPI(imdbID, fullName, score, review, date) {
  const apiUrl = `https://grupp6.dsvkurs.miun.se/api/movies/review`;

  const reviewData = {
    imdbID: imdbID,
    reviewer: fullName,
    score: score,
    review: review,
    date: date,
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });

    if (response.ok) {
      const successMessage = document.getElementById('review-success-message');
      successMessage.textContent = 'Review submitted successfully';
      successMessage.style.display = 'block';
    } else {
      alert('Check that you have filled in all fields correctly');
    }
  } catch (error) {
    console.error('Error submitting review:', error);
  }
}


    
// //automatiskt lägga till dagens datum 












