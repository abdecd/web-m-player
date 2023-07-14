export default function bindEarphone(webMusicManager) {
    if (!window.PhoneMusicManager) return;
    
    PhoneMusicManager.playPauseSub.subscribe(() => webMusicManager.playPause());
    PhoneMusicManager.beforeSub.subscribe(() => {
        webMusicManager.pause();
        setTimeout(async () => (await webMusicManager.before()) && webMusicManager.play(),1500);
    });
    PhoneMusicManager.nextSub.subscribe(() => {
        webMusicManager.pause();
        setTimeout(async () => (await webMusicManager.next()) && webMusicManager.play(),1500);
    });
}