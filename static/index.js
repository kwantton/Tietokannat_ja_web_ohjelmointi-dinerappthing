import safeHTML from "./safeHTML.js"
import starRating from "./starRating.js"
import createHTML from "./createHTML.js"
import apiServices from "./apiServices.js" // import the whole JSON as 'apiServices' -> e.g. a basic fetch GET is now usable as 'apiServices.get(url)'
import updateRestaurantInfo from "./updateRestaurantInfo.js"
import createMarkerContainer from "./createMarkerContainer.js"
import createInfoWindowContent from "./createInfoWindowContent.js"
import createStarRatingListener from "./createStarRatingListener.js"
import createFeedbackSendingListener from "./createFeedbackSendingListener.js"

// session['user'] is set as non-'' only if a user is logged in. It is '' if no-one is logged in, in '../api/indexjs.py' for route '/api/sessionuser'.
let tempData = await apiServices.getAll('/api/sessionuser') 
const user = tempData.session_user

// csrf token
tempData = await apiServices.getAll('/api/sessioncsrf')
const csrfToken = tempData.csrf_token

// map csrf_token; I'm making sure the map page requests originate from the very same page and nowhere else.
tempData = await apiServices.getAll('/api/map-token')
const mapToken = tempData.map_token

// initialize the map. Why 'morjens'? Because at the end of the page, I'm exporting 'map'. This 'morjens' was for testing.
let map = 'morjens'

// lngLatJSON shall have all the longtitudes and latitudes: {restaurant_id : {lng, lat}}, and this will be exported for use in 'map.jinja'. Why const? Because it's properties (each key-value pair) can be set later even though it's a 'constant'. Effectively, 'const' here is saying, 'this variable should always remain a JSON'
const lngLatJSON = {}

async function initMap() {
  // since this function 'initMap' is async, I have to use "await" for all asynchronic operations like 'fetch'. If the function wasn't "asyc", you'd use 'fetch(address_here).then(blah blah).then(blah blah)' instead of 'const response = await fetch(address_here); const data = ...'. So there are two syntaxes to choose from - async + await, or .then

  // Kumpula general location; for centering the map around
  const kumpula_pos = { lat:60.20929799893519, lng:24.94988675516233 }
  
  // requests for the needed Google libraries. These are from the google Cloud instruction pages
  //@ts-ignore
  const { Map } = await google.maps.importLibrary('maps') // don't take the {} out or you'll get "Map is not a constructor". Google shenanigans.
  const { AdvancedMarkerElement } = await google.maps.importLibrary('marker')
  const { PlacesService } = await google.maps.importLibrary('places')     // this is for getting exact locations, since based on only address (and google Geocoder API), many diners would get placed into the wrong end of a larger building, AND they would be placed on top of each other

  // The map itself, centered at Kumpula region. The restaurants from SQL db are set below
  map = new Map(document.getElementById('map'), {     // NB! in 'map.jinja', there's a div element 'map' where this whole google Map object will be inserted!
    zoom: 15,
    center: kumpula_pos,
    mapId: 'DINER_MAP_1',
  })

  const json_of_locations = await apiServices.getAll('/api/restaurants-visible')    // accessing 'restaurants' (sql db table) directly here in 'index.js'. // this is the json with id:x, name:string, address:string that I made in app.py
  const service = new PlacesService(map)

  let openInfoWindow                                  // a placeholder. Why: (1) for each marker on the map, an infoWindow is created. (2) then an event listener "onClick" for each is created. Upon clicking and infowindow open, I first infowindow.close() the open one. If I didn't do this, the document.querySelectors that are supposed to be targeting the NEW opened infoWindow would be targeting the FIRST one instead, if they are located higher in the HTML 'document' object - this depends on the order in which the markers were originally created. Why let, not const? Because this changes every time a new infowindow is opened.
  let eventListenedInfoWindows = []                   // every clicked infoWindow will be listed here. Why: (1) I need to keep track of which infoWindows already have onClick event listener, otherwise on every click of the associated custom marker (map location marker) I would add another, then yet another event listener, which would cause problems (I had problems, that's why I added this - now it's working c:)
  
  json_of_locations.forEach(location => {             // for each location (=restaurant!) in the json object, add the location name and address to the map, and a million other things more below. For adding to map, the address needs to be converted to lat and lng, and the Places API is used for that, as well as getting the place icon, opening hours, etc etc...
    const request = {
      query: `${location.name} ${location.address}`,  // Template strings of JS e.g., `${js_variable_name} some text`. I'm querying based on both the name and the location (from SQL db), of course. It's the only sensible minimum requirement to get the exact location of the exact diner that I'm 'looking for' based on the search. This ` ${name} ${address}` just means; name + " " + address, in case you're not familiar with JS. It's called 'template strings' in JS.
      fields: ['name', 'geometry', 'formatted_address', 'place_id', 'icon', 'icon_background_color']        // NB! place_id is needed for service.getDetails below, which is needed to get the opening hours (yeah...). A quite assenine system but that's how it works; so first you need to do this "findPlaceFromQuery", and THEN using the place_id obtained from that, ALSO do the service.getDetails after that. The 'name' and 'geometry.location' are needed also below; if you take 'name' out from here, you will get nothing for title:place.name below, which causes the problem that when you hover your mouse over the marker on the map, you won't see anything there (i.e., title doesn't exist then!). If you take 'geometry' out from here, you'll get an error as it tries to read undefined.location instead of geometry.location below -> no markers on the map. ref: (https://developers.google.com/maps/documentation/places/web-service/details)
    } // 'icon' is for getting image url (for getting png picture)

    const restaurantID = location.id

    // QUERY to the Places API. "For example, name or address of a place" - I'm using both, see 'request' above.                                                Source: (https://developers.google.com/maps/documentation/javascript/reference/places-service)
    service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) { // if status is OK AND results exist (i.e., not null or undefined or whatever, which also would be interpreted as FALSE)
        const place = results[0]

        const detailRequest = {
          placeId: place.place_id,
          fields: ['name', 'geometry', 'opening_hours', 'utc_offset_minutes', // NB! The .isOpen() below needs 'utc_offset_minutes' here! In English: checking if a given establishment is open at current time works only when 'utc_offset_minutes' is listed here
            'types']
        } // 'types' = "An array of types for this place (e.g., ["restaurant", "lodging"]). This array may contain multiple values, or may be empty. New values may be introduced without prior notice. See the list of supported types." (https://developers.google.com/maps/documentation/javascript/places)

        service.getDetails(detailRequest, async (placeDetails, detailStatus) => {
          if (detailStatus === google.maps.places.PlacesServiceStatus.OK) {

            // let's filter out those descriptions that say 'point_of_interest' (every damn place..), or 'establishment' (every goddamn place..). Btw. .filter() produces an array from an array, i.e., a '[item1, item2...]'
            const categoriesFromDb = await apiServices.getAll(`/api/get-categories/${restaurantID}`)
            let sensibleDescriptions = placeDetails.types.filter(description => !['point_of_interest','establishment'].includes(description)) // used in labelElement that's created below
            const descriptionsLower = sensibleDescriptions.map(d => d.toLowerCase())
            categoriesFromDb.forEach(categoryJSON => {
              if (!descriptionsLower.includes(categoryJSON.category.toLowerCase())) {
                sensibleDescriptions.push(categoryJSON.category)
              }
            })

            let descriptionsHTML = sensibleDescriptions.map(description => `<li>${safeHTML(description)}</li>`).join('') // .join('') converts the array (from map(), which also produces an array) into a string
            
            // this container element is needed so I can place the label for the marker right below the marker itself regardless of the label size. Also, for the search box; since I wanna hide both the marker and the label, using this single container per marker+label, I can hide/show both at the same time. See See 'style.css'.
            const markerContainer = createMarkerContainer(place, placeDetails, sensibleDescriptions)
            
            // setting markers; choose the map 'map', position, and set the title that will be shown when you hover over the marker
            const diner_marker = new AdvancedMarkerElement({
              map: map,
              position: placeDetails.geometry.location,
              title: placeDetails.name,
              content: markerContainer
            }) 
            lngLatJSON[restaurantID] = { lat : placeDetails.geometry.location.lat(), lng: placeDetails.geometry.location.lng() }
            // ^^ it's not possible to set an id normally for the AdvancedMarkerElement like for normal HTML elements.

            const openingHours = placeDetails.opening_hours?.weekday_text || []   // example: 'undefined || x' returns x (normal JS), so 'placeDetails... || []' will return [] if the left side is undefined. This is to always get an array [] even if the left side is undefined. The ?. ('optional chaining' in JS) returns undefined if the property before .? is undefined AND cuts the code there, not even trying to handle the stuff on the right side to the ? (i.e. not causing an error), as long as placeDetails itself exists (it always does). This is to prevent the error 'cannot read properties of undefined' in case .opening_hours doesn't exist, as not all places have listed opening hours.
            const openingHoursHTML = openingHours.map(hours_for_the_day => `<li>${hours_for_the_day}</li>`).join('') // join each member of the array [`<li>hours1</li>`, `<li>hours2</li>`...] for each day as a string, to be evetually used as a whole array of <li> HTML elements; this array of <li>hours_x</li>'s is placed inside an <ul> to create an array of opening hours per each weekday for each restaurant c:
            const openNow = placeDetails.opening_hours?.isOpen()                  // returns 'true' or 'false' depending on what time it is. NB! The .isOpen() needs the 'utc_offset_minutes' that was set previously, above in the array 'fields'! isOpen() won't work without it!
            let openNowMsg = ''
            openNow 
              ? openNowMsg = '<p style=position:relative;color:green;>OPEN</p>'   // if openNow, this row, with green text
              : openNowMsg = '<p style=color:red;position:relative>CLOSED</p>'    // if not openNow, this row, with red text
            
            // address, comment, comment_id (from comments), created_at (from comments), rating, restaurant_id, restaurant_name. I have the restaurant name etc. just to see that I have the correct fields, that the SQL query works, etc
            const ratings_for_restaurant = await apiServices.getAll(`/api/ratings/${restaurantID}?only_visible_ratings=0`)
            const filtered_ratings_for_restaurant = ratings_for_restaurant.filter(item => item.rating_visible)
            const filtered_comments_for_restaurant = ratings_for_restaurant.filter(item => item.comment_visible) // for the table 'comments', it's just 'visible', not comment_visible
            const rating_average = filtered_ratings_for_restaurant.reduce((sum, current) => current.rating + sum, 0)/filtered_ratings_for_restaurant.length
            let starRatingHTML
            
            // if the rating_average is 3, for example, then 3/5 stars are colored orange. See 'starRating' and 'style.css'
            filtered_ratings_for_restaurant.length !== 0
              ? starRatingHTML = starRating(rating_average)
              : starRatingHTML = ''
            
            // createHTML.js
            const commentHTML = createHTML.commentHTML(restaurantID, filtered_ratings_for_restaurant, filtered_comments_for_restaurant, ratings_for_restaurant)
            const feedbackHTML = createHTML.feedbackHTML(restaurantID)
            const feedbackSentHTML = createHTML.feedbackSentHTML()
            const signInUltimatumHTML = createHTML.signInUltimatumHTML()
            
            let noCommentsYetHTML = ''
            if(filtered_comments_for_restaurant.length == 0) {noCommentsYetHTML = `<p id='no-comments-HTML-${restaurantID}'>no comments yet</p>`}

            // THE ACTUAL CONTENT OF EACH RESTAURANT'S INFOWINDOW. See '..static/createInfoWindowContent.js'
            const infoWindowContent = createInfoWindowContent(place, restaurantID, placeDetails, starRatingHTML, openNowMsg, 
              openingHoursHTML, descriptionsHTML, rating_average, filtered_ratings_for_restaurant, noCommentsYetHTML, commentHTML, 
              user, feedbackHTML, signInUltimatumHTML, feedbackSentHTML)

            // let's also update the sql database restaurant name and address based on the ACCURATE info that was just fetched from Places API above. Why? Because in the admin page of this site, the admin can add ROUGH names and addresses to the db, based on which the query to Places API was initially made above. However, these might be inaccurate names and addresses, and now we have the perfect chance to update that info. Thanks to this, it's also possible to get accurate info easier in the restaurant list below the map. Also, I'm adding API-fetched descriptions to the list of restaurant_categories. Only if admin is logged in.
            if (user === 'admin') {
              await updateRestaurantInfo(restaurantID, placeDetails, place, sensibleDescriptions, mapToken) // uses 'apiServices.post', hence 'await' is needed here 
            }

            const infowindow = new google.maps.InfoWindow({
              content: infoWindowContent,
              ariaLabel: location.name,
            })

            // ADD EVENT LISTENER so that when the user clicks on the marker on the map, all the wanted info (infowindow) is shown
            diner_marker.addListener('click', () => { // apparently the old version, 'addListener', is mandatory here. I tried changing it to 'addEventListener' -> the whole shit broke down. Lol.
              // max 1 infowindow open at a time - less mess (in the map). Comment out if you want to have multiple open at the same time. This was originally my emergency solution to solve the querySelector ambiquity, which was ultimately caused by me not naming the 'feedback-text's and 'send-rating's according to restaurant-id, but now that I've named the id's uniquely (as should always be done in JS), that problem should no longer exist - hence, no need to have this max-1-limit any longer c:
              openInfoWindow?.close()                                               // ?. is called optional chaining; if the thing on the left of ?. is nullish, the right side won't be executed; instead, undefined will be returned.
              openInfoWindow = infowindow                                           // now that the (new) infoWindow has been clicked open after closing the previous one, make the current, opened infoWindow the just-now-opened openInfoWindow.
              infowindow.open({
                anchor: diner_marker,
                map,
              })

              if(!eventListenedInfoWindows.includes(infowindow)) {                  // NB! If you don't do this, it will add a million listeners. Then, because of the alert box that says "please provide feedback text and a rating before submitting", it will alert you x times if you've clicked on the diner_marker x times! This was annoying as hell! So, if the user is clicking again the same window, then DON'T add copies of the same eventListener! (and don't do any other of these below, as they would be unnecessary!)
                eventListenedInfoWindows.push(infowindow)                           // let's not add a million eventlisteners for the same window

                if (user !== '' && user !== 'admin') {                              // if an actual user is logged in, then take care of the comment + rating section logic (clicking on stars, )
                  setTimeout(() => {                                                // NB! the setTimeout() is needed; it causes this section of the code to wait for the above diner_marker to render fully, i.e. makes the code synchronous regarding these two, enforcing order of execution. Without this setTimeout, adding eventListeners to the rating stars below in the infoWindow doesn't work - I tried, for many hours, and this was the solution that chatGPT suggested (and I confirmed by googling it's true)
                    createStarRatingListener(restaurantID)                          // creates a onClick listener for each rating section star, coloring them orange if rated, removing color if rating is lower, etc. 
                    createFeedbackSendingListener(restaurantID, location, csrfToken)
                    .then(/* placeholder */)                                        // this function 'createFeedbackSendingListener' is asynchronous, but I'm not inside an 'async' function, so I can't use 'await' here -> '.then' is needed instead IF I do something after this function. A reminder - I'm currently not doing anything after the function, but in case I will be, I'm leaving 'then()' as a reminder
                  },0)                                                              // yes, this '0' ms timeout is needed! It enforces that this code block waits for the 'infowindow.open' above (i.e. rendering of the infoWindow) first. I tried taking the setTimeout away, and it immediately breaks the star rating system! c: How I even came up with this timeOut: ChatGPT. With JS, ChatGPT often teaches you things you weren't even aware of. Highly recommended if you get stuck.
                }
              }
            })
          } else {        // if getDetails doesn't succeed
            console.error("getDetails was not successful for the following reason: " + detailStatus)
          }
        })
      } else {            // if findPlaceFromQuery doesn't succeed
        console.error("findPlaceFromQuery was not successful for the following reason: " + status) // this is printed in browser
      }
    })
  })                      // 'json_of_locations.forEach' ends here!
}

await initMap()           // initMap() is 'async', so it returns a promise; we need to resolve that promise (=> in effect, do ALL the stuff inside initMap()) before exporting 'map' and 'lngLatJSON' because initMap() modifies the variables 'map' and 'lngLatJSON' which I'm exporting below. If you don't await for initMap(), the the below exported 'map' will have value 'morjens' instead of the actual map that I want to export because 'map' was initialized as 'morjens' at the top of this 'index.js' (let map = 'morjens' was done at ~row 24)
export default { map, lngLatJSON };
// solution #2 would be; export initMap() without awaiting first, then in the receiving side ('map.jinja') resolve it THERE instead c: (so, exporting a Promise instead of the resolved product)