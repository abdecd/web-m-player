import fetchWithT from "../utils/fetchWithT";

export default {
    async fetchLyric(musicId) {
        var obj = await fetchWithT(`/api/song/lyric?os=pc&id=${musicId}&lv=-1&tv=-1`,{timeout: 3000}).then(x => x.json());
        var lrcGot;
        if (obj?.tlyric?.lyric) {
            var lrc = new Map(obj?.lrc?.lyric?.trim().split("\n").filter(line => line.match(/\[[^\]]+/g)?.length==1).map(line => line.trim().split("]",2)));
            var tLrc = new Map(obj.tlyric.lyric.trim().split("\n").filter(line => line.match(/\[[^\]]+/g)?.length==1).map(line => line.trim().split("]",2)));
            for (let key of lrc.keys()) {
                if (!tLrc.has(key)) continue;
                lrc.set(key,lrc.get(key)+"\n"+tLrc.get(key));
            }
            lrcGot = "";
            for (let value of  lrc.values()) lrcGot+=value+"\n";
        } else {
            lrcGot = obj?.lrc?.lyric?.replace(/\[[^\]]+\]/g,"");
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