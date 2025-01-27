import fs from "fs"

var txt = fs.readFileSync("./src/js/nativeBridge/musicAjax.js").toString()
txt = txt
    .replaceAll(`import fetchWithT from "../utils/fetchWithT";`,`function fetchWithT(url,options){return window['go']['main']['App']['Fetch'](url)}`)
    .replaceAll(`.then(x => x.text())`,``)
    .replaceAll(`.then(x => x.json())`,`.then(x => JSON.parse(x))`)
    .replaceAll(`fetchWithT(\`/api`,`fetchWithT(\`http://music.163.com/api`)
    .replaceAll(`fetchWithT("/discover`,`fetchWithT("https://music.163.com/discover`)
fs.writeFileSync("./src/js/nativeBridge/musicAjax.js",txt)