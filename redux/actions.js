import DeviceInfo from 'react-native-device-info';

import { storeUser, storeActivity } from '../storage/storage'
import { writeLog, emailLog } from '../storage/files'

export const START = "START"
export const STOP = "STOP"

export const startRecording = (user, activity) => async (dispatch) => {
    user = user.toLowerCase()
    activity = activity.toLowerCase()
    const device_id = DeviceInfo.getUniqueID()
    const time = new Date().toLocaleString()

    dispatch({
        type: START,
        user,
        activity,
        device_id,
        time,
    })

    storeUser(user)
    storeActivity(activity)

    writeLog(user, activity, time, 'log', `user,"${user}"`)
    writeLog(user, activity, time, 'log', `activity,"${activity}"`)
    writeLog(user, activity, time, 'log', `device_id,"${device_id}"`)
    writeLog(user, activity, time, 'log', `start_time,"${time}"`)
}

export const stopRecording = () => async(dispatch, getState) => {
    const state = getState()
    const time = new Date().toLocaleString()

    dispatch({
        type: STOP,
        time: time
    })
    await writeLog(state.user, state.activity, state.start_time, 'log', `end_time,"${time}"`)
    await emailLog(state.user, state.activity, state.start_time)
}