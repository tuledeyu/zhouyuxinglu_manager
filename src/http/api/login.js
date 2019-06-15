import Server from '../server'

class Login extends Server {
    async loginPwd(params = {}) {
        try {
            let result = await this.axios('post', `/loginPwd`, params)

            if (result && (result.data instanceof Object) && result.code === 200) {
                return result.data;
            } else {
                let err = {
                    tip: '获取记录数据失败',
                    response: result,
                    data: params,
                    url: 'https://api.cangdu.org/shopro/data/record',
                }
                throw err
            }
        } catch (err) {
            throw err
        }
    }

    async getInfo(params = {}) {
        try {
            let result = await this.axios('get', `https://www.easy-mock.com/mock/5c7c93cc869f506acc185023/example/getInfo`)

            if (result && (result.data instanceof Object) && result.code === 200) {
                return result.data;
            } else {
                let err = {
                    tip: '获取记录数据失败',
                    response: result,
                    data: params,
                    url: 'https://api.cangdu.org/shopro/data/record',
                }
                throw err
            }
        } catch (err) {
            throw err
        }
    }
}

export default new Login()