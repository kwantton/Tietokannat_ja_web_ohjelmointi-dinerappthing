import apiServices from "./apiServices.js"

export default async function(restaurantID, placeDetails, place, sensibleDescriptions, mapToken){
    const body = {
        'restaurant_id': restaurantID,
        'restaurant_name': placeDetails.name,
        'address': place.formatted_address,
        'descriptions':sensibleDescriptions
    }

    const [response, data] = await apiServices.post('/api/update-name-address-categories', body, mapToken) // array destructuring

    if (response.ok) {
        let updatedOrNot
        data.updated === ''
            ?  updatedOrNot = `Database for "${placeDetails.name}" was already up to date: no name, address or category updates were done in db.`
            :  updatedOrNot = `UPDATED database for "${placeDetails.name}" successfully as follows:`
        console.log(updatedOrNot, data)
    } else {
        console.error(`Update for ${placeDetails.name} failed:`, data)
    }
}