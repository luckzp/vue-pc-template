import { message } from 'ant-design-vue'
import axios from 'axios'
import type { AxiosPromise, Method } from 'axios'
import qs from 'qs'
// import router from '@/router';

let baseURLlocal = 'http://localhost:8182'

axios.defaults.withCredentials = true
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

axios.interceptors.request.use(
  (config) => {
    const token = 'dce349a86b7c4e059480612ae9c221'
    if (token) {
      Object.assign(config.headers, {
        apiKey: token
      })
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

axios.interceptors.response.use(
  (res) => {
    // token无效时退出登录
    if (res?.data?.code === '401') {
      console.log('token无效，退出登录')
    }
    return res.data
  },
  (error) => {
    // if (error.response && error.response.headers.location) {
    // 	window.location.href = error.response.headers.location;
    // }
    if (error.response?.status === 500) {
      message.error('服务端接口报错')
    }
    if (error.code === 'ERR_CANCELED') {
      return { code: '6003' } //取消的请求 不报错的处理
    } else {
      return Promise.reject(error)
    }
  }
)

// 函数重载，根据cancelFlag判断是否返回request和controller
function requestFn(
  url: string,
  params: object | undefined,
  method: string,
  data?: object | undefined,
  cancelFlag?: false
): AxiosPromise<any>
function requestFn(
  url: string,
  params: object | undefined,
  method: string,
  data: object | undefined,
  cancelFlag: true
): {
  request: AxiosPromise<any>
  controller: AbortController
}
function requestFn(
  url: string,
  params = {},
  method: string,
  data = {},
  cancelFlag: boolean | undefined,
  timeout = 180000,
  baseURL = baseURLlocal
) {
  const realMethod = method.split('_')[0] as Method
  const controller = new AbortController()
  const request = axios({
    url,
    method: realMethod,
    // `baseURL ` 将自动加在url前面，除非url是一个绝对url,
    // 它可以通过设置一个 baseURL 便于为 axios实例的方法传递相对URL
    baseURL,

    // // `transformRequest` 允许在向服务器发送前，修改请求数据
    // // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
    // // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
    transformRequest: [
      function (data) {
        // 可对data进行任意转换
        // console.log(data,'transformRequest')
        // console.log(data, "qs.stringify(data)");
        if (method === 'POST' || method === 'POST_DOWNLOAD_FORM') {
          return qs.stringify(data)
        } else if (method === 'POST_FILE') {
          return data
        } else {
          return JSON.stringify(data)
        }

        // return JSON.stringify(data);
      }
    ],
    headers: getHeader(method),
    params,
    // // data 是作为请求主体被发送的数据
    // // 只适用于这些请求方法 PUT POST PATCH
    // // 在没有设置 transformRequest 时，必须是以下类型之一： string plan object, ArrayBuffer , ArrayBufferView , URLSearchParams
    // // 浏览器专属  ： FormData , File , Blob;
    // // Node 专属： Stream
    data,
    timeout,
    // // 服务器响应的数据类型， 可以是‘arraybuffer','blob', 'documnet','json','text','stream'
    responseType: getResponseType(method), // default
    // responseEncoding: 'utf8', // default
    signal: controller.signal
  })

  if (cancelFlag) return { request, controller }
  return request
}

function getHeader(method: string) {
  switch (method) {
    case 'POST':
      return {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    case 'POST_FILE':
      return {
        'Content-Type': 'multipart/form-data'
      }
    default:
      return {
        'Content-Type': 'application/json'
      }
  }
}

export function getResponseType(method?: string) {
  switch (method) {
    case 'POST_DOWNLOAD':
      return 'blob'
    default:
      return 'json'
  }
}

export default requestFn
