export const createDataPoint = (time = Date.now(), magnitude = 1000, offset = 0) => {
    return [
        time + offset * magnitude,
        Math.round((Math.random() * 100) * 2) / 2
    ];
};

export const createRandomData = (time, magnitude, points = 100) => {
    const data = [];
    let i = (points * -1) + 1;
    for (i; i <= 0; i++) {
        data.push(createDataPoint(time, magnitude, i));
    }
    return data;
};

export const parseTimeSeriesData = (data, field) => {
    let result = []
    data.map((singleDataPoint) => {
        result.push([
            Date.parse(singleDataPoint.date),
            singleDataPoint[field]
        ]);
    })
    return result
}

export const groupTimeSeriesByField = (data, field) => {
    let result = {}
    data.map((singleDataPoint) => {
        if(typeof(result[singleDataPoint[field]]) === 'undefined'){
            result[singleDataPoint[field]] = []
        }
        result[singleDataPoint[field]].push(singleDataPoint);
    })
    return result
}

export const getSeriesWithBestPerformance = (data) => {
    let result = {}
    data.map((singleDataPoint) => {
        if(typeof(result[singleDataPoint['date']]) === 'undefined'){
            result[singleDataPoint['date']] = {
                date: singleDataPoint['date'],
                score: 0,
                forecast: 0
            }
        }
        if(singleDataPoint['score'] > result[singleDataPoint['date']]['score']){
            result[singleDataPoint['date']] = {
                date: singleDataPoint['date'],
                score: singleDataPoint['score'],
                forecast: singleDataPoint['forecast']
            }
        }
    })
    return Object.values(result)
}

