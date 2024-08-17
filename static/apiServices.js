// a standard GET.
const getAll = async url => {
    const response = await fetch(url) 
    const data = await response.json()
    return data
}

const post = async (url, body, csrf_token) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'X-CSRF-Token':csrf_token,
            }, 
            //credentials:'same-origin', // This defaults to 'same-origin' anyways! "A string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL. Sets request's credentials." So, with this, it only sends the csrf in the case of same origin, not otherwise.
            body:JSON.stringify(body)
        })
        const data = await response.json()
        return [response, data]
    } catch(error) {
        console.error(error)
    }
}

const put = async (url, csrf_token) => {
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type':'application/json',
                'X-CSRF-Token':csrf_token,
            },
        })
        const data = await response.json()
        return [response, data]
    } catch(error) {
        console.error(error)
    }
}

const remove = async (url, csrf_token) => {
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'X-CSRF-Token':csrf_token,
            }, 
        })
        const data = await response.json()
        return data
    } catch(error) {
        console.error(error)
    }
}

const toggleVisibilityOf = (id, target, token, baseUrl) => {
    console.log(`toggle visibility for the following target: table '${target}', id ${id}`)
    put(`${baseUrl}/api/toggle-visibility-of/${target}/${id}`, token)
    .then(data => {
        console.log("data after updating id:", data)
        window.location.reload()        // I'm refreshing the page with my superpowers! An alternative would be to manually add the new information as a new HTML element... and then also add aaaall the buttons and whatnot to that according to the situation, but that would be too much work here, require a lotta functions etc. This is not React (unfortunately)
    })
}

const addVisibilityTogglerListener = (elementQuery, token, baseUrl) => { 
    document.querySelectorAll(elementQuery).forEach(button => {
        button.addEventListener('click', event => {
            toggleVisibilityOf(button.dataset.id, button.dataset.target, token, baseUrl)
        })
    })
}
export default { getAll, post, put, remove, addVisibilityTogglerListener } // exports a single JSON like this (like a Python map!), so each function is usable as 'x.get' and 'x.post' in the destination after you import this JSON as 'x'. Taught in FullStack course.