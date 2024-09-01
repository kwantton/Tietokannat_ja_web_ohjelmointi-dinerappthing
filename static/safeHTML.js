// USE THIS ONLY FOR HTML! Never for text, unless you want to see a bunch of &quot; &quot; or something else on your site
const safeHTML = (str) => {
    return str.replace(/[&<>"']/g, replaceMe => { // thanks to g, it's global regexp -> it replaces ALL occurrences of &,<,>,",' with the listed results below.
        const escape = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return escape[replaceMe]
    })
}
// example: 
// 'safeHTML('<script>alert("morjens! :D")</script>')
// returns: "&lt;script&gt;alert(&quot;morjens! :D&quot;)&lt;/script&gt;" 
// which will be SHOWN as '<script>alert("morjens! :D")</script>' if HTML, BUT not being interpreted as actual <script> in the HTML - thus safe!
export default safeHTML