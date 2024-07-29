const getAll = async url => {
    const response = await fetch(url) // a basic GET
    const data = await response.json()
    return data
}

const post = async (url, body) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        }, 
        body:JSON.stringify(body)
    })
    return response
}

export default { getAll, post } // export a JSON object (like a Python map), so each function is usable as 'x.get' and 'x.post' in the destination after you import this JSON as 'x'