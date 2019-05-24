// milliseconds
export const UPDATE_INTERVAL = 200
export const LOCATION_INTERVAL = 1000
export const BRIGHTNESS_INTERVAL = 1000
export const SOUND_INTERVAL = 2000

// meters
export const LOCATION_DISTANCE = 100

export const round = (n) => {
    if (!n) {
        return 0;
    }
    return Math.floor(n * 100) / 100;
}

export const timestampToDate = (timestamp) => {
    return new Date(timestamp * 1000)
}

export const formatDate = (date) => {
    return `${date.toLocaleString()}.${date.getMilliseconds()}`
}

export const formatTimestamp = (timestamp) => {
    return formatDate(timestampToDate(timestamp))
}