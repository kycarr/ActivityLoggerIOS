import { AsyncStorage } from "react-native"

export const storeUser = async (user) => {
    const users = await loadUsers()
    if (users.includes(user)) {
        return
    }
    users.push(user)
    AsyncStorage.setItem('users', JSON.stringify(users));
}

export const loadUsers = async () => {
    const value = await _retrieveData('users')
    if (value === null || value === undefined) {
        return []
    }
    return JSON.parse(value)
}

export const storeActivity = async (activity) => {
    const activities = await loadActivities()
    if (activities.includes(activity)) {
        return
    }
    activities.push(activity)
    AsyncStorage.setItem('activities', JSON.stringify(activities));
}

export const loadActivities = async () => {
    const value = await _retrieveData('activities')
    if (value === null || value === undefined) {
        return []
    }
    return JSON.parse(value)
}


export const _storeData = async (key, data) => {
    try {
        await AsyncStorage.setItem(key, data);
    } catch (error) { }
}

export const _retrieveData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return value
        }
    } catch (error) {
        return null
    }
}