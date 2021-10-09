export const setStaticTags = tags => {
    return {
        type: 'INITIALIZE',
        payload: tags?[...tags]:[]
    }
}