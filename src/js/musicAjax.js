import axios from "axios";

export default {
    async lyric(musicId) {
        var obj = (await axios(`/api/song/lyric?os=pc&id=${musicId}&lv=-1&tv=-1`)).data;
        var lrcGot = obj.lrc.lyric;
        // var lrcGot = obj.tlyric.lyric;
        return lrcGot;
    },

    async src(musicId) {
        return (await axios(`/api/song/enhance/player/url?ids=[${musicId}]&br=999000`)).data.data[0].url;
    },

    async discover(listId) {
        var ans = (await axios("/discover/toplist?id="+listId)).data?.match(/<textarea id="song-list-pre-data" style="display:none;">(.+?)<\/textarea>/)?.[1];
        ans = JSON.parse(ans).map(elem => { return {
            id: elem.id,
            name: elem.name,
            author: elem.artists.map(artist => artist.name).join("、")
        } });
        return ans;
    },

    async search(word) {
        var ans = (await axios(`/api/search/get?s=${word}&type=1&limit=30`)).data;
        ans = ans.result.songs.map(elem => { return {
            id: elem.id,
            name: elem.name,
            author: elem.artists.map(artist => artist.name).join("、")
        } });
        return ans;
    },
};