import apiServices from "./apiServices.js"
import usersFeedback from "./usersFeedback.js"

// UPON SENDING THE FEEDBACK (comment) AND/OR RATING (stars) by pressing the button with id 'send-rating'
const createFeedbackSendingListener = async (restaurantID, location, csrfToken) => {
    document.querySelector(`#send-rating-${restaurantID}`).addEventListener('click', async event => {
        event.preventDefault() // we don't want to reload the whole page after sending the feedback
        const stars = document.querySelectorAll(`#rating-posting-section-stars-${restaurantID} .fa.fa-star.checked`) // this looks for .rating-posting-section-stars, then inside that, for those that have all three classes: '.fa', '.fa-star' and '.checked' (checked fa-stars inside id #rating-posting-section-stars). 
        const rating = stars[stars.length-1]?.dataset.value    // '?.', called 'optional chaining', to ensure that this doesn't result in error if stars is 'undefined'. the last of the stars would be the one on the right, and therefore, 'rating'=that value c: (the rightmost checked star dataset.value!)
        const comment = document.querySelector(`#feedback-text-${restaurantID}`).value
        if (!comment && rating) {
            alert("please also add a comment")
        } else if (!comment && !rating) {
            alert("please provide feedback text and a rating before submitting")
        } else if (comment && !rating) {
            alert('please also provide a rating')
        } else if (comment.length > 2000) {
            alert('please shorten your comment to max 2000 characters')
        } else {
            const restaurant_name = location.name
            const body = {
                restaurant_id: restaurantID,
                restaurant_name,
                comment}
            if(rating) {
                body.rating = rating  // if a rating exists (is not null), then include that in the body
            } else {
                //pass
            }
            document.querySelector(`#feedback-section-${restaurantID}`).style.display = 'none'      // we've sent the feedback, so let's hide the feedback sending section,
            document.querySelector(`#feedback-sent-${restaurantID}`).style.display = 'inline-block' // and let's show the 'feedback sent!' now
            document.querySelector(`#feedback-text-${restaurantID}`).value = ''                     // reset the text field. It's hidden anyway, thus doesn't really matter. This could be removed, as I just made the feedback section invisible already.
            
            const [response, data] = await apiServices.post('/api/feedback/', body, csrfToken)
            console.log(data)
            const addedComment = usersFeedback(body.comment, rating)
            document.querySelector(`#comment-HTML-${restaurantID}`).appendChild(addedComment)       // returns HTML with "<comment id="new-comment">". Here, below, I'm inserting as .textContent the new comment. This is safe, see below comment:
            document.querySelector(`#noratings-${restaurantID}`)?.remove()                          // WORKS: '?.' is called optional chaining; if the left side from ? is null or undefined, then the right side will result in undefined (=the right side is then not executed, it just returns undefined instead). The reason I can't just ?.style.display = 'none' is that you can't assign (=), using '=', something to something that might or might not exist (that is, the ?. of optional chaining)!
            document.querySelector(`#no-comments-HTML-${restaurantID}`)?.remove()                   // if there were no comments yet, no there are, so no need to say 'no comments yet' anymore c:   
        }
    })
}
export default createFeedbackSendingListener