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
            return {
                ...state,
                startTime: action.data,
                endTime: '',
                isRecording: true,
                data: {},
                logs: {
                    'userID': state.user,
                    'activity': state.activity,
                    'startTime': action.data,
                    'endTime': '',
                    'data': {},
                },
            }
        case SET_END:
            return {
                ...state,
                endTime: action.data,
                isRecording: false,
                logs: {
                    ...state.logs,
                    'endTime': action.data,
                    'data': state.data
                }
            }
        case ADD_LOG:
            var data = [action.data]
            if (action.key in state.data) {
                data = [...state.data[action.key], action.data]
            }

            return {
                ...state,
                data: {
                    ...state.data,
                    [action.key]: data
                },
                logs: {
                    ...state.logs,
                    'data': {
                        ...state.data,
                        [action.key]: data
                    }
                }
            }
        default:
            return state
    }
}

export default reducer = (state = initialState, action) => {
    return rootReducer(state, action)
}