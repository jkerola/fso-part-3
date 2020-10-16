import Axios from 'axios'
const url = `/api/persons`

const getContacts = () => {
  return Axios.get(url).then(response => response.data)
}
const createContact = personObject => {
  return Axios.post(url, personObject).then(response => response.data)
}
const removeContact = id => {
  return Axios.delete(`${url}/${id}`).then(response => response.data)
}
const updateContact = (id, personObject) => {
  return Axios.put(`${url}/${id}`, personObject).then(response => response.data)
}
export default {
  getContacts,
  createContact,
  removeContact,
  updateContact
}