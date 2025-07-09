$(document).ready(function () {
  const tracks = [
    { id: 1, title: "Adele - Easy On Me", file: "1.mp3", cover: "Adele.jpg" },
    { id: 2, title: "The Weeknd - Blinding Lights", file: "2.mp3", cover: "weeknd.jpg" },
    { id: 3, title: "Eminem - Lose Yourself", file: "3.mp3", cover: "eminem.jpg" },
  ];

  const $trackList = $("#trackList");

  $.each(tracks, function (index, track) {
    $trackList.append(`
      <div class="col-12">
        <div class="card music-card mb-3 p-2 d-flex flex-row align-items-center">
          <div class="music-img">
            <img src="./asates/${track.cover}" class="img-fluid" alt="${track.title}" />
          </div>
          <div class="ms-3 flex-grow-1">
            <h5 class="text-white mb-2">${track.title}</h5>
            <button class="btn btn-success btn-sm track-btn" data-id="${track.id}">▶ Play</button>
          </div>
        </div>
      </div>
    `);
  });

  let currentIndex = 0;
  let audio = new Audio();
  let playing = false;

  const $playBtn = $("#playPauseBtn");
  const $prevBtn = $("#prevBtn");
  const $nextBtn = $("#nextBtn");

  function playTrack(index) {
    currentIndex = tracks.findIndex(t => t.id === index);
    const track = tracks[currentIndex];

    audio.src = `./music/${track.file}`;
    $("#currentTitle").text(track.title);
    $("#currentCover").attr("src", `./asates/${track.cover}`);
    $(".song-title").text("Now Playing");
    audio.play();
    $playBtn.text("⏸️");
    playing = true;
  }

  $(document).on("click", ".track-btn", function () {
    const id = parseInt($(this).data("id"));
    playTrack(id);
  });

  $playBtn.click(function () {
    if (playing) {
      audio.pause();
      $(this).text("▶️");
    } else {
      audio.play();
      $(this).text("⏸️");
    }
    playing = !playing;
  });

  $prevBtn.click(function () {
    currentIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    playTrack(tracks[currentIndex].id);
  });

  $nextBtn.click(function () {
    currentIndex = (currentIndex + 1) % tracks.length;
    playTrack(tracks[currentIndex].id);
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

  function formatTime(time) {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
  }
});
