const path = require('path')
const uuidv1 = require('uuid/v1')
const dayjs = require('dayjs')
const fs = require('fs-extra')
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

const text = fs.readFileSync('./videos/sourceText.srt', 'utf-8')

const timeSplit = text.split('\r\n\r\n').map(i => i.split('\r\n'))
console.log(timeSplit)
const formater = 'YYYY-MM-DD HH:mm:ss,SSS'
const today = dayjs().format('YYYY-MM-DD')
const textAndDuration = []
timeSplit.forEach(([, durationText, text]) => {
    if (!durationText) {
        return
    }
    const [start, end] = durationText.split(' --> ')
    // console.log(today + ' ' + start)
    const startTime = dayjs(today + ' ' + start, formater)
    const endTime = dayjs(today + ' ' + end, formater)
    const duration = endTime.diff(startTime, 'ms')
    textAndDuration.push({
        duration,
        text,
        uid: uuidv1()
    })
})

fs.writeJsonSync('./textAndDuration.json', textAndDuration)