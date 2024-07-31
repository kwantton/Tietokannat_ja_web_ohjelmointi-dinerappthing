// I would've just used .textContent for everything directly, but I don't think there's any way of creating line breaks (newlines) in that! Sucks...
import safeHTML from "./safeHTML.js"
const usersFeedback = (rating) => {
    const p = document.createElement('p')
    const innerHTML = `
    <li>
        <p>
            <new-comment id="new-comment"></new-comment> <br>
            ${rating ? `${rating}/5` : ''} <br>
            (by you, a few moments ago) <br>
            <button></button>
        </p>
    </li>
    `
    p.innerHTML = innerHTML
    return p // I'm returning a <p> element so that it can be .appendChilded to #comment-HTML in 'index.js' (the 'child' has to be a node, either a HTML element or a textnode, that's why)
    
}
// why I'm not putting comment content here: you can't use .innerHTML for everything, because in that, writing <script>evilStuffHere</script> by the user is possible. That's why in index.js, I'm adding the actual comment as .textContent - that's safe
// alternative: createElement('li'), createTextNode etc, etc, but that's ugly and unifnormative (I did it before this and got rid of it)

export default usersFeedback