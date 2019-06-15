import Server from '../server'

class User extends Server {

    async getUserById(id) {
        try {
            let result = await this.axios('GET', `/getUserById?id=${id}`)
            if (result instanceof Object && result.code === 200) {
                return result
            } else {
                let err = {
                    tip: '查询人员ID失败',
                    response: result,
                    data: {
                        id
                    },
                    url: `https://localhost/getUserById?id=${id}`,
                }
                throw err
            }
        } catch (err) {
            throw err
        }
    }

    async setUserById(params = {}) {
        try {
            let result = await this.axios('POST', `/setUserById`, params)
            if (result instanceof Object && result.code === 200) {
                return result
            } else {
                let err = {
                    tip: '批量设置人员状态失败',
                    response: result,
                    data: params,
                    url: `https://localhost/setUserById?id=${id}`,
                }
                throw err
            }
        } catch (err) {
            throw err
        }
    }

    async getUser(params = {}) {
        try {
            let result = await this.axios('POST', `/getUser`, params)
            if (result instanceof Object && result.code === 200) {
                return result
            } else {
                let err = {
                    tip: '获取分页人员数据失败',
                    response: result,
                    data: params,
                    url: 'https://localhost/getUser',
                }
                throw err
            }
        } catch (err) {
            throw err
        }
    }

    async addUser(params) {
        try {

            let result = await this.axios('POST', `/addUser`, params)
            if (result instanceof Object && result.code === 200) {
                return result
            } else {
                let err = {
                    tip: '新建人员数据失败',
                    response: result,
                    data: params,
                    url: 'https://localhost/addUser',
                }
                throw err
            }
        } catch (err) {
            throw err
        }
    }

    async updateUser(params = {}) {
        try {

            let result = await this.axios('PUT', `/updateUser`, params)

            if (result instanceof Object && result.code === 200) {
                return result
            } else {
                let err = {
                    tip: '删除人员数据失败',
                    response: result,
                    data: params,
                    url: 'https://localhost/updateUser',
                }
                throw err
            }
        } catch (err) {
            throw err
        }
    }

    async batchUser(params = {}) {
        try {

            let result = await this.axios('PUT', `/batchUser`, params)

            if (result instanceof Object && result.code === 200) {
                return result
            } else {
                let err = {
                    tip: '批量编辑人员数据失败',
                    response: result,
                    data: params,
                    url: 'https://localhost/batchUser',
                }
                throw err
            }
        } catch (err) {
            throw err
        }
    }


    async setUserRole(params = {}) {
        try {

            let result = await this.axios('post', `/setUserRole`, params)

            if (result instanceof Object && result.code === 200) {
                return result
            } else {
                let err = {
                    tip: '批量设置用户角色',
                    response: result,
                    data: params,
                    url: 'https://localhost/setUserRole',
                }
                throw err
            }
        } catch (err) {
            throw err
        }
    }
}

export default new User()