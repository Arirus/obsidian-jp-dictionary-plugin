
import { translate } from "bing-translate-api";
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: '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',
});
const openai = new OpenAIApi(configuration);



export function bingTranslate(
    queryString: string,
    fromLang: string,
    toLang: string,
    cb: (result: string) => void) {
    translate(queryString, fromLang ? fromLang : "auto-detect", toLang).then((result) => {
        cb(result.translation)
    })
}


export function chatTranslate(queryString: string,
    fromLang: string,
    toLang: string,
    cb: (result: string) => void) {

    let prompt = `把 “${queryString}” 这句话翻译成日语`


    openai.createChatCompletion({
        'model': "gpt-3.5-turbo",
        'messages': [
            {
                "role": "system",
                "content": "你是一个日语翻译小助手"
            },
            {
                "role": "system",
                "content": "用户给出的句子翻译完后，要额外返回出片假名信息"
            }, {
                "role": "system",
                "content": "例如：用户输入 ”今天天气不错“，你这里要返回 ”翻译：今日の天気はいいです。\n片假名：きょうのてんきはいいです“ "
            },
            {
                "role": "user",
                "content": prompt
            },
        ],
        'temperature': 0.8,
        'stream': false
    }).then((result) => {
        const choices = result.data.choices
        cb(choices[0].message?.content || "Unknown")
    }).catch((reason) => {
        cb(reason)
    })


}