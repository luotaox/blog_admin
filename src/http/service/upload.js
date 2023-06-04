import axios from "axios"

function upload(path, userForm) {
  let params = new FormData();
  for (let i in userForm) {
    params.append(i, userForm[i]);
  }
  return axios.post(path, params, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export default upload