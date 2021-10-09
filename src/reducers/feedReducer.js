const initialState = { type: 'HOME' }

export const feedReducer = (state = initialState, action) => {
    return action.type !== undefined?{...action}:{...initialState}
}