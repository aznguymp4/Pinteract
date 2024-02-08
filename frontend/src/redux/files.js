import { csrfFetch } from "./csrf";
import axios from 'axios'

export const uploadFile = (file, setProgressFunc) => new Promise((res,rej) => {
  setProgressFunc(0)
  csrfFetch(`/api/cdn/sign/${file.name}`)
  .then(r=>r.json())
  .then(({ signedUrl, fileUrl })=>{
    axios.put(signedUrl, file, {onUploadProgress: e => setProgressFunc((e.loaded/e.total)*.95)})
    .then(()=>{
      res(fileUrl)
    })
    .catch(rej)
  })
  .catch(rej)
})