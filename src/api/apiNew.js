/**
 * Created by JianBo.Wang on 2017/7/12.
 */
import axios from 'axios'
import tool from '@/util/message'
import qs from 'qs'

axios.defaults.timeout = 60000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.baseURL = ''   // 测试服

// const downloadUrl = (headers, data) => {
//   let filename = headers['content-disposition'].match(/filename="?([^"]*)/)[1]
//   filename = decodeURI(filename)
//   const blob = new Blob([data], {type: 'application/vnd.ms-excel'})
//   if ('msSaveBlob' in navigator) {
//     navigator.msSaveBlob(blob, filename)// edge
//   } else {
//     const a = document.createElement('a')
//     const url = window.URL.createObjectURL(blob)
//     a.href = url
//     a.download = filename
//     document.body.appendChild(a)// firefox
//     a.click()
//     document.body.removeChild(a)
//     window.URL.revokeObjectURL(url)
//   }
// }
// const downloadUrl = url => {
//   let elemIF = document.createElement('iframe')
//   elemIF.src = url
//   elemIF.style.display = 'none'
//   elemIF.onload = function () {
//     document.body.removeChild(elemIF)
//   }
//   document.body.appendChild(elemIF)
// }
// const downloadUrl = url => {
//   let a = document.createElement('a')
//   a.style.display = 'none'
//   a.href = url
//   a.onload = function () {
//     document.body.removeChild(a)
//   }
//   document.body.appendChild(a)
//   a.click()
// }

// POST传参序列化
axios.interceptors.request.use((config) => {
  return config
}, (error) => {
  tool.message({
    type: 'error',
    msg: '错误的传参'
  })
  return Promise.reject(error)
})

// 返回状态判断
axios.interceptors.response.use((res) => {
  if (res.data.code === 'user-not-login') {
    tool.message({
      type: 'error',
      msg: '用户未登陆'
    })
    let hrefOrign = res.data.data
    let hrefPart1 = hrefOrign.split('&redirectUrl=')[0]
    let hrefRedirect = hrefPart1 + '&redirectUrl=' + window.location.href
    window.location.href = hrefRedirect
    return Promise.reject(res)
  }
  if (/success$/.test(res.data.code)) {
    return res
  }
  if (/warning$/.test(res.data.code)) {
    tool.message({
      type: 'warning',
      msg: res.data.message
    })
    return Promise.reject(res)
  }
  if (/info$/.test(res.data.code)) {
    tool.message({
      type: 'info',
      msg: res.data.message
    })
    return Promise.reject(res)
  }
  // if (res.headers['content-type'] === 'application/vnd.ms-excel;charset=UTF-8' || res.headers['content-type'] === 'application/octet-stream;charset=UTF-8') {
  //   downloadUrl(res.headers, res.data)
  //   return res
  // }
  tool.message({
    type: 'error',
    msg: res.data.message
  })
  return Promise.reject(res)
}, (error) => {
  tool.message({
    type: 'error',
    msg: error.message
  })
  return Promise.reject(error)
})

export function fetchPost (url, params) {
  params = qs.stringify(params)
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function fetchGet (url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url + '?time=' + new Date().getTime(), {
      params: params
    })
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function fetchFormData (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function fetchApplicationJson (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params, {headers: {'Content-Type': 'application/json'}})
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function fetchDelete (url, params) {
  return new Promise((resolve, reject) => {
    axios.delete(url, {
      params: params
    })
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function fetchPut (url, params) {
  params = qs.stringify(params)
  return new Promise((resolve, reject) => {
    axios.put(url, params)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function fetchGetDownload (url, params, fileName) {
  return new Promise((resolve, reject) => {
    axios.get((url + '?time=' + Date.now()), {
      params: params,
      responseType: 'blob'
    })
    .then(response => {
      const content = response.data
      const blob = new Blob([content])
      if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName)
      }
      resolve(response.data)
    }, err => {
      reject(err)
    })
    .catch((error) => {
      reject(error)
    })
  })
}

export function fetchGetExport (url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {params: params}, {responseType: 'arraybuffer'})
      .then(response => {
        response.data = ''
        response.headers['content-type'] = 'text/json'
        resolve(response.data)
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function fetchPostExport (url, params) {
  params = qs.stringify(params)
  return new Promise((resolve, reject) => {
    axios.post(url, params, {responseType: 'arraybuffer'})
      .then(response => {
        response.data = ''
        response.headers['content-type'] = 'text/json'
        resolve(response.data)
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
