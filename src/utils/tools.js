import {
    regHex,
    regRgb,
    repRgb
} from './regExp'

/**
 * 序列化URL
 * @param {OBJECT} query 
 */

export function queryStr({
    ...query
}) {
    return (
        Object.keys(query)
        .filter(key => {
            return query[key]
        })
        .map(
            key =>
            query[key] &&
            `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`
        )
        .join('&')
    )
}

/**
 * 解析URL
 * @param {STRING} URL 
 */

export function getRequest(URL) {
    let paramaUrl
    if (URL.indexOf('?') !== -1 && URL.indexOf('=') > 1) {
        paramaUrl = URL.split('?')[1].split('&')
    }
    if (!URL) paramaUrl = window.location.search.substr(1).split('&');
    return mergeObj(paramaUrl.map(item => {
        return (item = {
            [item.split('=')[0]]: unescape(item.split('=')[1])
        })
    }))

}

/**
 * 合并对象
 * @param {ARRARY} target 
 */

export function mergeObj([...target]) {
    let sources = new Object()
    target.forEach(item => {
        Object.assign(sources, item)
    })
    return sources
}

/*
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * eg:fmt.pattern(格式);
 * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).Format("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).Format("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).Format("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).Format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */

/* let createDate = (showData.cdate) ? new Date(showData.cdate.time) : null;   //showData为后台request中的数据
 * let createDateStr = (createDate ? createDate.pattern("yyyy-MM-dd") : "&nbsp;"); //调用即可
 */

export default (Date.prototype.Format = function (fmt) {
    let o = {
        'M+': this.getMonth() + 1, //月份
        'd+': this.getDate(), //日
        'h+': this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
        'H+': this.getHours(), //小时
        'm+': this.getMinutes(), //分
        's+': this.getSeconds(), //秒
        'q+': Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
    }
    let week = {
        '0': '/u65e5',
        '1': '/u4e00',
        '2': '/u4e8c',
        '3': '/u4e09',
        '4': '/u56db',
        '5': '/u4e94',
        '6': '/u516d'
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + '').substr(4 - RegExp.$1.length)
        )
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (RegExp.$1.length > 1 ?
                RegExp.$1.length > 2 ?
                '/u661f/u671f' :
                '/u5468' :
                '') + week[this.getDay() + '']
        )
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
            )
        }
    }
    return fmt
})


/**
 * RGB转HEX
 * @param {STRING} color 
 */

export function colorHex(color) {
    if (!color) return '#ffffff'

    if (!regRgb.test(color) && !regHex.test(color)) throw new Error('enter the correct RGB or HEX type color.')

    if (regRgb.test(color)) {
        let rgbArr = color.replace(repRgb, '').split(',')
        let strHex = '#'

        for (let i = 0; i < rgbArr.length; i++) {
            let hex = Number(rgbArr[i]).toString(16)
            if (hex.length < 2) {
                hex = '0' + hex
            }
            strHex += hex
        }

        if (strHex.length !== 7) {
            strHex = color
        }

        return strHex
    }

    return color
}

/**
 * HEX转RGB
 * @param {STRING} color 
 */

export function colorRgb(color) {
    if (!color) return 'RGB(255,255,255)'

    if (!regHex.test(color) && !regRgb.test(color)) throw new Error('enter the correct HEX or RGB type color.')

    color = color.toLowerCase()

    if (regHex.test(color)) {
        if (color.length === 4) {
            let colorNew = '#'
            for (let i = 1; i < 4; i += 1) {
                colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1))
            }
            color = colorNew
        }

        const colorArr = []
        for (let i = 1; i < 7; i += 2) {
            colorArr.push(parseInt('0x' + color.slice(i, i + 2)))
        }
        return `RGB(${colorArr.join(',')})`
    }
}

/**
 * 适当减小色差
 * @param {STRING} color 
 * @param {STRING} percent 
 */

export function mixColor(color, percent) {
    if (regHex.test(color)) color = colorRgb(color)

    let rgbArr = color.replace(repRgb, '').split(',')

    if (percent > 0) {
        rgbArr.forEach((x, y) => {
            rgbArr[y] = Math.round((1 - percent) * x)
        })
    } else {
        rgbArr.forEach((x, y) => {
            rgbArr[y] = Math.round((255 - x) * percent + x)
        })
    }
    return `RGB(${rgbArr.join(',')})`
}


export function arrToStr(list, key, link) {
    return list.map(item => (item[key])).join(link)
}