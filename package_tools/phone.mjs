import fs from "fs"

//musicAjax.js
var txt = fs.readFileSync("./src/js/nativeBridge/musicAjax.js").toString().replace(/\r/g,"")
txt = txt.replace(`import fetchWithT from "../utils/fetchWithT";

`,"")
.replace(`var ans = (await fetchWithT("/discover/toplist?id="+listId,{timeout: 5000}).then(x => x.text()))
        ?.match(/<textarea id="song-list-pre-data" style="display:none;">(.+?)<\\/textarea>/)?.[1];
        ans = JSON.parse(ans).map(elem => ({
            id: elem.id,
            name: elem.name,
            author: elem.artists.map(artist => artist.name).join("、")
        }));
        return ans;`,`var ans = (await PhoneMusicManager.fetchT("https://music.163.com/discover/toplist?id="+listId,{timeout: 5000}))
        ?.match(/\\/song\\?id=.+?<!-- --> - <!-- -->[^<]+<\\/div>/g)
        ?.map(elem => elem.match(/\\/song\\?id=([^"]+).+?sgtl">([^<]+).+?sginfo">([^<]+)/).slice(1))
        .map(elem => ({ id: elem[0], name: elem[1], author: elem[2] }));
        return ans;`)
.replaceAll(`fetchWithT(\`/api`,`PhoneMusicManager.fetchT(\`http://music.163.com/api`)
fs.writeFileSync("./src/js/nativeBridge/musicAjax.js",txt);

//WebMusicManager.js
var txt = fs.readFileSync("./src/js/webMusicManager.js").toString().replace(/\r/g,"")
txt = txt.replace(`import webMusicListStorage from "./webMusicListStorage";
`,`import webMusicListStorage from "./webMusicListStorage";
import bindEarphone from "./nativeBridge/earphoneBinder";
`)
.replace(`webMusicManager.loopMode = "next";
`,`webMusicManager.loopMode = "next";

window.webMusicManager = webMusicManager;
setTimeout(() => bindEarphone(webMusicManager),3000);
`)
fs.writeFileSync("./src/js/webMusicManager.js",txt);