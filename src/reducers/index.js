import { combineReducers } from 'redux'

import { userReducer } from './userReducer'
import { feedReducer } from './feedReducer'

// Define tag reducer in place
const initTags = []
const tagReducer = (state = initTags, action) => {
    switch(action.type)
    {
        case 'INITIALIZE':
            return action.payload?action.payload:[]
        default:
            return state
    }
}

export default combineReducers({
        user: userReducer,
        feed: feedReducer,
        tags: tagReducer
})