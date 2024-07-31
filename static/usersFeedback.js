// I would've just used .textContent for everything directly, but I don't think there's any way of creating line breaks (newlines) in that! Sucks...
import safeHTML from "./safeHTML.js"
const usersFeedback = (comment, rating) => {
    const p = document.createElement('p')
    const innerHTML = `
    <li>
        <p>
            ${safeHTML(comment)}<br>
            ${rating ? `${rating}/5` : ''} <br>
            (by you, a few moments ago) <br>
        </p>
    </li>
    `
    p.innerHTML = innerHTML // has to be HTML since there are <li>, <p>, <br>, AND the comment returned from safeHTML() function; if the returned HTML comment was text instead of HTML, none of the &lt;, &gt; etc would be shown correctly, they would be shown as-is if not interpreted as HTML!
    return p // I'm returning a <p> element so that it can be .appendChilded to #comment-HTML in 'index.js' (the 'child' has to be a node, either a HTML element or a textnode, that's why)
}
// why I'm not putting comment content here: you can't use .innerHTML for everything, because in that, writing <script>evilStuffHere</script> by the user is possible. That's why in index.js, I'm adding the actual comment as .textContent - that's safe
// alternative: createElement('li'), createTextNode etc, etc, but that's ugly and unifnormative (I did it before this and got rid of it)

export default usersFeedback