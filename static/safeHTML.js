// USE THIS ONLY FOR HTML! Never for text, unless you want to see a bunch of &quot; &quot; or something else on your site c:
const safeHTML = (str) => {
    return str.replace(/[&<>"']/g, match => { // thanks to g, it's global regexp -> it replaces ALL occurrences of &,<,>,",' with the listed results below.
        const escape = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return escape[match];
    });
}
// example: 
// 'safeHTML('<script>alert("morjens! :D")</script>')'
// returns: "&lt;script&gt;alert(&quot;morjens! :D&quot;)&lt;/script&gt;" 
// which will be shown on page as '<script>alert("morjens! :D")</script>' BUT not being actual <script> in the HTML - thus safe!
export default safeHTML