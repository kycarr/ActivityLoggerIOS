export const UPDATE_INTERVAL = 500

export const round = (n) => {
    if (!n) {
        return 0;
    }
    return Math.floor(n * 100) / 100;
}