import $axios from './interceptor'

/**
 * 主要params参数
 * @params method {string} 方法名
 * @params url {string} 请求地址  例如：/login 配合baseURL组成完整请求地址
 * @params baseURL {string} 请求地址统一前缀 ***需要提前指定***  例如：http://cangdu.org
 * @params params {object}  get方式传参key值
 * @params headers {string} 指定请求头信息
 * @params withCredentials {boolean} 请求是否携带本地cookies信息默认开启
 * @params onUploadProgress {function} 允许为上传处理进度事件
 * @params onDownloadProgress {function} 允许为下载处理进度事件
 * @params validateStatus {func} 默认判断请求成功的范围 200 - 300
 * @return {Promise}
 * 其他更多拓展参看axios文档后 自行拓展
 * 注意：params中的数据会覆盖method url 参数，所以如果指定了这2个参数则不需要在params中带入
 */

export default class Server {
    axios(method, url, data) {
        return new Promise((resolve, reject) => {
            if (typeof data !== 'object') data = {}
            let _option = {
                method,
                url,
                params: null,
                data,
                // headers: null,
                withCredentials: true, //是否携带cookies发起请求
                onUploadProgress: null,
                onDownloadProgress: null,
                validateStatus: (status) => {
                    return status >= 200 && status < 500
                },

            }

            $axios.request(_option).then(res => {

                resolve(res)
            }, error => {
                if (error.response) {
                    reject(error.response.data)
                } else {
                    reject(error)
                }
            })
        })
    }
}