// Initialize and add the map
let map;

async function initMap() {

  // Kumpula random location
  const kumpula_pos = { lat:60.20929799893519, lng:24.94988675516233 };
  
  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const { PlacesService } = await google.maps.importLibrary('places')     // this is better for getting exact locations, since based on only address, many diners get placed into the wrong end of a larger building, and on top of each other, etc.
  // const { Geocoder } = await google.maps.importLibrary('geocoding')    // not optimal here; this is for converting between lng, lat, and addresses; I have enabled this in my Google Clouds API so it works. However, since I used this for converting addresses to lng, lat, it can only guess the exact location within a building - very misleading in case of larger buildings!

  // The map itself, centered at Kumpula region with a few nearby restaurants
  map = new Map(document.getElementById("map"), {
    zoom: 15,
    center: kumpula_pos,
    mapId: "DEMO_MAP_ID",
  });
  

  const response = await fetch('/api/restaurants')  // holy shit this is next level. Btw, if you're unfamiliar with JS: since this function 'initMap' is async, you have to use "await" for all asynchronic operations. If the function wasn't "asyc", you'd use fetch('address').then(blah blah) instead of 'await'. So there are two syntaxes to choose from: async + await, or .then
  const data = await response.json()                // since this is the standard way, I'm writing "data"
  const json_of_locations = data                    // just renaming for clarity c: this is the json with id:x, name:string, address:string that I made in app.py c:
  const service = new PlacesService(map)

  // const geocoder = new Geocoder();               // this is not what I wanna use anymore, since based on address-based location alone this results in too rough lng and lat for the diners, and stacks different diners on top of each other (=in the same lng and lat) if multiple are located within the same building! Not great c:

  for (const location of json_of_locations) {       // for each location in the json object, add the location name and address to the map. For adding to map, the address needs to be converted to lat and lng, and Google's Geocoder is used for that
    const request = {
      query: `${location.name} ${location.address}`,  // Template strings of JS. I'm querying based on both the name and the location, of course. It's the only sensible minimum requirement to get the exact location of the exact diner that I'm 'looking for' based on the search. This ` ${name} ${address}` just means; name + " " + address, in case you're not familiar with JS. It's called 'template strings' in JS.
      fields: ['name', 'geometry', 'place_id', 'icon', 'icon_background_color']        // place_id is needed for service.getDetails below, which is needed to get the opening hours (yeah...). A quite assenine system but that's how it works; so first you need to do this "findPlaceFromQuery", and THEN using the place_id obtained from that, ALSO do the service.getDetails after that. The 'name' and 'geometry.location' are needed also below; if you take 'name' out from here, you will get nothing for title:place.name below, which causes that when you hover your mouse over the marker on the map, you won't see anything there (i.e., title doesn't exist then!). If you take 'geometry' out from here, you'll get an error as it tries to read undefined.location instead of geometry.location below -> no markers on the map.
    } // 'icon' is for getting image url (for getting png picture)

    service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) { // if status is OK AND results exist (i.e., not null or undefined or whatever, which also would be interpreted as FALSE)
        const place = results[0];

        const detailRequest = {
          placeId: place.place_id,
          fields: ['name', 'geometry', 'opening_hours', 'utc_offset_minutes', // NB! The .isOpen() below needs 'utc_offset_minutes' here! In English: checking if a given establishment is open at current time works only when 'utc_offset_minutes' is listed here
            'types'] 
        } // 'types' = "An array of types for this place (e.g., ["restaurant", "lodging"]). This array may contain multiple values, or may be empty. New values may be introduced without prior notice. See the list of supported types." (https://developers.google.com/maps/documentation/javascript/places)

        service.getDetails(detailRequest, (placeDetails, detailStatus) => {
          if (detailStatus === google.maps.places.PlacesServiceStatus.OK) {
            
            // console.log("place.icon:", place.icon)                       // the URL for the icon png, used below
            console.log("place")
            const markerElement = document.createElement('div');            // this is normal JS, creating a new element
            markerElement.className = 'custom-marker';
            markerElement.style.backgroundColor = '#FFBF00';
            markerElement.style.backgroundImage = `url(${place.icon})`;
            markerElement.style.backgroundSize = 'contain';
            markerElement.style.width = '26px';
            markerElement.style.height = '26px';
            
            
            // setting markers; choose the map 'map', position, and set the title that will be shown when you hover over the marker
            const diner_marker = new AdvancedMarkerElement({
              map: map,
              position: placeDetails.geometry.location,
              title: placeDetails.name,
              content: markerElement
            });
            const openingHours = placeDetails.opening_hours?.weekday_text || []; // example: 'undefined || 1' returns 1, so 'placeDetails... || []' will return [] if the left side is undefined. This is to always get an array [] even if the left side is undefined. The ?. returns undefined if the property before .? is undefined AND cuts the code there, not even trying to handle the stuff on the right side (i.e. not causing an error), as long as placeDetails itself exists (it always does). This is to prevent the error 'cannot read properties of undefined' in case .opening_hours doesn't exist. The .? is called optional chaining in JS
            let openingHoursHTML = openingHours.map(hours_for_the_day => `<li>${hours_for_the_day}</li>`).join(''); // join each member of the array [`<li>hours1</li>`, `<li>hours2</li>`...] for each day as a string, to be evetually used as a whole array of <li> HTML elements; this array of <li>hours_x</li>'s is placed inside an <ul> to create an array of opening hours per each weekday for each restaurant c:
            const openNow = placeDetails.opening_hours?.isOpen();   // returns 'true' or 'false' depending on what time it is. NB! The .isOpen() needs the 'utc_offset_minutes' that was set previously, above in the array 'fields'! isOpen() won't work otherwise!
            const sensible_descriptions = placeDetails.types.filter(description => !['point_of_interest','establishment'].includes(description)) // let's filter out those descriptions that say 'point_of_interest' (every goddamn place), or 'establishment' (every goddamn place..)
            let descriptionsHTML = sensible_descriptions.map(description => `<li>${description}</li>`).join('')
            let openNowMsg = ''
            openNow ? openNowMsg = '<p style=position:relative;color:green;>OPEN</p>' : openNowMsg = '<p style=color:red;position:relative>CLOSED</p>' // if openNow === True, the return html saying OPEN with green text. Otherwise CLOSED with red text. Awesum.
            
            const contentString =
            ` 
            <div id="content"> 
              <div id="siteNotice">
                </div>
                <h1 id="firstHeading" class="firstHeading">${location.name}</h1> 
                <div id="bodyContent">
                  <p><b>${location.address}</b></p>
                  <div>${openNowMsg}</div>
                  <ul>${openingHoursHTML}</ul>
                  <h2>descriptive terms</h2>
                  <ul>${descriptionsHTML}
                </div> 
            </div>
            `;
            // btw, you have to use the `-marks here! It's only possible to use the ${variable} thing when using this in JavaScript c:
            // I have a lot of unnecessary divs as for now at leeast; they came originally from the assenine google manual template. Maybe I'll actually use the divs for making this look prettier, maybe not, we'll see. I'm not a fan of eternal CSS suffering.

            const infowindow = new google.maps.InfoWindow({
              content: contentString,
              ariaLabel: location.name,
            });

            diner_marker.addListener('click', () => { // so that when you click on the diner_marker, you'll see the infowindow
              infowindow.open({
                anchor: diner_marker,
                map,
              })
            })
          } else {        // if getDetails doesn't succeed:
            console.error("getDetails was not successful for the following reason: " + detailStatus);
          };
        });

      } else {            // if findPlaceFromQuery doesn't succeed:
        console.error("findPlaceFromQuery was not successful for the following reason: " + status); // this is printed in browser
      }
    });
  };
};

initMap();