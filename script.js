const videoContainer = document.getElementById('videoContainer');
let currentVideoIndex = 0;
let videoContainers = [];

document.addEventListener('DOMContentLoaded', function () {
    // Отправляем запрос на сервер при загрузке страницы
    sendRequestToServer();
});

function sendRequestToServer() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://izaceziri.pythonanywhere.com/get-new-videos?id=123', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                handleNewVideos(response);
            } else {
                console.error('Error:', xhr.status);
            }
        }
    };
    xhr.send();
}

function handleNewVideos(newVideos) {
    // Удаляем текущие видео
    videoContainer.innerHTML = '';
    videoContainers = [];

    // Создаем новые видео контейнеры
    for (let i = 0; i < newVideos.length; i++) {
        const videoDiv = document.createElement('div');
        videoDiv.classList.add('video-container');
        const video = document.createElement('video');
        video.src = newVideos[i].src;
        video.setAttribute('preload', 'auto');
        videoDiv.appendChild(video);

        const controlsContainer = document.createElement('div');
        controlsContainer.classList.add('controls-container');

        const likeButton = document.createElement('button');
        likeButton.classList.add('like-button');
        likeButton.addEventListener('click', function(event) {
            event.stopPropagation();
            newVideos[i].liked = !newVideos[i].liked;
            this.classList.toggle('liked');
        });

        const pauseOverlay = document.createElement('div');
        pauseOverlay.classList.add('pause-overlay');
        video.addEventListener('click', function() {
            if (video.paused) {
                video.play();
                pauseOverlay.style.display = 'none';
            } else {
                video.pause();
                pauseOverlay.style.display = 'block';
            }
        });

        controlsContainer.appendChild(likeButton);
        controlsContainer.appendChild(pauseOverlay);

        videoDiv.appendChild(controlsContainer);
        videoContainer.appendChild(videoDiv);
        videoContainers.push(videoDiv);
    }

    // Запускаем первое видео
    loadVideo(currentVideoIndex);
}

function loadVideo(index) {
    for (let i = 0; i < videoContainers.length; i++) {
        const video = videoContainers[i].querySelector('video');
        if (i === index) {
            videoContainers[i].style.display = 'flex';
            videoContainers[i].style.zIndex = '1';
            video.play();
        } else {
            videoContainers[i].style.display = 'none';
            videoContainers[i].style.zIndex = '0';
            video.pause();
        }
    }
    currentVideoIndex = index;
}

let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(event) {
    touchStartY = event.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(event) {
    touchEndY = event.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const screenHeight = window.innerHeight;
    const threshold = 0.1 * screenHeight;

    if (Math.abs(touchEndY - touchStartY) < threshold) {
        return;
    }

    if (touchEndY < touchStartY) {
        if (currentVideoIndex < videoContainers.length - 1) {
            currentVideoIndex++;
            loadVideo(currentVideoIndex);
        }
    }

    if (touchEndY > touchStartY) {
        if (currentVideoIndex > 0) {
            currentVideoIndex--;
            loadVideo(currentVideoIndex);
        }
    }
}

document.addEventListener('touchmove', function(event) {
    event.preventDefault();
}, { passive: false });

let lastClickTime = 0;
document.addEventListener('click', function(event) {
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - lastClickTime;
    if (timeDifference < 300) {
        const clickedVideo = event.target.closest('.video-container');
        if (clickedVideo) {
            const likeButton = clickedVideo.querySelector('.like-button');
            likeButton.classList.add('show');
            setTimeout(() => {
                likeButton.classList.remove('show');
            }, 500);
            videos[currentVideoIndex].liked = !videos[currentVideoIndex].liked;
            likeButton.classList.toggle('liked');
        }
    }
    lastClickTime = currentTime;
});
