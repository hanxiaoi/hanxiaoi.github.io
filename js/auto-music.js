// 自动播放音乐脚本
(function() {
    let retryCount = 0;
    const maxRetries = 10;
    
    function tryAutoPlay() {
        // 等待播放器初始化
        if (window.Vue && window.pinia) {
            try {
                // 获取 Pinia 实例
                const app = document.querySelector('#MusicPlayerRoot')?.__vue_app__;
                if (app) {
                    const pinia = app.config.globalProperties.$pinia || app._context.provides.pinia;
                    if (pinia) {
                        // 获取播放状态 store
                        const playingStore = pinia._s.get('playing');
                        if (playingStore) {
                            console.log('找到播放器 store，尝试自动播放...');
                            
                            // 延迟一段时间后开始播放
                            setTimeout(() => {
                                playingStore.playing = true;
                                playingStore.currentId++;
                                console.log('音乐自动播放已启动');
                            }, 2000);
                            return true;
                        }
                    }
                }
            } catch (error) {
                console.log('自动播放尝试失败：', error);
            }
        }
        
        // 如果没找到，继续重试
        retryCount++;
        if (retryCount < maxRetries) {
            setTimeout(tryAutoPlay, 1000);
        } else {
            console.log('自动播放初始化超时，请手动点击播放');
        }
        return false;
    }
    
    // 页面加载完成后开始尝试
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryAutoPlay);
    } else {
        setTimeout(tryAutoPlay, 1000);
    }
    
    // 用户交互后也尝试播放
    function userInteractionAutoPlay() {
        setTimeout(() => {
            try {
                const audioElements = document.querySelectorAll('audio');
                audioElements.forEach(audio => {
                    if (audio.paused) {
                        audio.play().catch(e => console.log('用户交互播放失败:', e));
                    }
                });
            } catch (error) {
                console.log('用户交互播放失败：', error);
            }
        }, 100);
    }
    
    // 监听用户第一次交互
    ['click', 'touchstart', 'keydown'].forEach(event => {
        document.addEventListener(event, userInteractionAutoPlay, { once: true });
    });
})();