// Initialize and add the map
let map;

async function initMap() {

  // Kumpula random location
  const kumpula_pos = { lat:60.20929799893519, lng:24.94988675516233 };
  
  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const { Geocoder } = await google.maps.importLibrary('geocoding') // this is for converting between lng, lat, and addresses; I have enabled this in my Google Clouds API, should work?

  // The map, centered at Kumpula region with a few nearby restaurants
  map = new Map(document.getElementById("map"), {
    zoom: 15,
    center: kumpula_pos,
    mapId: "DEMO_MAP_ID",
  });

  // setting markers; choose the map 'map', position, and set the title that will be shown when you hover over the marker
  const marker = new AdvancedMarkerElement({
    map: map,
    position: kumpula_pos, // just an example. The actual function of the kumpula_pos is centering the map initially around the Kumpula region.
    title: "Kumpula thingy",
  });

  const response = await fetch('/api/restaurants')  // holy shit this is next level. Btw, if you're unfamiliar with JS: since this function 'initMap' is async, you have to use "await" for all asynchronic operations. If the function wasn't "asyc", you'd use fetch('address').then(blah blah) instead of 'await'. So there are two syntaxes to choose from: async + await, or .then
  const data = await response.json()                // since this is the standard way, I'm writing "data"
  const json_of_locations = data                    // just renaming for clarity c: this is the json with id:x, name:string, address:string that I made in app.py c:

  const geocoder = new Geocoder();
  for (const location of json_of_locations) {       // for each location in the json object, add the location name and address to the map. For adding to map, the address needs to be converted to lat and lng, and Google's Geocoder is used for that
    geocoder.geocode({ address: location.address }, (results, status) => {
      if (status === "OK") {
        const diner_marker = new AdvancedMarkerElement({
          map: map,
          position: results[0].geometry.location,
          title: "Käpylän Grilli",
        });

        const contentString =
        ` 
        <div id="content"> 
          <div id="siteNotice">
            </div>
            <h1 id="firstHeading" class="firstHeading">${location.name}</h1> 
            <div id="bodyContent">
              <p><b>${location.address}</b></p>
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
      } else {
        console.error("Geocode was not successful for the following reason: " + status); // this is printed in browser
      }
    });
  };
};

initMap();