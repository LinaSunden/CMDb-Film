import { ratedMovies } from './scoreRate.js';

    const imdbID = getImdbIDFromURL();
    console.log('IMDb ID:', imdbID);

    function getImdbIDFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('imdbID');
    }

        const buttonReview2 = document.getElementById('button-review2');



        buttonReview2.addEventListener('click', function(event) {
        event.preventDefault();

       
           
            const firstName = document.getElementById("firstName").value;
            const lastName = document.getElementById("lastName").value;
            const fullName = `${firstName} ${lastName}`;
            const date = document.getElementById("date").value;
            const review = document.getElementById("review").value;
            const score = 3;
            if (!firstName || !lastName || !date || !review) {
                alert('Please fill in all fields'); 
                return;
            } else {
                submitReviewToAPI(imdbID, fullName, score, review, date);
            }
           
      
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

     
 
   

//automatiskt lägga till dagens datum 


