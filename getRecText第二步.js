var fs = require('fs-extra');
const {requestAsync} = require("./utils");
const textAndDuration = fs.readJsonSync('./textAndDuration.json')
const Authorization = fs.readFileSync('./Authorization.txt', 'utf-8')

const sleep = ms => new Promise(r =>setTimeout(r, ms))

let len = 1
let total = textAndDuration.length
const main = async () => {
    for (let item of textAndDuration) {
        const saveArr = fs.readJsonSync('./save.json')
        const savedItem = saveArr.find(_item => _item.uid === item.uid)
        if(!savedItem.original){
            console.log(savedItem)
            const options = {
                'method': 'POST',
                'url': 'https://gw.nolibox.com/chatgpt-creator/expand_text',
                'headers': {
                    'Authorization': `Bearer ${Authorization}`,
                    'X-Requested-With': 'XMLHttpRequest',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.42',
                    'Content-Type': 'application/json'
                },
                body: {
                    "prompt": item.text
                },
                json: true
            };
            await sleep(500)
            const res = await requestAsync(options)
            console.log(item)
            console.log(res)
            if (res.code == 0) {
                // const saveArr = fs.readJsonSync('./save.json')
                const savedItemIndex = saveArr.findIndex(_item => _item.uid === item.uid)
                if(savedItemIndex > -1) {
                    saveArr[savedItemIndex] = {
                        ...res.data,
                        shortText: item.text,
                        uid: item.uid
                    }
                }else{
                    saveArr.push({
                        ...res.data,
                        shortText: item.text,
                        uid: item.uid
                    })
                }
            } else {
                saveArr.push({
                    shortText: item.text,
                    uid: item.uid
                })
            }
            console.log(`-----------${len++}/${total}-----------------`)
            fs.writeJsonSync('./save.json', saveArr)
        }
    }
}

main()