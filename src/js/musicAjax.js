import axios from "axios";

export default {
    async fetchLyric(musicId) {
        var obj = (await axios(`/api/song/lyric?os=pc&id=${musicId}&lv=-1&tv=-1`)).data;
        var lrcGot = obj.lrc.lyric;
        // var lrcGot = obj.tlyric.lyric;
        return lrcGot;
    },

    async fetchSrc(musicId) {
        return (await axios(`/api/song/enhance/player/url?ids=[${musicId}]&br=999000`)).data.data[0].url;
    },

    async fetchDiscover(listId) {
        var ans = (await axios("/discover/toplist?id="+listId)).data?.match(/<textarea id="song-list-pre-data" style="display:none;">(.+?)<\/textarea>/)?.[1];
        ans = JSON.parse(ans).map(elem => { return {
            id: elem.id,
            name: elem.name,
            author: elem.artists.map(artist => artist.name).join("、")
        } });
        return ans;
    },

    async fetchSearch(word) {
        var ans = (await axios(`/api/search/get?s=${word}&type=1&limit=30`)).data;
        ans = ans.result.songs.map(elem => { return {
            id: elem.id,
            name: elem.name,
            author: elem.artists.map(artist => artist.name).join("、")
        } });
        return ans;
    },

    loadLocalListSync() {
        return window.PhoneMusicManager?.loadFullList()?.map(elem => { return {
            id: null,
            url: elem.path,
            name: elem.name.match(/(.+?)\.[^\.]+$/)?.[1],
            author: "",
        } });
    },
};