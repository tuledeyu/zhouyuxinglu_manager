import Server from '../server'

class Role extends Server {

    async getRoleById(id) {
        try {
            let result = await this.axios('GET', `/getRoleById?id=${id}`)
            if (result instanceof Object && result.code === 200) {
                return result
            } else {
                let err = {
                    tip: '获取角色Id失败',
                    response: result,
                    data: params,
                    url: `https://localhost/getRoleById?id=${id}`,
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

    async addRole(params = {}) {
        try {

            let result = await this.axios('POST', `/addRole`, params)
            if (result instanceof Object && result.code === 200) {
                return result
            } else {
                let err = {
                    tip: '新建角色失败',
                    response: result,
                    data: params,
                    url: 'https://localhost/addRole',
                }
                throw err
            }
        } catch (err) {
            throw err
        }
    }

    async updateRole(params = {}) {
        try {

            let result = await this.axios('PUT', `/updateRole`, params)
            if (result instanceof Object && result.code === 200) {
                return result

            } else {
                let err = {
                    tip: '修改角色失败',
                    response: result,
                    data: params,
                    url: 'https://localhost/updateRole',
                }
                throw err
            }
        } catch (err) {
            throw err
        }
    }

    async deleteRole(id) {
        try {

            let result = await this.axios('DELETE', `/deleteRole?id=${id}`)
            if (result instanceof Object && result.code === 200) {
                return result
            } else {
                let err = {
                    tip: '删除角色失败',
                    response: result,
                    data: {
                        id
                    },
                    url: `https://localhost/deleteRole?id=${id}`
                }
                throw err
            }
        } catch (err) {
            throw err
        }
    }
}

export default new Role()