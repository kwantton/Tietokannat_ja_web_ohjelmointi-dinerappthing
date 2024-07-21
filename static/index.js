// Initialize and add the map
let map;

async function initMap() {

  // Kumpula random location
  const kumpula_pos = { lat:60.20929799893519, lng:24.94988675516233 };
  
  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const { Geocoder } = await google.maps.importLibrary('geocoding')   // not accurate in my case; this is for converting between lng, lat, and addresses; I have enabled this in my Google Clouds API so it works. However, since I used this for converting addresses to lng, lat, it can only guess the exact location within a building - very misleading in case of larger buildings!
  const { PlacesService } = await google.maps.importLibrary('places') // this is better for getting exact locations, since based on only address, many diners get placed into the wrong end of a larger building, and on top of each other, etc.

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
  const service = new PlacesService(map)

  // const geocoder = new Geocoder();               // this is not what I wanna use anymore, since based on address-based location alone this results in too rough lng and lat for the diners, and stacks different diners on top of each other (=in the same lng and lat) if multiple are located within the same building! Not great c:

  for (const location of json_of_locations) {       // for each location in the json object, add the location name and address to the map. For adding to map, the address needs to be converted to lat and lng, and Google's Geocoder is used for that

    const request = {
      query: `${location.name} ${location.address}`,  // I'm querying based on both the name and the location, of course. It's the only sensible minimum requirement to get the exact location of the exact diner that I'm 'looking for'
      fields: ['name', 'geometry']
    }

    service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) { // if status OK AND results exist (i.e., not null or undefined or whatever)
        const place = results[0];
        const diner_marker = new AdvancedMarkerElement({
          map: map,
          position: place.geometry.location,
          title: place.name,
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
        console.error("findPlaceFromQuery was not successful for the following reason: " + status); // this is printed in browser
      }
    });
  };
};

initMap();