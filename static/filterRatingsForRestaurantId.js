import apiServices from './apiServices.js'

const filterRatingsForRestaurant = async (restaurant_id) => {
    
    const ratings_for_restaurant = await apiServices.getAll(`/api/ratings/${restaurant_id}`)
    const filtered_ratings_for_restaurant = ratings_for_restaurant.filter(item => item.rating_visible)
    return filtered_ratings_for_restaurant
}

export default filterRatingsForRestaurant