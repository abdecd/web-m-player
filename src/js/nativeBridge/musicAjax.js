import fetchWithTimeout from "../fetchWithTimeout";

export default {
    async fetchLyric(musicId) {
        var obj = await fetchWithTimeout(`/api/song/lyric?os=pc&id=${musicId}&lv=-1&tv=-1`,{timeout: 3000}).then(x => x.json());
        var lrcGot;
        if (obj?.tlyric?.lyric) {
            var lrc = obj?.lrc?.lyric?.split(/\[[^\]]+\]/);
            var tLrc = obj.tlyric.lyric.split(/\[[^\]]+\]/);
            var lrcArr = [];
            while (lrc.length || tLrc.length) {
                if (tLrc.length) lrcArr.unshift(tLrc.pop());
                if (lrc.length) lrcArr.unshift(lrc.pop());
            }
            lrcGot = lrcArr.join("");
        } else {
            lrcGot = obj?.lrc?.lyric?.replace(/\[[^\]]+\]/g,"");
        }
        return lrcGot;
    },

    async fetchSrc(musicId) {
        return (await fetchWithTimeout(`/api/song/enhance/player/url?ids=[${musicId}]&br=999000`,{timeout: 3000}).then(x => x.json()))?.data[0].url;
    },

    async fetchDiscover(listId) {
        var ans = (await fetchWithTimeout("/discover/toplist?id="+listId,{timeout: 5000}).then(x => x.text()))
        ?.match(/<textarea id="song-list-pre-data" style="display:none;">(.+?)<\/textarea>/)?.[1];
        ans = JSON.parse(ans).map(elem => ({
            id: elem.id,
            name: elem.name,
            author: elem.artists.map(artist => artist.name).join("、")
        }));
        return ans;
    },

    async fetchSearch(word) {
        var ans = await fetchWithTimeout(`/api/search/get?s=${encodeURI(word)}&type=1&limit=30`,{timeout: 5000}).then(x => x.json());
        ans = ans?.result?.songs?.map(elem => ({
            id: elem.id,
            name: elem.name,
            author: elem.artists.map(artist => artist.name).join("、")
        }));
        return ans;
    },

    async loadLocalListSync() {
        // native: null(no permission) or arr(may empty)
        return (await window.PhoneMusicManager?.loadFullList())?.map(elem => ({
            name: elem.name.match(/(.+?)\.[^\.]+$/)?.[1],
            url: elem.path,
            author: "",
        }));
    },
};