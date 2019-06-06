import { writeLog, emailLog } from '../constants/files'
import {
    SET_USER,
    SET_USERS,
    SET_ACTIVITY,
    SET_ACTIVITIES,
    SET_START,
    SET_END,
    ADD_LOG,
} from '../constants/actions';

const initialState = {
    user: '',
    activity: '',
    startTime: '',
    endTime: '',
    isRecording: false,

    users: [],
    activities: [],
    logs: {},
    data: {},
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                user: action.data
            }
        case SET_USERS:
            return {
                ...state,
                users: action.data
            }
        case SET_ACTIVITY:
            return {
                ...state,
                activity: action.data
            }
        case SET_ACTIVITIES:
            return {
                ...state,
                activities: action.data
            }
        case SET_START:
            const startTime = action.data
            const startLog = {
                'deviceID': action.id,
                'userID': state.user.toLowerCase(),
                'activity': state.activity.toLowerCase(),
                'startTime': startTime,
                'endTime': '',
                'data': {},
            }
            writeLog(state.user, state.activity, startTime, startLog)

            return {
                ...state,
                startTime: startTime,
                endTime: '',
                isRecording: true,
                data: {},
                logs: startLog,
            }
        case SET_END:
            const endTime = action.data
            const endLog = {
                ...state.logs,
                'endTime': endTime,
                'data': state.data
            }
            writeLog(state.user, state.activity, state.startTime, endLog)
            emailLog(state.user, state.activity, state.startTime, endLog)

            return {
                ...state,
                endTime: endTime,
                isRecording: false,
                logs: endLog
            }
        case ADD_LOG:
            var data = [action.data]
            if (action.key in state.data) {
                data = [...state.data[action.key], action.data]
            }
            const log = {
                ...state.logs,
                'data': {
                    ...state.data,
                    [action.key]: data
                }
            }
            writeLog(state.user, state.activity, state.startTime, log)

            return {
                ...state,
                data: {
                    ...state.data,
                    [action.key]: data
                },
                logs: log
            }
        default:
            return state
    }
}

export default reducer = (state = initialState, action) => {
    return rootReducer(state, action)
}