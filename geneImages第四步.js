const fs = require('fs-extra')
const request = require('request')
const {text2ImageBuffer} = require("./utils");

const savedJson = fs.readJsonSync('./save.json')

let len = 1
let total = savedJson.length
async function main(){
    for (const savedJsonElement of savedJson) {
        console.log(savedJsonElement)
        const image = await text2ImageBuffer(savedJsonElement.original)
        console.log(image)
        console.log(`-----------${len++}/${total}-----------------`)
        fs.writeFileSync('./geneImages/' + savedJsonElement.uid + '.png', image)
    }
}

main()