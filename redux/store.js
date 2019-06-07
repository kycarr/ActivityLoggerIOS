import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { START, STOP } from './actions';

const initialState = {
    user: '',
    activity: '',
    device_id: '',
    start_time: '',
    end_time: '',
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case START:
            return {
                ...state,
                user: action.user,
                activity: action.activity,
                device_id: action.device_id,
                start_time: action.time,
            }

        case STOP:
            return {
                ...state,
                end_time: action.time,
            }

        default:
            break
    }
    
    return state
}

const store = createStore(rootReducer, applyMiddleware(...[thunk]))

export default store