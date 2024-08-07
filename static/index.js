// Initialize and add the map
import apiServices from "./apiServices.js"; // import the whole JSON as 'apiServices' -> e.g. a basic fetch GET is now usable as 'apiServices.get(url)'
import starRating from "./starRating.js";
import usersFeedback from "./usersFeedback.js";
import safeHTML from "./safeHTML.js";


// ^^ if you're unfamiliar with JS: since this function 'initMap' is async, I have to use "await" for all asynchronic operations like 'fetch'. If the function wasn't "asyc", you'd use 'fetch(address_here).then(blah blah).then(blah blah)' instead of 'const response = await fetch(address_here); const data = ...'. So there are two syntaxes to choose from - async + await, or .then
// seeing who is logged in. If '', then that means no-one (there's a minimum length to the username, so '' is of course ok to interepret as 'no-one logged in')
let data1 = await apiServices.getAll('/api/sessionuser') // session['user'] is only set as non-'' when a user is logged in. I had set it as '' in other cases in app.py for route /api/sessionuser.
const user = data1.session_user
console.log(`user: "${user}"`)

let data2 = await apiServices.getAll('/api/sessioncsrf') // session['user'] is only set as non-'' when a user is logged in. I had set it as '' in other cases in app.py for route /api/sessionuser.
const csrfToken = data2.csrf_token
// console.log(`csrfToken: "${csrfToken}"`) // let's not show this to actual users

let data3 = await apiServices.getAll('/api/map-token') // session['user'] is only set as non-'' when a user is logged in. I had set it as '' in other cases in app.py for route /api/sessionuser.
const mapToken = data3.map_token
// console.log(`mapToken: "${mapToken}"`) // let's not show this either

let map;
async function initMap(apiServices, starRating) {

  // Kumpula general location; for centering the map around
  const kumpula_pos = { lat:60.20929799893519, lng:24.94988675516233 };
  
  // Request needed Google libraries. These are from the google Cloud instruction pages
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const { PlacesService } = await google.maps.importLibrary('places')     // this is for getting exact locations, since based on only address (and google Geocoder API), many diners would get placed into the wrong end of a larger building, AND they would be placed on top of each other

  // The map itself, centered at Kumpula region. The restaurants from SQL db are set below
  map = new Map(document.getElementById("map"), { // note: in 'map.jinja', there's a div element 'map' where this whole google Map object will be inserted!
    zoom: 15,
    center: kumpula_pos,
    mapId: "DEMO_MAP_ID",
  });

  const response = await fetch('/api/restaurants')  // accessing 'restaurants' (sql db table) directly here in 'index.js'.
  const data = await response.json()                // "data" is the common way of naming response.json()...
  const json_of_locations = data                    // ... but just renaming for clarity c: this is the json with id:x, name:string, address:string that I made in app.py c:
  const service = new PlacesService(map)

  // const geocoder = new Geocoder();               // this is not what I wanna use anymore, since based on address-based location alone this results in too rough lng and lat for the diners, and stacks different diners on top of each other (=in the same lng and lat) if multiple are located within the same building! Not great c:

  for (const location of json_of_locations) {       // for each location (=restaurant!) in the json object, add the location name and address to the map. For adding to map, the address needs to be converted to lat and lng, and Google's Geocoder is used for that
    const request = {
      query: `${location.name} ${location.address}`,  // Template strings of JS e.g., `${js_variable_name} some text`. I'm querying based on both the name and the location (from SQL db), of course. It's the only sensible minimum requirement to get the exact location of the exact diner that I'm 'looking for' based on the search. This ` ${name} ${address}` just means; name + " " + address, in case you're not familiar with JS. It's called 'template strings' in JS.
      fields: ['name', 'geometry', 'formatted_address', 'place_id', 'icon', 'icon_background_color']        // NB! place_id is needed for service.getDetails below, which is needed to get the opening hours (yeah...). A quite assenine system but that's how it works; so first you need to do this "findPlaceFromQuery", and THEN using the place_id obtained from that, ALSO do the service.getDetails after that. The 'name' and 'geometry.location' are needed also below; if you take 'name' out from here, you will get nothing for title:place.name below, which causes the problem that when you hover your mouse over the marker on the map, you won't see anything there (i.e., title doesn't exist then!). If you take 'geometry' out from here, you'll get an error as it tries to read undefined.location instead of geometry.location below -> no markers on the map. ref: (https://developers.google.com/maps/documentation/places/web-service/details)
    } // 'icon' is for getting image url (for getting png picture)

    const restaurant_id_from_db = location.id


    // QUERY to the Places API
    service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) { // if status is OK AND results exist (i.e., not null or undefined or whatever, which also would be interpreted as FALSE)
        const place = results[0];

        const detailRequest = {
          placeId: place.place_id,
          fields: ['name', 'geometry', 'opening_hours', 'utc_offset_minutes', // NB! The .isOpen() below needs 'utc_offset_minutes' here! In English: checking if a given establishment is open at current time works only when 'utc_offset_minutes' is listed here
            'types']
        } // 'types' = "An array of types for this place (e.g., ["restaurant", "lodging"]). This array may contain multiple values, or may be empty. New values may be introduced without prior notice. See the list of supported types." (https://developers.google.com/maps/documentation/javascript/places)

        service.getDetails(detailRequest, async (placeDetails, detailStatus) => {
          if (detailStatus === google.maps.places.PlacesServiceStatus.OK) {

            // this container element is needed so I can place the label  for the marker right below the marker itself regardless of the label size. Also, for the search box; since I wanna hide both the marker and the label, using this single container per marker+label, I can hide/show both at the same time
            const markerContainer = document.createElement('div')     // normal JS, creating a new HTML element
            markerContainer.style.display = 'flex'
            markerContainer.style.flexDirection = 'column'
            markerContainer.style.alignItems = 'center'
            markerContainer.id = 'marker-container'                   // for the search box above the map; these markers are what I want to show / hide based on the search query
            
            // creating the markerElement and making it pretty (more in 'style.css')
            const markerElement = document.createElement('div');            
            markerElement.className = 'custom-marker';
            markerElement.style.backgroundColor = '#FCD12A';
            markerElement.style.backgroundImage = `url(${place.icon})`;
            markerElement.style.backgroundSize = 'contain';
            markerElement.style.width = '26px';
            markerElement.style.height = '26px';
            // console.log("place.icon:", place.icon)                 // the URL for the icon png image

            // let's filter out those descriptions that say 'point_of_interest' (every damn place..), or 'establishment' (every goddamn place..). Btw. .filter() produces an array from an array, i.e., a '[item1, item2...]'
            const categoriesFromDb = await apiServices.getAll(`/api/get-categories/${restaurant_id_from_db}`)
            let sensible_descriptions = placeDetails.types.filter(description => !['point_of_interest','establishment'].includes(description)) 
            const descriptionsLower = sensible_descriptions.map(d => d.toLowerCase()) // copy for testing
            categoriesFromDb.forEach(categoryJSON => {
              if (!descriptionsLower.includes(categoryJSON.category.toLowerCase())) {
                sensible_descriptions.push(categoryJSON.category)
              }
            })
            let descriptionsHTML = sensible_descriptions.map(description => `<li>${safeHTML(description)}</li>`).join('') // .join('') converts the array (from map(), which also produces an array) into a string

            // text label element for the marker above
            const labelElement = document.createElement('span');
            labelElement.textContent = placeDetails.name;             // (1) a label for the marker; otherwise you wouldn't see the name of the place by default. (2) Also, the search-by-name in 'map.jinja' uses this!
            labelElement.descriptions = sensible_descriptions         // I'M ADDING THIS CUSTOM ATTRIBUTE HERE for the search function 'map-search-descriptions' in 'map.jinja'. Because I'm already using the above 'labelElement.textContent' for the search that's based on the place name, it's most convenient to do this -> I can use the same logic in the search that's based on descriptions c:
            labelElement.style.marginTop = '5px';                     // position of the text relative to the marker; let's put it BELOW the marker itself            
            labelElement.style.backgroundColor = 'white';             // a background color to the label
            labelElement.style.padding = '2px 5px';                   // some padding to the label
            labelElement.style.borderRadius = '3px';                  // round the corners of the label
            labelElement.style.boxShadow = '0 0 3px rgba(0,0,0,0.3)'; 
            labelElement.id = 'label-element'

            // put the marker and its label in the markerContainer
            markerContainer.appendChild(markerElement)
            markerContainer.appendChild(labelElement)
            
            // setting markers; choose the map 'map', position, and set the title that will be shown when you hover over the marker
            const diner_marker = new AdvancedMarkerElement({
              map: map,
              position: placeDetails.geometry.location,
              title: placeDetails.name,
              content: markerContainer
            }); 
            // ^^ it's not possible to set an id normally for the AdvancedMarkerElement like for normal HTML elements

            const openingHours = placeDetails.opening_hours?.weekday_text || [];  // example: 'undefined || x' returns x (normal JS), so 'placeDetails... || []' will return [] if the left side is undefined. This is to always get an array [] even if the left side is undefined. The ?. ('optional chaining' in JS) returns undefined if the property before .? is undefined AND cuts the code there, not even trying to handle the stuff on the right side to the ? (i.e. not causing an error), as long as placeDetails itself exists (it always does). This is to prevent the error 'cannot read properties of undefined' in case .opening_hours doesn't exist, as not all places have listed opening hours.
            const openingHoursHTML = openingHours.map(hours_for_the_day => `<li>${hours_for_the_day}</li>`).join(''); // join each member of the array [`<li>hours1</li>`, `<li>hours2</li>`...] for each day as a string, to be evetually used as a whole array of <li> HTML elements; this array of <li>hours_x</li>'s is placed inside an <ul> to create an array of opening hours per each weekday for each restaurant c:
            const openNow = placeDetails.opening_hours?.isOpen();                 // returns 'true' or 'false' depending on what time it is. NB! The .isOpen() needs the 'utc_offset_minutes' that was set previously, above in the array 'fields'! isOpen() won't work without it!
            let openNowMsg = '';
            openNow 
              ? openNowMsg = '<p style=position:relative;color:green;>OPEN</p>'   // if openNow, this row, with green text
              : openNowMsg = '<p style=color:red;position:relative>CLOSED</p>';   // if not openNow, this row, with red text

            // the API for comments and ratings per location-in-question. This is provided by the '/api/ratings/<int:restaurant_id>' in app.py
            const restaurant_id = location.id // this is the SQL db 'restaurant_id'
            
            // address, comment, comment_id (from comments), created_at (from comments), rating, restaurant_id, restaurant_name. I have the restaurant name etc. just to see that I have the correct fields, that the SQL query works, etc
            const ratings_for_restaurant = await apiServices.getAll(`/api/ratings/${restaurant_id}`)

            // console.log("ratings_for_restaurant:",ratings_for_restaurant) 
            
            const filtered_ratings_for_restaurant = ratings_for_restaurant.filter(item => item.rating_visible)
            const rating_average = filtered_ratings_for_restaurant.reduce((sum, current) => current.rating + sum, 0)/filtered_ratings_for_restaurant.length
            let starRatingHTML
            
            filtered_ratings_for_restaurant.length !== 0
              ? starRatingHTML = starRating(rating_average)
              : starRatingHTML = ''
            let commentHTML
            if (filtered_ratings_for_restaurant.length !== 0) {
              commentHTML = `
                  <ul id="comment-HTML">` + 
                    ratings_for_restaurant.map(item => {
                      if (item.comment_visible || item.rating_visible) {
                          return `<li>
                              <p>
                                  ${item.comment_visible ? `"${safeHTML(item.comment)}"<br>`: ''} 
                                  ${item.rating_visible ? `${item.rating}/5 <br>` : ''}
                                  (by username "${safeHTML(item.username)}", ${item.created_at.match(/\d+ \w{3} \d{4}/g)})
                              </p>
                          </li>`
                      } else {
                          return ''
                      }
                    }).join('') + 
                  '</ul>'
            } else {
                commentHTML = '<p>no comments yet</p>'
            }    
            // 'comment_visible' refers to table comments, for which every comment is by default 'visible:TRUE', UNLESS the admin has made it invisible

            const feedbackHTML = `
            <div>
              <p>Feedback:</p>
              <textarea id='feedback-text' placeholder='feedback c:'></textarea>
              <p>Rate by clicking on the stars:</p>
              <div class="rating-posting-section-stars">
                ${starRating(0) /** this is the star rating (1-5) to be clicked by the user. 'onclick's for each of these 'rating-posting-section-stars' will be set onClick of the infoWindow further below c: */}
              </div>
              <button id='send-rating'>Submit</button>
            </div>
            `
            const signInUltimatumHTML = `
            <div>
              <p>Want to share your experience? Sign in provide feedback!</p>
              <a href='/'> login </a>
            </div>
              `
            const feedbackSentHTML = `
            <div>
              <p> Feedback sent! </p>
              <a href='/'> home </a>
            </div>
              `

            // THIS BELOW IS THE ACTUAL CONTENT OF EACH RESTAURANT'S INFOWINDOW. This is kinda like a poor man's React (FullStack Open -course teaches the proper way of doing these using React and Node)
            // NB! There's not much user-originated HTML left to sanitize below, HOWEVER - placeDetails.name could be whatever. What if the name of the place has ' or < in it, for example? As for the others, 'placeDetails.x' are all derived from Google API, and commentHTML was checked already c:
              const infoWindowContent =
            ` 
            <div id="info-window-content"> 
                <h1 id="firstHeading" class="firstHeading">${safeHTML(placeDetails.name)}</h1> <!-- NOTE! This is the OFFICIAL name. 'location.name', on the other hand, would be whatever is saved in the database table 'restaurants'. Notably, admin can add new places to that table, so it's best to use the official name instead!-->
                ${starRatingHTML}
                <div id="bodyContent">
                  <p><b>${safeHTML(place.formatted_address)}</b></p>
                  <div>${openNowMsg}</div>
                  <ul>${openingHoursHTML}</ul>
                  <h2>¿🍔/🍹/☕? </h2>
                  <ul id='descriptions-html'>${descriptionsHTML}</ul>
                  <h2>comments</h2>
                  <p>
                    ${filtered_ratings_for_restaurant.length} review${filtered_ratings_for_restaurant.length === 1 ? '' : 's'}
                    ${filtered_ratings_for_restaurant.length !== 0 ? `<br>average: ${Math.round(rating_average*100)/100}/5` : ''} <br>
                    ${starRatingHTML}
                  </p>
                  ${commentHTML                                                                                 /** HTML-sanitized previously with safeHTML() regarding user-derived comments, so no XSS-risk or risk of site breaking exists anymore c: */}
                  <h2> feedback </h2>
                  ${user !== 'admin'
                    ? `<div id='feedback-section' style=display:inline-block>${user !== '' ? feedbackHTML : signInUltimatumHTML   /** if the user is signed in, and NOT 'admin', show the feedbackHTML, otherwise sell the idea of signing in to them like your life depends on it. This is known as great customer service or something?*/}</div>`                  
                    : ` <p> As 'admin', you cannot provide feedback; 'admin' is not in the table 'users', so... please try again as another user! </p>   <!-- if 'admin' is logged in, don't make it possible to send feedback -->
                        <a href='/logout'>to logout</a>`
                  }
                  
                  <div id='feedback-sent' style=display:none;color:green>${feedbackSentHTML /** display:inline-block after feedback has been sent successfully c: */}</div>  
            </div>
            `;
            // btw, you have to use the `-marks here! (called 'template string') It's only possible to use the ${variable} thing when using this in JavaScript c:
            // I have a lot of unnecessary divs as for now at leeast; they came originally from the assenine google manual template. Maybe I'll actually use the divs for making this look prettier, maybe not, we'll see. I'm not a fan of eternal CSS suffering.

            // BEFORE ANYTHING ELSE, let's first also update the sql database restaurant name and address based on the ACCURATE info that was just fetched from Places API above. Why? Because in the admin page of this site, the admin can add ROUGH names and addresses to the db, based on which the query to Places API was initially made above. However, these might be inaccurate names and addresses, and now we have the perfect chance to update that info. Thanks to this, it's also possible to get accurate info easier in the restaurant list below the map. Also, I'm adding API-fetched descriptions to the list of restaurant_categories
            // LET'S DO THIS ONLY IF ADMIN IS LOGGED IN. This conserves db traffic and prevents unnecessary update-need-checks in app.py
            if (user === 'admin') {
              const body = {
                'restaurant_id': restaurant_id_from_db,
                'restaurant_name': placeDetails.name,
                'address': place.formatted_address,
                'descriptions':sensible_descriptions
              }
              
              try {
                const response = await apiServices.post('/api/update-name-address-categories', body, mapToken)
                const data = await response.json();
            
                if (response.ok) {
                  let updatedOrNot
                  data.updated === ''
                    ?  updatedOrNot = `Database for "${placeDetails.name}" was already up to date: no name, address or category updates were done in db.`
                    :  updatedOrNot = `UPDATED database for "${placeDetails.name}" successfully as follows:`
                  console.log(updatedOrNot, data);
                } else {
                  console.error('Update failed:', data);
                }
              } catch (error) {
                console.error('Error:', error);
              }
            }

            const infowindow = new google.maps.InfoWindow({
              content: infoWindowContent,
              ariaLabel: location.name,
            });

            // ADD EVENT LISTENER so that when the user clicks on the marker on the map, all the wanted info (infowindow) is shown
            diner_marker.addListener('click', () => {
              infowindow.open({
                anchor: diner_marker,
                map,
              });

              let rating = null;

              if (user !== '' && user !== 'admin') {  // if an actual user is logged in, then take care of the comment + rating section logic (clicking on stars, )
                setTimeout(() => { // NB! the setTimeout() is needed; it causes this section of the code to wait for the above diner_marker to render fully, i.e. makes the code synchronous regarding these two, enforcing order of execution. Without this setTimeout, adding eventListeners to the rating stars below in the infoWindow doesn't work - I tried, for many hours, and this was the solution that chatGPT suggested (and I confirmed by googling it's true)
                
                  document.querySelectorAll('.rating-posting-section-stars .fa-star').forEach(star => { // this looks for .rating-posting-section-stars, then inside that, for .fa-star (class fa-star inside class rating-posting-section-stars)
                    star.addEventListener('click', (event) => {
                      rating = event.currentTarget.dataset.value; // the 'dataset' is an object that contains all 'data-[insert_name_here]' things, that is, custom attributes, as I explain in the starRating.js file
                      // event.currentTarget.classList.toggle('checked')
                      
                      // when a star in a 5-star line is clicked in the rating section (event 'click' above), then for EACH star in those 5 stars (code below):
                      document.querySelectorAll('.rating-posting-section-stars .fa-star').forEach(star => {
                        if (star.dataset.value <= rating) {
                          star.classList.add('checked')     // e.g. if we're looking at star#2 ('<=', i.e. less or equal value) and the rating was 3, then ensure that star#2 is checked if it wasn't already (=yellow, not empty). This has to be checked as we don't know how many times the user is gonna change their mind or reclick before submitting the review!'.classList.add' is ok even if the class 'checked' is already present in the classList; 
                        } else {
                          star.classList.remove('checked')  // e.g. if we're looking at star#4 and the rating was 3, then make sure star#4 is not yellow, i.e. make sure that the class 'checked' is not in star#4's classList
                        }
                      })

                      console.log(`User rated: ${rating} stars`);
                    });
                  });

                  // UPON SENDING THE FEEDBACK (comment) AND/OR RATING (stars) by pressing the button with id 'send-rating'
                  document.querySelector('#send-rating').addEventListener('click', async event => {
                    event.preventDefault() // we don't want to reload the whole page after sending the feedback
                    const comment = document.querySelector('#feedback-text').value;
                    if (comment === '' || rating === null) {
                      alert("please provide feedback text and a rating before submitting")
                    } else {
                      const restaurant_name = location.name
                      const body = {
                        restaurant_id,
                        restaurant_name,
                        comment}
                      if(rating) {
                        body.rating = rating  // if a rating exists (is not null), then include that in the body
                      } else {
                        //pass
                      }
                      document.querySelector('#feedback-section').style.display='none'
                      document.querySelector('#feedback-sent').style.display='inline-block'
                      document.querySelector('#feedback-text').value='' // reset the text field. It's hidden anyway, thus doesn't really matter 
                      
                      try {
                        const response = await apiServices.post('/api/feedback/', body, csrfToken)
                        const data = await response.json()
                        console.log({data})
                        const addedComment = usersFeedback(body.comment, rating)
                        document.querySelector('#comment-HTML').appendChild(addedComment) // returns HTML with "<comment id="new-comment">". Here, below, I'm inserting as .textContent the new comment. This is safe, see below comment:
                      } catch (error) {
                        console.error(error)
                      }    
                  }
                  })
                },0) // yes, the ' 0 ms ' timeout does work; it enforces this code block to wait for the rendering of the infoWindow first. I tried taking setTimeout away, and it breaks the star rating system c:
              }
            });
          } else {        // if getDetails doesn't succeed
            console.error("getDetails was not successful for the following reason: " + detailStatus);
          };
        });
      } else {            // if findPlaceFromQuery doesn't succeed
        console.error("findPlaceFromQuery was not successful for the following reason: " + status); // this is printed in browser
      }
    });
  }; // 'for const location of json_of_locations' ends here!
};

initMap(apiServices, starRating);
