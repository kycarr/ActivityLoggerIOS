// milliseconds
export const UPDATE_INTERVAL = 500
export const LOCATION_INTERVAL = 1000
export const BRIGHTNESS_INTERVAL = 2000
export const SOUND_INTERVAL = 2000

// meters
export const LOCATION_DISTANCE = 100

export const round = (n) => {
    if (!n) {
        return 0;
    }
    return Math.floor(n * 100) / 100;
}