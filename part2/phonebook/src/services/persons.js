import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const remove = object => {
    const request = axios.delete(`${baseUrl}/${object.id}`) 
    return request
}

const update = object => {
    console.log(object, object.id)
    return axios.put(`${baseUrl}/${object.id}`, object)
}


export default {getAll, create, remove, update}