
import axios from 'axios'

import { MessageBox } from 'element-ui';

const host = "http://39.105.98.245:8002" 
// const host = "http://192.168.2.102:8002" 
const base_url = host

// const base_url = process.env.ADMIN_SERVER

let myHead = () => {
    return axios.create({
        baseURL: base_url
    });
}
// axios.defaults.withCredentials=true

export default {
  base_url,host,
 
  get_: (url) => {
    return  new Promise((resolve,reject)=>{
      myHead().get(url).then(res=>{
        resolve(res);
      },res =>{   
        reject(res)
      })
    })
  },
  post_: (url,body,formdata) => {
    return new Promise((resolve,reject)=> {
      // application/x-www-form-urlencoded
      let headers=formdata?{headers: {'Content-Type': 'multipart/form-data'}}:''
      myHead().post(url, body,headers).then(res => {
        resolve(res.data)
      },res =>{
         reject(res)
      })
    })
  },
  post1_: (url,body,formdata) => {
    return new Promise((resolve,reject)=> {
      // application/x-www-form-urlencoded
      let headers=formdata?{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}:''
      myHead().post(url,qs.stringify(body),headers).then(res => {
        resolve(res.data)
      },res =>{

         reject(res)
      })
    })
  },
  put_: (url,body) => {
    return new Promise((resolve,reject)=> {
      myHead().put(url, body).then(res => {
        resolve(res.data); 
      },res =>{
        reject(res);
      });
    })
  },
  del_: (url,body) => {
    return new Promise((resolve,reject)=> {
      myHead().delete(url,body).then(res => {
        resolve(res.data); 
      },res =>{
        reject(res);
      });
    })
  }


}
