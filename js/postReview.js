
// import { movieInfo } from './movieDetails.js';
// import { showReviews } from "./movieDetails";
import { ratedMovies } from './scoreRate.js';

// showReviews();


// console.log('Before submitReviewToAPI');
// console.log('After submitReviewToAPI');
const imdbID = getImdbIDFromURL();
console.log('IMDb ID:', imdbID);

 function getImdbIDFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('imdbID');
  }


// if (ratedMovies.includes(imdbID)) {
    
//     const userRating = getRatingForMovie(imdbID);
    
//     const userRatingInfo = document.getElementById('user-rating-info');
//     userRatingInfo.textContent = 'You have already rated this movie';
//     userRatingInfo.style.display = 'block';
// }







 const buttonReview2 = document.getElementById('button-review2');

 buttonReview2.addEventListener('click', function(event) {
    event.preventDefault();

     // Get form inputs
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const fullName = `${firstName} ${lastName}`;
    const date = document.getElementById("date").value;
    const review = document.getElementById("review").value;
    const score = 3;

    submitReviewToAPI(imdbID, fullName, score, review, date);
});


 async function submitReviewToAPI(imdbID, fullName, score, review, date){
    
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
    console.log(response);

    if (response.ok) {
       const successMessage = document.getElementById('review-success-message');
       successMessage.textContent = 'Review submitted successfully';
       successMessage.style.display = 'block';
    } else { 
        alert('Check that you have filled in all fields correctly');
    }

 } catch(error) {
        console.error('Error submitting review:', error);
    }
}

     
    



//    async function submitReview(event) {
//     console.log('Button clicked')
//     event.preventDefault(); 



    // Get form inputs
    // const firstName = document.getElementById("firstName").value;
    // const lastName = document.getElementById("lastName").value;
    // const date = document.getElementById("date").value;
    // const reviewText = document.getElementById("review").value;

    // // Validate inputs
    // if (!firstName || !lastName || !date || !reviewText) {
    //     alert('Please fill in all fields'); // Display an alert if any field is empty
    //     return;
    // } 

//automatiskt lägga till dagens datum 

    // Prepare review data
    // const reviewData = {
    //     imdbID: imdbID,
    //     reviewer: `${firstName} ${lastName}`,
    //     score: 3,
    //     review: reviewText,
    //     date: date,
    // };
    // console.log(reviewData);

    
    

    // Clear form inputs
    // document.getElementById('firstName').value = '';
    // document.getElementById('lastName').value = '';
    // document.getElementById('date').value = '';
    // document.getElementById('review').value = '';
// }

// export { submitReview };
