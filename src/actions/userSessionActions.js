export const loginUser = (firstName, lastName, email, id, tags) => ({
        type: 'LOGIN',
        payload: {
                firstName,
                lastName,
                email,
                id,
                tags
        }
})

export const logoutUser = () => ({
    type: 'LOGOUT'
})

export const patchTags = tags => ({
    type: 'PATCH TAGS',
    payload: tags
})