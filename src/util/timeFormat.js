import date from 'date-and-time'

export default function(dateTime){
    const now = new Date()
    const given = new Date(dateTime)
    if(date.isSameDay(now, given))
    {
        const nowHour = date.format(now, 'H')
        const givenHour = date.format(given, 'H')
        if(nowHour === givenHour)
        {
            const minutesElapsed = parseInt(date.format(now, 'm') - parseInt(date.format(given, 'm')))
            return `Posted ${minutesElapsed} minute${minutesElapsed===1?'':'s'} ago`
        }
        else
            return `Posted ${nowHour - givenHour} hour${(nowHour-givenHour)===1?'':'s'} ago`
    }
    else
        return `Posted on ${date.format(given, 'DD-MM-YYYY')}`
}