
import { translate } from "bing-translate-api";




export function bingTranslate(
    queryString: string,
    fromLang: string,
    toLang: string,
    cb: (result: string) => void) {
    translate(queryString, fromLang ? fromLang : "auto-detect", toLang).then((result) => {
        cb(result.translation)
    })
}