// Initialize and add the map
let map;

async function initMap() {

  // Kumpula somewhere
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

  const geocoder = new Geocoder();
  geocoder.geocode({ address: "Osmontie 5 00610 Helsinki" }, (results, status) => {
    if (status === "OK") {
      const ravintola_kapygrilli = new AdvancedMarkerElement({
        map: map,
        position: results[0].geometry.location,
        title: "Käpylän Grilli",
      });

      const contentString =
      '<div id="content">' +
      '<div id="siteNotice">' +
      "</div>" +
      '<h1 id="firstHeading" class="firstHeading">Ravintola käpygrilli</h1>' +
      '<div id="bodyContent">' +
      "<p><b>Ravintola Käpygrilli</b>"
      "</div>" +
      "</div>";

      const infowindow = new google.maps.InfoWindow({
        content: contentString,
        ariaLabel: "Käpygrilli",
      });

      ravintola_kapygrilli.addListener('click', () => {
        infowindow.open({
          anchor: marker,
          map,
        })
      })
    } else {
      console.error("Geocode was not successful for the following reason: " + status); // this is printed in browser
    }
  });

}

initMap();