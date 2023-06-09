const youtubeScriptTag = document.createElement('script');
youtubeScriptTag.src = 'https://www.youtube.com/iframe_api';

if (document.querySelector('.yt-video')) {
  document.body.appendChild(youtubeScriptTag);
}

window.onYouTubeIframeAPIReady = () => {
  ytStart();
};

function ytStart() {
  window.allYtVideoEls = document.querySelectorAll('.yt-video');
  window.arrayYtInstances = [];

  allYtVideoEls.forEach((videoEl, index) => {
    const willIframeEl = videoEl.querySelector('.will-iframe');
    const ytPlayer = new YT.Player(willIframeEl, {
      videoId: videoEl.dataset.videoid,
      playerVars: {
        controls: 0,
      },
      events: {
        onReady: (event) => {
          videoEl.addEventListener('click', () => {
            const isVideoPlaying = Number(videoEl.dataset.playing);

            // stop all videos
            window.arrayYtInstances.forEach((item, i) => {
              item.stopVideo();
              item.getIframe().parentElement.dataset.playing = '0';
            });

            if (isVideoPlaying) {
              event.target.stopVideo();
              videoEl.dataset.playing = '0';
            } else {
              event.target.playVideo();
              videoEl.dataset.playing = '1';
            }
          });
        },

        onStateChange: (event) => {},
      },
    });

    window.arrayYtInstances.push(ytPlayer);
  });
}

{
  /* <div
  class="yt-video"
  data-videoid="TaINndH-bZ0"
  data-playing="0"
>
  <div class="will-iframe"></div>
</div> */
}
