'use strict'

// TODO: Could use fetch, but fetch is overexplicit. Rather use a wrapper for
// fetch.
function makeRequest(url, params) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response)
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText,
        })
      }
    }
    xhr.onerror = function() {
      reject({
        status: this.status,
        statusText: xhr.statusText,
      })
    }
    xhr.send(params)
  })
}

// API calls might still work without this
const _x_id = () => // eslint-disable-line camelcase
  `${window.boot_data.version_uid.substring(0, 8)}-${new Date().getTime() / 1000}`

// TODO: Could also be a lib
const queryString = obj => {
  const str = []
  for (const p in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, p)) {
      str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`)
    }
  }
  return str.join('&')
}

const api = async (endpoint, params) => {
  const token = window.boot_data.api_token
  const qs = queryString({ ...params, token })
  const url = `https://${window.location.host}/api/${endpoint}?_x_id=${_x_id()}`
  return JSON.parse(await makeRequest(url, qs))
}

module.exports = api
