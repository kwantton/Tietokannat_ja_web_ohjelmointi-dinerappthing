export default function(restaurantID) {
    let rating = null
    document.querySelectorAll(`#rating-posting-section-stars-${restaurantID} .fa-star`).forEach(star => { // this looks for .rating-posting-section-stars, then inside that, for .fa-star (class fa-star inside class rating-posting-section-stars).
        star.addEventListener('click', (event) => {     // if a rating section star is clicked,
          rating = event.currentTarget.dataset.value    // then the rating should be its '.dataset.value': the 'dataset' of an HTML Element (like the star element) is an object that contains all 'data-[insert_name_here]' properties, that is, custom attributes, as I explain in the 'starRating.js' file. Since these values are 1,2,3,4 an 5 (in order left to right), you get the rating 1...5 from the dataset.value of the star that was clicked c:
          // event.currentTarget.classList.toggle('checked')
          
          // when a star in a 5-star line is clicked in the rating section (event 'click' above), then for EACH star in those 5 stars (code below):
          document.querySelectorAll(`#rating-posting-section-stars-${restaurantID} .fa-star`).forEach(star => {
            if (star.dataset.value <= rating) {
              star.classList.add('checked')     // e.g. if we're looking at star#2 ('<=', i.e. less or equal value) and the rating was 3, then ensure that star#2 is checked if it wasn't already (=yellow, not empty). This has to be checked as we don't know how many times the user is gonna change their mind or reclick before submitting the review!'.classList.add' is ok even if the class 'checked' is already present in the classList; add doesn't break anything even if the class was present already c:
            } else {
              star.classList.remove('checked')  // e.g. if we're looking at star#4 and the rating was 3, then make sure star#4 is not yellow, i.e. make sure that the class 'checked' is not in star#4's classList. 'remove' doesn't break anything even if the target is not present c:
            }
          })
          console.log(`User rated: ${rating} stars`)
        })
      })
}
