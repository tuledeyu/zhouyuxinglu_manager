import Server from '../server'

class Group extends Server {

    async getGroupById(id) {
        try {
            let result = await this.axios('GET', `/getGroupById?id=${id}`)
            if (result instanceof Object && result.code === 200) {
                return result
            } else {
                let err = {
                    tip: '获取角色组分类失败',
                    response: result,
                    data: {
                        id
                    },
                    url: 'https://localhost/getGroupById?id=${id}',
                }
                throw err
            }
        } catch (err) {
            throw err
        }
    }

    async getGroup(params = {}) {
        try {
            let result = await this.axios('POST', `/getGroup`, params)
            if (result instanceof Object && result.code === 200) {
                return result
            } else {
                let err = {
                    tip: '获取角色分页数据失败',
                    response: result,
                    data: params,
                    url: 'https://localhost/getGroup',
                }
                throw err
            }
        } catch (err) {
            throw err
        }
    }

    async getRole(params = {}) {
        try {
            let result = await this.axios('POST', `/getRole`, params)
            if (result instanceof Object && result.code === 200) {
                return result
            } else {
                let err = {
                    tip: '获取角色数据失败',
                    response: result,
                    data: params,
                    url: 'https://localhost/getRole',
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
            if (result) {
                return result.data
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

    async updateGroup(params) {
        try {

            let result = await this.axios('PUT', `/updateGroup`, params)
            if (result instanceof Object && result.code === 200) {
                return result

            } else {
                let err = {
                    tip: '修改角色组失败',
                    response: result,
                    data: params,
                    url: 'https://localhost/updateGroup',
                }
                throw err
            }
        } catch (err) {
            throw err
        }
    }

    async deleteGroup(id) {
        try {

            let result = await this.axios('DELETE', `/deleteGroup?id=${id}`)
            if (result instanceof Object && result.code === 200) {
                return result
            } else {
                let err = {
                    tip: '删除角色组失败',
                    response: result,
                    data: {
                        id
                    },
                    url: `https://localhost/deleteGroup?id=${id}`
                }
                throw err
            }
        } catch (err) {
            throw err
        }
    }
}

export default new Group()