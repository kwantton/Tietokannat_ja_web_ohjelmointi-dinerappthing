/* CREATION OF THE marker-container:
 * marker-container         [parent node]
 *      marker-element      [child 1]
 *      label-element       [child 2]
 * */
// this container element is needed so I can place the label (place name!) for the map location marker right below the marker itself regardless of the label length. Also, for the search box; since I want to hide both the marker and the label if a name is not found in search, using this single container per marker+label, I can hide/show both at the same time. See See 'style.css' and 'map.jinja' for the search function operation. Btw: regarding the css, I initially just asked ChatGPT, then tried stuff on my own.

export default function createMarkerContainer (place, placeDetails, sensible_descriptions) {
    const markerContainer = document.createElement('div')     // normal JS, creating a new HTML element
    markerContainer.className = 'marker-container'            // for the search box above the map; these markers are what I want to show / hide based on the search query

    // creating the markerElement and making it pretty (more in 'style.css')
    const markerElement = document.createElement('div')            
    markerElement.className = 'custom-marker'
    markerElement.style.backgroundImage = `url(${place.icon})`
    // console.log("place.icon:", place.icon)                 // the URL for the icon png image

    // text label element for the marker above. See 'style.css'
    const labelElement = document.createElement('span')
    labelElement.textContent = placeDetails.name              // (1) a label for the marker; otherwise you wouldn't see the name of the place by default. (2) Also, the search-by-name in 'map.jinja' uses this!
    labelElement.descriptions = sensible_descriptions         // I'M ADDING THIS CUSTOM ATTRIBUTE HERE for the search function 'map-search-descriptions' in 'map.jinja'. Because I'm already using the above 'labelElement.textContent' for the search that's based on the place name, it's most convenient to do this -> I can use the same logic in the search that's based on descriptions c:
    labelElement.className = 'label-element'

    // put the marker and its label in the markerContainer
    markerContainer.appendChild(markerElement)
    markerContainer.appendChild(labelElement)
    
    return markerContainer
}