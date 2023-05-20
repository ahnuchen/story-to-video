const {FFScene, FFText, FFVideo, FFAlbum, FFImage, FFCreator} = require("ffcreator");
const path = require('path')
const fs = require('fs-extra')
const colors = require('colors')
const textAndDuration = fs.readJsonSync("./textAndDuration.json");
const {drawText2Image} = require("./addText2Image");

const effects = ['fadeIn', 'fadeOut', 'fadeInLeft', 'fadeInRight', 'fadeInUp', 'fadeInDown', 'fadeInLeftBig', 'fadeInRightBig', 'fadeInUpBig', 'fadeInDownBig', 'fadeOutLeft', 'fadeOutRight', 'fadeOutUp', 'fadeOutDown', 'fadeOutLeftBig', 'fadeOutRightBig', 'fadeOutUpBig', 'fadeOutDownBig', 'blurIn', 'blurOut', 'backIn', 'backOut', 'backInLeft', 'backInRight', 'backInUp', 'backInDown', 'backOutLeft', 'backOutRight', 'backOutUp', 'backOutDown', 'bounceIn', 'bounceInDown', 'bounceInUp', 'bounceInLeft', 'bounceInRight', 'bounceOut', 'bounceOutDown', 'bounceOutLeft', 'bounceOutRight', 'bounceOutUp', 'rotateIn', 'rotateOut', 'rotateInDownLeft', 'rotateInDownRight', 'rotateInUpLeft', 'rotateInUpRight', 'rotateOutDownLeft', 'rotateOutDownRight', 'rotateOutUpLeft', 'rotateOutUpRight', 'rollIn', 'rollOut', 'zoomIn', 'zoomInDown', 'zoomInLeft', 'zoomInRight', 'zoomInUp', 'zoomOut', 'zoomOutDown', 'zoomOutLeft', 'zoomOutRight', 'zoomOutUp', 'slideInDown', 'slideInLeft', 'slideInRight', 'slideInUp', 'slideOutDown', 'slideOutLeft', 'slideOutRight', 'slideOutUp', 'zoomingIn', 'zoomingOut', 'moveingLeft', 'moveingRight', 'moveingUp', 'moveingBottom', 'fadingIn', 'fadingOut']

const images = fs.readdirSync('./geneImages')

const getRandomArrItem = (arr) => {
    return arr[Math.floor(arr.length * Math.random())]
}

const getRandomEffect = () => getRandomArrItem(effects)

const getRandomImage = (uid) => path.join(__dirname, 'geneImages', uid + '.png')


let len = 1
let total = textAndDuration.length
const mainProcess = async () => {

// Create FFCreator instance
    const creator = new FFCreator({
        cacheDir: './.cache',
        outputDir: './output',
        width: 400,
        height: 400,
        audio: './videos/sourceAudio.MP3', // background audio
    });


    await Promise.all(textAndDuration.slice(5).map(async ({text, duration, uid}) => {
        const scene = new FFScene();
        scene.setBgColor("#000000");
        scene.setTransition(getRandomArrItem([
            'Windows4',
            'ButterflyWaveScrawler',
            'GridFlip',
            'FastSwitch',
            'Shake',
            'WaterWave',
            'InvertedPageCurl',
            'Colorful',
            'Magnifier',
            'cube',
            'hexagonalize'
        ]), 0.5);
        scene.setDuration(duration / 1000 + 0.5);
        creator.addChild(scene);

        const img = getRandomImage(uid)
        const imagePath = await drawText2Image(img, text)

        // console.log(`%c img`, "color: black;background-color: pink;", img)
        const image = new FFImage({
            path: imagePath,
            x: 0,
            y: 0,
            width: 800,
            height: 800,
        });
        console.log(`-----------${len++}/${total}-----------------`)
        scene.addChild(image);
    }))
    creator.output(path.join(__dirname, "output/demo.mp4"))
    creator.start();        // 开始加工
    creator.closeLog();     // 关闭log(包含perf)

    creator.on('start', () => {
        console.log(`FFCreator start`);
    });
    creator.on('error', e => {
        console.log(`FFCreator error: ${JSON.stringify(e)}`);
    });
    creator.on('progress', e => {
        console.log(colors.yellow(`FFCreator progress: ${(e.percent * 100) >> 0}%`));
    });
    creator.on('complete', e => {
        console.log(colors.magenta(`FFCreator completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `));
    });


}


mainProcess()