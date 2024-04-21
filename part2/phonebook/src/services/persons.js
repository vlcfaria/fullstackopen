import axios from 'axios'

const baseUrl = '/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request
}

const remove = object => {
    const request = axios.delete(`${baseUrl}/${object.id}`) 
    return request
}

const update = object => {
    return axios.put(`${baseUrl}/${object.id}`, object)
}


export default {getAll, create, remove, update}