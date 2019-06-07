import { AsyncStorage } from 'react-native'

export const loadUsers = async () => {
    const value = await retrieveData('users')
    if (value === null || value === undefined) {
        return []
    }
    return JSON.parse(value)
}

export const loadActivities = async () => {
    const value = await retrieveData('activities')
    var activities = [
        'standing',
        'walking',
        'sitting',
        'laying down',
        'waiting in line',
        'eating',
        'on computer',
        'on phone activity'
    ]
    if (value) {
        activities = activities.concat(JSON.parse(value))
    }

    return [...new Set(activities)]
}

export const storeUser = async (user) => {
    const users = await loadUsers()
    if (users.includes(user)) {
        return
    }
    users.push(user)
    storeData('users', JSON.stringify(users));
}

export const storeActivity = async (activity) => {
    const activities = await loadActivities()
    if (activities.includes(activity)) {
        return
    }
    activities.push(activity)
    storeData('activities', JSON.stringify(activities));
}

export const clearUsers = () => {
    storeData('users', JSON.stringify([]))
}

export const clearActivities = () => {
    storeData('activities', JSON.stringify([]))
}


const storeData = async (key, data) => {
    try {
        await AsyncStorage.setItem(key, data);
    } catch (error) { }
}

const retrieveData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return value
        }
    } catch (error) {
        return null
    }
}