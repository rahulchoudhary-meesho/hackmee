import axios from "axios";

// export const translateText = () => {
//     getLanguageSource();
//     let data = {
//         q : inputText,
//         source: detectLanguageKey,
//         target: selectedLanguageKey
//     }
//     axios.post(`https://libretranslate.de/translate`, data)
//     .then((response) => {
//         setResultText(response.data.translatedText)
//     })
// }

export const getLanguages = () => {
    var data = []
    axios.get(`https://libretranslate.de/languages`)
    .then((response) => {
        data = response.data;
    })
    return data;
}

// export const getLanguageSource = () => {
//     axios.post(`https://libretranslate.de/detect`, {
//         q: inputText
//     })
//     .then((response) => {
//         setdetectedLanguageKey(response.data[0].language)
//     })
// }