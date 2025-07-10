$(document).ready(function () {
  const allTracks = [
    { id: 1, title: "Adele - Easy On Me", file: "1.mp3", cover: "Adele.jpg" },
    { id: 2, title: "The Weeknd - Blinding Lights", file: "2.mp3", cover: "weeknd.jpg" },
    { id: 3, title: "Eminem - Lose Yourself", file: "3.mp3", cover: "eminem.jpg" },
    { id: 4, title: "Taylor Swift - Blank Space", file: "4.mp3", cover: "Taylor.jpg" },
    { id: 5, title: "Taylor Swift - Love Story", file: "5.mp3", cover: "Taylor-2.jpg" },
    { id: 6, title: "Ed Sheeran - Shape of You", file: "6.mp3", cover: "Ed-sheeran.jpg" },
  ];

  let isShuffle = false;
  let isRepeat = false;

  const $trackList = $("#trackList");
  let currentIndex = 0;
  let playing = false;
  let audio = new Audio();

  const $playBtn = $("#playPauseBtn");
  const $prevBtn = $("#prevBtn");
  const $nextBtn = $("#nextBtn");
  const $shuffleBtn = $("#shuffleBtn");
  const $repeatBtn = $("#repeatBtn");

  allTracks.forEach(track => {
    $trackList.append(`
      <div class="col-6 col-lg-3">
        <div class="card music-card mb-3 p-2 d-flex flex-row align-items-center">
          <div class="music-img">
            <img src="./asates/${track.cover}" class="img-fluid" alt="${track.title}" />
          </div>
          <div class="ms-3 flex-grow-1">
            <h6 class="text-white mb-2 track-title">${track.title}</h6>
            <button class="btn btn-success btn-sm track-btn" data-id="${track.id}">▶ Play</button>
          </div>
        </div>
      </div>
    `);
  });

  function playTrackById(id) {
    const index = allTracks.findIndex(t => t.id === id);
    if (index === -1) return;
    currentIndex = index;
    const track = allTracks[currentIndex];
    playAudio(track.file, track.title, track.cover);
  }

  function playAudio(file, title, cover) {
    audio.src = `./music/${file}`;
    $("#currentTitle").text(title);
    $("#currentCover").attr("src", `./asates/${cover}`);
    $(".song-title").text("Now Playing");
    $(".musicplayer").show();

    audio.play();
    playing = true;
    $playBtn.text("❚❚");
  }

  $playBtn.click(function () {
    if (playing) {
      audio.pause();
      $(this).text("▶");
    } else {
      audio.play();
      $(this).text("❚❚");
    }
    playing = !playing;
  });

  $prevBtn.click(function () {
    currentIndex = (currentIndex - 1 + allTracks.length) % allTracks.length;
    playTrackById(allTracks[currentIndex].id);
  });

  $nextBtn.click(function () {
    if (isShuffle) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * allTracks.length);
      } while (randomIndex === currentIndex && allTracks.length > 1);
      currentIndex = randomIndex;
    } else {
      currentIndex = (currentIndex + 1) % allTracks.length;
    }
    playTrackById(allTracks[currentIndex].id);
  });

  $(document).on("click", ".track-btn", function () {
    const id = parseInt($(this).data("id"));
    playTrackById(id);
  });

  $(audio).on("timeupdate", function () {
    const current = audio.currentTime;
    const total = audio.duration;
    if (!isNaN(total)) {
      $("#currentTime").text(formatTime(current));
      $("#duration").text(formatTime(total));
      $("#progressBar").css("width", `${(current / total) * 100}%`);
    }
  });

  let isDragging = false;

$("#progressContainer").on("mousedown touchstart", function (e) {
  isDragging = true;
  seek(e);
});

$(document).on("mousemove touchmove", function (e) {
  if (isDragging) {
    seek(e);
  }
});

$(document).on("mouseup touchend", function () {
  if (isDragging) {
    isDragging = false;
  }
});

function seek(e) {
  const container = $("#progressContainer");
  const offset = container.offset().left;
  const width = container.width();
  let pageX = e.pageX;

  if (e.type.startsWith("touch")) {
    pageX = e.originalEvent.touches[0].pageX;
  }

  const percent = Math.min(Math.max(0, (pageX - offset) / width), 1);
  const duration = audio.duration;
  if (!isNaN(duration)) {
    audio.currentTime = percent * duration;
    $("#progressBar").css("width", `${percent * 100}%`);
  }
}


  $(audio).on("ended", function () {
    if (isRepeat) {
      audio.currentTime = 0;
      audio.play();
    } else {
      $nextBtn.click();
    }
  });

  function formatTime(time) {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
  }

  $shuffleBtn.click(function () {
    isShuffle = !isShuffle;
    $(this).toggleClass("btn-success btn-outline-light");
  });

  $repeatBtn.click(function () {
    isRepeat = !isRepeat;
    $(this).toggleClass("btn-success btn-outline-light");
  });

  const playlists = [
    {
      title: "🎧 Chill Vibes",
      cover: "Chill Vibes.jpg",
      tracks: [
        { title: "Chill Track 1", file: "chill1.mp3", cover: "chill1.jpg" },
        { title: "Chill Track 2", file: "chill2.mp3", cover: "chill2.jpg" }
      ]
    },
    {
      title: "🔥 Workout Beats",
      cover: "Workout Beats.jpg",
      tracks: [
        { title: "Workout Track 1", file: "workout1.mp3", cover: "workout1.jpg" },
        { title: "Workout Track 2", file: "workout2.mp3", cover: "workout2.jpg" }
      ]
    },
    {
      title: "🌙 Night Mood",
      cover: "Night Mood.jpg",
      tracks: [
        { title: "Night Track 1", file: "night1.mp3", cover: "night1.jpg" }
      ]
    }
  ];

  $("#playlistSection").html(`
    <hr class="section-divider my-5" />
    <section class="container my-5 py-5" id="playlist">
      <h2 class="text-white mb-4" style="font-size: 28px; font-weight: bold; border-left: 5px solid #B13BFF; padding-left: 15px;">
        🎶 Your Playlist
      </h2>
      <div class="row g-4" id="playlistContent"></div>
    </section>
  `);

  playlists.forEach((item, index) => {
    $("#playlistContent").append(`
      <div class="col-12 mb-4">
        <div class="card music-card p-3">
          <div class="d-flex align-items-center justify-content-between" style="cursor:pointer;" onclick="togglePlaylist(${index})">
            <div class="d-flex align-items-center">
              <img src="./asates/${item.cover}" class="rounded me-3" style="width: 60px; height: 60px; object-fit: cover;">
              <h5 class="text-white mb-0">${item.title}</h5>
            </div>
            <i class="bi bi-chevron-down text-white"></i>
          </div>
          <div class="playlist-tracks mt-3" id="playlist-tracks-${index}" style="display:none;"></div>
        </div>
      </div>
    `);
  });

  window.togglePlaylist = function (index) {
    const container = $(`#playlist-tracks-${index}`);
    if (container.is(":visible")) {
      container.slideUp();
      return;
    }

    $(".playlist-tracks").slideUp();
    container.html("");

    playlists[index].tracks.forEach(track => {
      container.append(`
        <div class="d-flex align-items-center mb-3">
          <img src="./asates/${track.cover}" class="rounded" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
          <div class="flex-grow-1">
            <h6 class="text-white mb-1">${track.title}</h6>
            <button class="btn btn-success btn-sm play-playlist-track" data-src="${track.file}" data-title="${track.title}" data-cover="${track.cover}">▶ Play</button>
          </div>
        </div>
      `);
    });

    container.slideDown();
  };

  $(document).on("click", ".play-playlist-track", function () {
    const file = $(this).data("src");
    const title = $(this).data("title");
    const cover = $(this).data("cover");

    playAudio(file, title, cover);
  });
});
