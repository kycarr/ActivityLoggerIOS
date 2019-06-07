import DeviceInfo from 'react-native-device-info';

import { storeUser, storeActivity } from '../storage/storage'
import { writeLog } from '../storage/files'

export const START = "START"
export const STOP = "STOP"

export const startRecording = (user, activity) => async (dispatch) => {
    user = user.toLowerCase()
    activity = activity.toLowerCase()
    device_id = DeviceInfo.getUniqueID()
    time = new Date().toLocaleString()

    dispatch({
        type: START,
        user,
        activity,
        device_id,
        time,
    })

    await storeUser(user)
    await storeActivity(activity)
    
    const formattedData = {
        "user": user,
        "activity": activity,
        "device_id": device_id,
        "start_time": time,
    }
    writeLog(user, activity, time, 'log', formattedData)
}

export const stopRecording = () => (dispatch, getState) => {
    const state = getState()
    time = new Date().toLocaleString()

    dispatch({
        type: STOP,
        time: new Date().toLocaleString()    
    })

    const formattedData = {
        "end_time": time,
    }
    writeLog(user, activity, state.start_time, 'log', formattedData)
}