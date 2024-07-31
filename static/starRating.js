// if it has more than 0.5/5 stars on average, the first star is shown, and so on
// for each, I'm adding a custom 'data-value' ('custom attributes'; everything prefixed by 'data-' is collected in the 'dataset' object which can then be accessed. I had forgotten about this, thanks ChatGPT for reminding me c:) based on which I can also use this for the rating system; that is, if the user clicks the 1st start, it reads data value 1, if 4th star, then 4th star, etc
const starRatingHTML = rating_average =>  `
            <span class="fa fa-star${rating_average >= 0.5 ? ' checked' : ''}" data-value='1'></span> <!-- 'checked' (orange; filled!) if rating is more than 0.5, otherwise grey star c: -->
            <span class="fa fa-star${rating_average >= 1.5 ? ' checked' : ''}" data-value='2'></span>
            <span class="fa fa-star${rating_average >= 2.5 ? ' checked' : ''}" data-value='3'></span>
            <span class="fa fa-star${rating_average >= 3.5 ? ' checked' : ''}" data-value='4'></span>
            <span class="fa fa-star${rating_average >= 4.5 ? ' checked' : ''}" data-value='5'></span>
            `
export default starRatingHTML