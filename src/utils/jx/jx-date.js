import moment from 'moment'

/**
 * 返回当前日期 例： '2022-09-20'
 */
export function getNewDate() {
    var date = new Date()

    let year = date.getFullYear()
    let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var time = year + '-' + month + '-' + day
    return time
}

/**
 *  返回当前日期的时间戳
 */
export function getNewDateTimestamp() {
    var date = new Date()
    var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    var timestamp = new Date(time).getTime()
    return timestamp
}

export function getDateJSON(d, str) {
    // console.log(d);
    var date = new Date(d)

    let year = date.getFullYear()
    let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()

    let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() //小时
    let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() //分钟
    let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds() //秒

    var time = ''

    if (str != null) {
        time = year + '-' + month + '-' + day + ' ' + str
    } else {
        time = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
    }

    return time
}

export function formatTime(ms) {
    var d = moment.duration(ms, 'milliseconds')

    var day = Math.floor(d.asDays())
    var hours = Math.floor(d.asHours() - day * 24)
    var mins = Math.floor(d.asMinutes() - hours * 60 - day * 1440)
    var seconds = Math.floor(d.asSeconds() - mins * 60 - hours * 3600 - day * 86400)
    var millisecond = Math.floor(d.asMilliseconds() - seconds * 60 - mins * 60 - hours * 3600 - day * 86400)

    var time = ''

    if (day > 0) {
        time += day + '天'
    }
    if (hours > 0) {
        time += hours + '时'
    }

    time += mins + '分' + seconds + '秒'
    if (mins == 0 && seconds == 0 && millisecond > 0) {
        time = millisecond + '毫秒'
    }

    return time
}

export function formatMinute(ms) {
    var d = moment.duration(ms, 'milliseconds')

    var mins = Math.floor(d.asMinutes())

    var minute = mins + ''

    return minute
}

/**
 * 得到今天经历的毫秒
 */
export function getTodayMs() {

    var date = new Date()

    var start = moment(Number(date.getTime())).format('YYYY-MM-DD 00:00:00')

    var ms = date.getTime() - new Date(start).getTime()

    return ms
}
