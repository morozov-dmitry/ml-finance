const dateformat = require('dateformat')

const getForecastWindow = () => {
    const currentDate = new Date
    const dateFrom = new Date(currentDate.getTime() - 1 * 24 * 60 * 60 * 1000)
    const dateTo = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000)
    return [dateFrom, dateTo]
}

const getLoadDataWindow = () => {
    const dateTo = new Date
    const dateFrom = new Date(dateTo.getTime() - 24 * 60 * 60 * 1000)
    return [dateFrom, dateTo]
}


module.exports = {
    getForecastWindow,
    getLoadDataWindow
}
