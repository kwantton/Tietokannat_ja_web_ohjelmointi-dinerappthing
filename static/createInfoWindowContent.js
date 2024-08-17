import safeHTML from "./safeHTML.js"

// THIS IS THE ACTUAL CONTENT OF EACH RESTAURANT'S INFOWINDOW (remember: 'json_of_locations.forEach(location...)'). This is kinda like a poor man's React (FullStack Open -course teaches the proper way of doing these using React and Node)
// NB! There's not much user-originated HTML left to sanitize below, HOWEVER - placeDetails.name could be whatever. What if the name of the place has ' or < in it, for example? As for the others, 'placeDetails.x' are all derived from Google API, and commentHTML was checked already c:
export default function(place, restaurantID, placeDetails, starRatingHTML, openNowMsg, openingHoursHTML, descriptionsHTML, rating_average,
    filtered_ratings_for_restaurant, noCommentsYetHTML, commentHTML, user, feedbackHTML, signInUltimatumHTML, feedbackSentHTML) {
    const infoWindowContent =
    ` 
    <div id="info-window-content-${restaurantID}"> 
        <h1 class="firstHeading">${safeHTML(placeDetails.name)}</h1> <!-- NOTE! This is the OFFICIAL name. 'location.name', on the other hand, would be whatever is saved in the database table 'restaurants'. Notably, admin can add new places to that table, so it's best to use the official name instead!-->
        ${starRatingHTML}
        <div id="bodyContent">
            <p><b>${safeHTML(place.formatted_address)}</b></p>
            <div>${openNowMsg}</div>
            <ul>${openingHoursHTML}</ul>
            <h2>¿🍔/🍹/☕? </h2>
            <ul id='descriptions-html'>${descriptionsHTML}</ul>
            <h2>comments</h2>
            <p>
            ${filtered_ratings_for_restaurant.length !== 0
                ? `${filtered_ratings_for_restaurant.length} rating${filtered_ratings_for_restaurant.length === 1 ? '' : 's'}`
                : `<noratings id='noratings-${restaurantID}'>no star ratings yet</noratings>`}
            ${filtered_ratings_for_restaurant.length !== 0 ? `<br>average: ${Math.round(rating_average*100)/100}/5 <br>` : ''} 
            ${starRatingHTML}
            </p>
            ${noCommentsYetHTML}
            ${commentHTML /** HTML-sanitized previously with safeHTML() regarding user-derived comments, so no XSS-risk or risk of site breaking exists anymore c: */}
            <h2> feedback </h2>
            ${user !== 'admin'
            ? `<div id='feedback-section-${restaurantID}' style=display:inline-block>${user !== '' ? feedbackHTML : signInUltimatumHTML   /** if the user is signed in, and NOT 'admin', show the feedbackHTML, otherwise sell the idea of signing in to them like your life depends on it. This is known as great customer service or something?*/}</div>`                  
            : ` <p> As 'admin', you cannot provide feedback; 'admin' is not in the table 'users', so... please try again as another user! </p>   <!-- if 'admin' is logged in, don't make it possible to send feedback -->
                <a href='/logout'>to logout</a>`
            }
            <div id='feedback-sent-${restaurantID}' style=display:none;color:green>${feedbackSentHTML /** changed to 'display:inline-block' after feedback has been sent successfully c: - so first, it's 'none', invisible */}</div>  
        </div>
    </div>
    `
    // btw, you have to use the `-marks here! (called 'template string') It's only possible to use the ${variable} thing when using this in JavaScript c:
    return infoWindowContent
}