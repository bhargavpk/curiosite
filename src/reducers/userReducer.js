const initialState = {
        firstName: '',
        lastName: '',
        email: '',
        id: '',
        tags: []
}

export const userReducer = (state = initialState, action) => {
    // Takes in user state and returns a new state
        switch(action.type){
                case 'LOGIN':
                                return {
                                        
                                        ...action.payload
                                }
                case 'LOGOUT':
                                return {
                                    initialState
                                }
                case 'PATCH TAGS':
                                return {
                                    ...state,
                                    tags: action.payload
                                }
                      
                      
                default:
                        return state
        }
}