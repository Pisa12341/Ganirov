$(document).ready(function() {
    const videos = [
        'https://razgovor-cdn.edsoo.ru/media/video/russianscience-14-3.mp4',
        'https://razgovor-cdn.edsoo.ru/media/video/russianscience-14-4.mp4',
        'https://razgovor-cdn.edsoo.ru/media/video/russianscience-14-5.mp4'
    ];

    var container = $(".container");
    var screenHeight = $(window).height();
    var startY = 0;
    var initialScrollPosition = 0;
    var startTime = 0;
    var endTime = 0;
    var isScrolling = false;
    var currentVideo = null;

    container.on("touchstart", function(event) {
        if (!isScrolling) {
            startY = event.touches[0].clientY;
            initialScrollPosition = window.scrollY;
            startTime = new Date().getTime();
        }
    });

    container.on("touchend", function(event) {
        if (!isScrolling) {
            var endY = event.changedTouches[0].clientY;
            var scrollDistance = startY - endY;
            endTime = new Date().getTime();

            if (Math.abs(scrollDistance) > screenHeight * 0.4) {
                if (scrollDistance > 0) {
                    var adjustedHeight = screenHeight - Math.abs(scrollDistance);
                    window.scrollBy(0, adjustedHeight);
                } else {
                    var currentScroll = window.scrollY;
                    var index = Math.floor(currentScroll / screenHeight);
                    window.scrollTo(0, index * screenHeight);
                }
            } else {
                window.scrollTo(0, initialScrollPosition);
            }

            var swipeDuration = endTime - startTime;
            var swipeSpeed = Math.abs(scrollDistance) / swipeDuration;

            if (swipeSpeed > 0.5) {
                if (scrollDistance > 0) {
                    window.scrollBy(0, screenHeight);
                    isScrolling = true;
                    setTimeout(function() {
                        isScrolling = false;
                    }, 500);
                }
            }
        }
    });

    container.on("touchmove", function(event) {
        var touchY = event.touches[0].clientY;
        var divs = $(".container > div");

        divs.each(function() {
            var rect = this.getBoundingClientRect();
            if (touchY >= rect.top && touchY <= rect.bottom) {
                var video = $(this).find("video")[0];
                if (video && !video.paused && video !== currentVideo) {
                    video.pause();
                }
            }
        });
    });

    container.on("dblclick", function(event) {
        var video = currentVideo.find("video")[0];
        if (video) {
            video.play();
            toggleLike(currentVideo);
        }
    });

    videos.forEach(function(videoSrc) {
        var div = $("<div></div>");
        var video = $("<video></video>");
        var pauseOverlay = $("<div class='pause-overlay'></div>");
        var pauseIcon = $("<i class='pause-icon fas fa-pause'></i>");
        var likeButton = $("<div class='like-button'></div>");

        video.attr("src", videoSrc);
        video.attr("loop", true);
        video.attr("preload", "auto");
        div.append(video);
        div.append(pauseOverlay);
        pauseOverlay.append(pauseIcon);
        div.append(likeButton);
        div.css("height", screenHeight + "px");
        container.append(div);

        div.on("click", function() {
            var videosInViewport = $(".container > div video");
            videosInViewport.each(function() {
                if (this !== video[0]) {
                    this.pause();
                    this.currentTime = 0;
                }
            });

            if (video[0].paused) {
                video[0].play();
                pauseOverlay.hide();
            } else {
                video[0].pause();
                pauseOverlay.show();
            }
        });

        video.on("timeupdate", function() {
            if (video[0].currentTime > 0 && video[0].paused) {
                pauseOverlay.show();
            }
        });

        likeButton.on("click", function(event) {
            event.stopPropagation();
            toggleLike(div);
        });

        div.on("scroll", function() {
            var rect = this.getBoundingClientRect();
            if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                currentVideo = $(this);
                if (video[0].paused) {
                    video[0].currentTime = 0;
                    setTimeout(function() {
                        video[0].play();
                    }, 100);
                }
            } else {
                if (currentVideo === $(this)) {
                    currentVideo = null;
                    video[0].pause();
                }
            }
        });
    });

    function toggleLike(div) {
        var likeButton = div.find(".like-button");
        likeButton.toggleClass("like-active");
    }
});
