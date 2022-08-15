export default function bindEarphone(webMusicManager) {
    if (!window.PhoneMusicManager) return;
    
    PhoneMusicManager.addPlayPauseListener(() => webMusicManager.playPause());
    PhoneMusicManager.addBeforeListener(() => {
        webMusicManager.pause();
        setTimeout(async () => (await webMusicManager.before()) && webMusicManager.play(),1500);
    });
    PhoneMusicManager.addNextListener(() => {
        webMusicManager.pause();
        setTimeout(async () => (await webMusicManager.next()) && webMusicManager.play(),1500);
    });
}