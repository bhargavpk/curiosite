export const setToHome = () => ({
    type: 'HOME',
    tags: []
})
export const setToFollows = () => ({
    type: 'FOLLOWS',
    tags: []
})
export const setToSearch = (tags) => ({
    type: 'SEARCH',
    tags
})