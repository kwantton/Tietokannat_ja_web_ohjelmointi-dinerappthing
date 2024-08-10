const getAll = async url => {
    const response = await fetch(url) // a basic GET
    const data = await response.json()
    return data
}

const post = async (url, body, csrf_token) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
            'X-CSRF-Token':csrf_token,
        }, 
        credentials:'same-origin', // "A string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL. Sets request's credentials." So, with this, it only sends the csrf in the case of same origin, not otherwise.
        body:JSON.stringify(body)
    })
    return response
}

export default { getAll, post } // export a single JSON object (like a Python map), so each function is usable as 'x.get' and 'x.post' in the destination after you import this JSON as 'x'. Taught in FullStack course.