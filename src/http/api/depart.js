import Server from '../server'

class Depart extends Server {
    async getDepartTrees(params = {}) {
        try {
            let result = await this.axios('GET', `/getDepartTrees`)
            if (result instanceof Object && result.code === 200) {
                return result
            } else {
                let err = {
                    tip: '获取树形部门数据失败',
                    response: result,
                    data: params,
                    url: 'https://localhost/getDepartTrees',
                }
                throw err
            }
        } catch (err) {
            throw err
        }
    }

    async getDepart(params = {}) {
        try {
            let result = await this.axios('POST', `/getDepart`, params)
            if (result instanceof Object && result.code === 200) {
                return result
            } else {
                let err = {
                    tip: '获取分页部门数据失败',
                    response: result,
                    data: params,
                    url: 'https://localhost/getDepart',
                }
                throw err
            }
        } catch (err) {
            throw err
        }
    }

    async getDepartById(id) {
        try {
            let result = await this.axios('GET', `/getDepartById?id=${id}`)
            if (result instanceof Object && result.code === 200) {
                console.log(result, 222222)

                return result
            } else {
                let err = {
                    tip: '查询部门ID失败',
                    response: result,
                    data: {
                        id
                    },
                    url: 'https://localhost/getDepartById',
                }
                throw err
            }
        } catch (err) {
            throw err
        }
    }

    async addDepart(params) {
        try {

            let result = await this.axios('POST', `/addDepart`, params)
            if (result instanceof Object && result.code === 200) {
                return result
            } else {
                let err = {
                    tip: '新建部门数据失败',
                    response: result,
                    data: params,
                    url: 'https://localhost/addDepart',
                }
                throw err
            }
        } catch (err) {
            throw err
        }
    }

    async updateDepart(params) {
        try {

            let result = await this.axios('PUT', `/updateDepart`, params)
            if (result instanceof Object && result.code === 200) {
                return result
            } else {
                let err = {
                    tip: '修改部门数据失败',
                    response: result,
                    data: params,
                    url: 'https://localhost/updateDepart',
                }
                throw err
            }
        } catch (err) {
            throw err
        }
    }

    async deleteDepart(id) {
        try {

            let result = await this.axios('DELETE', `/deleteDepart?id=${id}`)

            if (result instanceof Object && result.code === 200) {
                return result
            } else {
                let err = {
                    tip: '删除部门数据失败',
                    response: result,
                    data: {
                        id
                    },
                    url: 'https://localhost/deleteDepart',
                }
                throw err
            }
        } catch (err) {
            throw err
        }
    }
}

export default new Depart()