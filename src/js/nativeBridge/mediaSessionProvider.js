import webMusicManager from "../webMusicManager";

const mediaSessionProvider = {
    provide() {
        if (!navigator.mediaSession) return;

        navigator.mediaSession.metadata = new MediaMetadata({
            title: webMusicManager.musicObj.name
        });
        webMusicManager.musicNameChangeSub.subscribe(() => {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: webMusicManager.musicObj.name
            });
        });
        navigator.mediaSession.setActionHandler('play', () => webMusicManager.play());
        navigator.mediaSession.setActionHandler('pause', () => webMusicManager.pause());
        navigator.mediaSession.setActionHandler('previoustrack', () => webMusicManager.before().then(x=>x&&webMusicManager.play()));
        navigator.mediaSession.setActionHandler('nexttrack', () => webMusicManager.nextByLoopOrder().then(x=>x&&webMusicManager.play()));
    }
};

export default mediaSessionProvider;