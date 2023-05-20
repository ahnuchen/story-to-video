const request = require("request");
const requestAsync = options => new Promise((resolve, reject) => {
    request(options, function (error, response) {
        if (error) reject(error);
        resolve(response.body)
    });

})

const translate = async (word) => {
    var options = {
        'method': 'GET',
        'url': 'http://fanyi.youdao.com/translate?doctype=json&type=ZH_CN2EN&i=' + encodeURIComponent(word),
        'headers': {
            'User-Agent': 'Apifox/1.0.0 (https://www.apifox.cn)'
        },
        json: true
    };
    const res = await requestAsync(options)
    return res.translateResult[0][0].tgt
}

const text2Image = async (prompt) => {
    try {
        const res = await requestAsync({
            url: 'http://127.0.0.1:7860/sdapi/v1/txt2img',
            method: 'POST',
            json: true,
            body: {
                "prompt": prompt,
                "steps": 20
            }
        })
        return res.images[0]
    } catch (e) {
        return ''
    }
}

const text2ImageBuffer = async (prompt) => {
    const img = await text2Image(prompt)
    return Buffer.from(img, 'base64')
}


module.exports = {
    requestAsync, text2Image, translate, text2ImageBuffer
}