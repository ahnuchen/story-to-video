var fs = require('fs-extra');
const {requestAsync, translate} = require("./utils");
const savedJson = fs.readJsonSync('./save.json')

const sleep = ms => new Promise(r =>setTimeout(r, ms))

let len = 1
let total = savedJson.length
const main = async () => {
    for (const item of savedJson) {
        if(item.text.includes('抱歉') || item.text.includes('对不起')) {
            item.original = await translate(item.shortText)
            console.log(item)
            await sleep(500)
        }
    }
    console.log(`-----------${len++}/${total}-----------------`)

    fs.writeJsonSync('./save.json', savedJson)
}

main()