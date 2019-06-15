import Server from '../server'

class Resource extends Server {
    async getResourceTrees(params = {}) {
        try {
            let result = await this.axios('GET', `/getResourceTrees`)
            if (result instanceof Object && result.code === 200) {
                return result
            } else {
                let err = {
                    tip: '获取资源数据树失败',
                    response: result,
                    data: params,
                    url: `https://localhost/getResourceTrees`
                }
                throw err
            }
        } catch (err) {
            throw err
        }
    }

    async getResourceById(id) {
        try {
            let result = await this.axios('GET', `/getResourceById?id=${id}`)
            if (result instanceof Object && result.code === 200) {
                return result
            } else {
                let err = {
                    tip: '获取资源ID数据失败',
                    response: result,
                    data: {
                        id
                    },
                    url: `https://localhost/getResourceById?id=${id}`
                }
                throw err
            }
        } catch (err) {
            throw err
        }
    }

    async getResource(params = {}) {
        try {
            let result = await this.axios('POST', `/getResource`, params)
            if (result instanceof Object && result.code === 200) {
                return result
            } else {
                let err = {
                    tip: '获取资源失败',
                    response: result,
                    data: params,
                    url: `https://localhost/getResource`
                }
                throw err
            }
        } catch (err) {
            throw err
        }
    }

    async addResource(params = {}) {
        try {

            let result = await this.axios('POST', `/addResource`, params)
            if (result instanceof Object && result.code === 200) {
                return result
            } else {
                let err = {
                    tip: '新建资源失败',
                    response: result,
                    data: params,
                    url: `https://localhost/addResource`
                }
                throw err
            }
        } catch (err) {
            throw err
        }
    }

    async updateResource(params = {}) {
        try {

            let result = await this.axios('PUT', `/updateResource`, params)

            if (result instanceof Object && result.code === 200) {
                return result
            } else {
                let err = {
                    tip: '更新资源失败',
                    response: result,
                    data: params,
                    url: `https://localhost/updateResource`
                }
                throw err
            }
        } catch (err) {
            throw err
        }
    }

    async deleteResource(id) {
        try {

            let result = await this.axios('DELETE', `/deleteResource?id=${id}`)
            if (result instanceof Object && result.code === 200) {
                return result
            } else {
                let err = {
                    tip: '删除资源失败',
                    response: result,
                    data: {
                        id
                    },
                    url: `https://localhost/deleteResource?id=${id}`
                }
                throw err
            }
        } catch (err) {
            throw err
        }
    }
}

export default new Resource()