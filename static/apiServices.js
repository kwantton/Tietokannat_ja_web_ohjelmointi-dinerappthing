const getAll = async url => {
    let response = await fetch(url) // a basic GET
    let data = await response.json()
    return data
}
export default { getAll } // export a JSON object (like a Python map), so each function is usable as for example 'service.get' etc