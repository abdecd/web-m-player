import fs from "fs"

var txt = fs.readFileSync("./src/js/nativeBridge/musicAjax.js").toString()
txt = txt.replaceAll(`fetchWithT(\`/api`,`fetchWithT(\`http://music.163.com/api`)
.replaceAll(`fetchWithT("/discover`,`fetchWithT("https://music.163.com/discover`)
fs.writeFileSync("./src/js/nativeBridge/musicAjax.js",txt)