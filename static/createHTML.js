import starRatingHTML from "./starRating.js"
import safeHTML from "./safeHTML.js"

const feedbackHTML = (restaurantID) => `
    <div>
        <p>Feedback:</p>
        <textarea id='feedback-text-${restaurantID}' placeholder='feedback c:'></textarea>
        <p>Rate by clicking on the stars:</p>
        <div class="rating-posting-section-stars" id='rating-posting-section-stars-${restaurantID}'>
        ${starRatingHTML(0) /** this is the star rating (1-5) to be clicked by the user. 'onclick's for each of these 'rating-posting-section-stars' will be set onClick of the infoWindow further below c: */}
        </div>
        <button id='send-rating-${restaurantID}'>Submit</button>
    </div>
    `

const signInUltimatumHTML = () => `
    <div>
        <p>Want to share your experience? Sign in provide feedback!</p>
        <a href='/'> login </a>
    </div>
        `

const feedbackSentHTML = () => `
    <div>
        <p> Feedback sent! </p>
        <a href='/'> home </a>
    </div>
        `

const commentHTML = (restaurantID, filtered_ratings_for_restaurant, filtered_comments_for_restaurant, ratings_for_restaurant) => {
    
    let html = `<ul id="comment-HTML-${restaurantID}"></ul>`                                       // If there are no comments yet, if the user gives the first one, then it shall be appended here (document.querySelector('#comment-HTML-${restaurant_id}')) below! So this is needed even if there are no comments yet!
    if (filtered_ratings_for_restaurant.length !== 0 || filtered_comments_for_restaurant.length !== 0) {  // if there are ratings or comments, then show them
        html = `
            <ul id="comment-HTML-${restaurantID}">` +                                                       // <ul> + <li> for each item as string (.join('') from list) + </ul> finally. Neat, eh? Notice, I'm usinig safeHTML here below
            ratings_for_restaurant.map(item => {
                if (item.comment_visible || item.rating_visible) {
                    return `
                    <li>
                        <p>
                        ${item.comment_visible ? `"${safeHTML(item.comment)}"<br>`: ''}                           <!-- safeHTML escapes '<> etc -->
                        ${item.rating_visible ? `${item.rating}/5 <br>` : ''}
                        (by username "${safeHTML(item.username)}", ${item.created_at.match(/\d+ \w{3} \d{4}/g)})  <!--making this pretty instead of the default version-->
                        </p>
                    </li>`
            } else {
                return ''
            }
            }).join('') + // map returns an array (i.e., [something1, something2]), so here I'm converting it to string -> commentHTML += this string c:
            '</ul>'
            // 'comment_visible' refers to table comments, for which every comment is by default 'visible:TRUE', UNLESS the admin has made it invisible
    }
    return html
}

export default { feedbackHTML, signInUltimatumHTML, feedbackSentHTML, commentHTML } // 'infoWindowContent' is not here: it is its own .js, 'createInfoWindowsContent.js', since it's huge, and the template for all the rest!