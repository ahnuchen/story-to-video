const {createCanvas, loadImage} = require('canvas')
const fs = require('fs')

const loadImageAsync = (img) => {
    return new Promise((r) => {
        loadImage(img).then(m => r(m))
    })
}

const drawText2Image = async (imgPath, text) => {
    const canvas = createCanvas(1600, 1600)
    const ctx = canvas.getContext('2d')
    const ctxImg = await loadImageAsync(imgPath)

    ctx.drawImage(ctxImg, 0, 0, 1600, 1600)
    ctx.font = '30px'
    var txt = ctx.measureText(text)
    ctx.fillStyle = '#000000'
    ctx.fillText(text, 800 - txt.width / 2 , 1550)
    ctx.save()
    // ctx.restore()
    // console.log(txt.width)
    // console.log(400 - txt.width / 2)
    const targetPath = imgPath.replace('/images/', '/textImages/')
    fs.writeFileSync(targetPath, canvas.toBuffer('image/jpeg'))
    return targetPath
}

module.exports = {
    drawText2Image
}