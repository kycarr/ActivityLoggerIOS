import {
    storeUser,
    loadUsers,
    storeActivity,
    loadActivities
} from './storage'

export const SET_USER = "SET_USER"
export const SET_ACTIVITY = "SET_ACTIVITY"
export const SET_START = "SET_START"
export const SET_END = "SET_END"
export const SET_USERS = "SET_USERS"
export const SET_ACTIVITIES = "SET_ACTIVITIES"
export const ADD_LOG = "ADD_LOG"

export const addLog = (key, data) => ({
    type: ADD_LOG,
    key: key,
    data: data
})

export const setUser = user => ({
    type: SET_USER,
    data: user
})

export const setActivity = activity => ({
    type: SET_ACTIVITY,
    data: activity
})

export const getUsers = () => async (dispatch) => {
    const users = await loadUsers()
    dispatch({
        type: SET_USERS,
        data: users
    })
}

export const getActivities = () => async (dispatch) => {
    const activities = await loadActivities()
    dispatch({
        type: SET_ACTIVITIES,
        data: activities
    })
}

export const start = (user, activity) => async (dispatch) => {
    dispatch({
        type: SET_START,
        data: new Date().toISOString()
    })

    await storeUser(user)
    await storeActivity(activity)

    dispatch(getUsers())
    dispatch(getActivities())
}

export const end = () => ({
    type: SET_END,
    data: new Date().toISOString()
})