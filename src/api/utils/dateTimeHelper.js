/**
 * Returns dates for week ahead forecast
 * @returns {[*,*]}
 */
const getForecastWindow = () => {
    const currentDate = new Date
    // Previous day
    const dateFrom = new Date(currentDate.getTime() - 1 * 24 * 60 * 60 * 1000)
    // Next week
    const dateTo = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000)
    return [dateFrom, dateTo]
}

/**
 * Returns dates for loading historical data for previous day
 * @returns {[*,*]}
 */
const getLoadDataWindow = () => {
    // Current day
    const dateTo = new Date
    // Previous day
    const dateFrom = new Date(dateTo.getTime() - 24 * 60 * 60 * 1000)
    return [dateFrom, dateTo]
}

/**
 * Returns dates for loading historical data for previous 3 years
 * @returns {[*,*]}
 */
const getFullDataLoadWindow = () => {
    // Current day
    const currentDate = new Date;
    const dateTo = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    // Previous 3 years
    const dateFrom = new Date(dateTo.getTime() - 3 * 12 * 31 * 24 * 60 * 60 * 1000);
    return [dateFrom, dateTo]
}

/**
 * Returns dates for showing historical data for previous 21 days
 * @returns {[*,*]}
 */
const getHistoryDataWindow = () => {
    // Current day
    const dateTo = new Date;
    // Previous 21 days
    const dateFrom = new Date(dateTo.getTime() - 21 * 24 * 60 * 60 * 1000);
    return [dateFrom, dateTo]
}

module.exports = {
    getForecastWindow,
    getLoadDataWindow,
    getFullDataLoadWindow,
    getHistoryDataWindow
}
