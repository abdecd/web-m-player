import fetchWithT from "../utils/fetchWithT";

export default {
    _parseLyric(lrcStr) {
        return new Map(
            lrcStr
                ?.trim().split("\n")
                .filter(line => line.match(/\[[^\]]+/g)?.length==1)
                .map(line => {
                    var newLine = line.trim().split("]",2);
                    var temp = newLine[0].slice(1).split(":",2).map(x=>parseInt(x));
                    var time = 60*temp[0]+temp[1];
                    return [time,newLine[1]];
                })
        );
        // new Map([[time(单位s),lyric],...])
    },
    async fetchLyric(musicId) {
        // new Map([[time(单位s),lyric],...])
        var obj = await fetchWithT(`/api/song/lyric?os=pc&id=${musicId}&lv=-1&tv=-1`,{timeout: 3000}).then(x => x.json());
        var lrcGot;
        if (obj?.tlyric?.lyric) {
            var lrc = this._parseLyric(obj?.lrc?.lyric);
            var tLrc = this._parseLyric(obj.tlyric.lyric);
            for (let key of lrc.keys()) {
                if (!tLrc.has(key)) continue;
                lrc.set(key,lrc.get(key)+"\n"+tLrc.get(key));
            }
            lrcGot = lrc;
        } else {
            lrcGot = this._parseLyric(obj?.lrc?.lyric);
        }
        return lrcGot;
    },

    async fetchSrc(musicId) {
        return (await fetchWithT(`/api/song/enhance/player/url?ids=[${musicId}]&br=999000`,{timeout: 3000}).then(x => x.json()))?.data[0].url;
    },

    async fetchDiscover(listId) {
        var ans = (await fetchWithT("/discover/toplist?id="+listId,{timeout: 5000}).then(x => x.text()))
        ?.match(/<textarea id="song-list-pre-data" style="display:none;">(.+?)<\/textarea>/)?.[1];
        ans = JSON.parse(ans).map(elem => ({
            id: elem.id,
            name: elem.name,
            author: elem.artists.map(artist => artist.name).join("、")
        }));
        return ans;
    },

    async fetchSearch(word) {
        var ans = await fetchWithT(`/api/search/get?s=${encodeURI(word)}&type=1&limit=30`,{timeout: 5000}).then(x => x.json());
        ans = ans?.result?.songs?.map(elem => ({
            id: elem.id,
            name: elem.name,
            author: elem.artists.map(artist => artist.name).join("、")
        }));
        return ans;
    },

    async getLocalListAbsolutePath() {
        // 包括url前缀
        return await window.PhoneMusicManager?.getLocalListAbsolutePath();
    },

    async loadLocalList() {
        // native: null(no permission) or arr(may empty)
        return (await window.PhoneMusicManager?.loadFullList())?.map(elem => ({
            name: elem.name.match(/(.+?)\.[^\.]+$/)?.[1],
            url: elem.path,
            author: "",
        })) || [];
    },
};