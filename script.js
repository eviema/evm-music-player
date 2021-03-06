const image = document.querySelector("img");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const music = document.querySelector("audio");
const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const prevBtn = document.getElementById("prev");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const loopBtn = document.getElementById("loop");
const shuffleBtn = document.getElementById("shuffle");

const songs = [
  {
    name: "jacinto-1",
    displayName: "Electric Chill Machine",
    artist: "Jacinto Design",
  },
  {
    name: "jacinto-2",
    displayName: "Seven Nation Army (Remix)",
    artist: "Jacinto Design",
  },
  {
    name: "jacinto-3",
    displayName: "Goodnight, Disco Queen",
    artist: "Jacinto Design",
  },
  {
    name: "metric-1",
    displayName: "Front Row (Remix)",
    artist: "Metric/Jacinto Design",
  },
];

// Play / pause song

let isPlaying = false;

function playSong() {
  isPlaying = true;
  playBtn.classList.replace("fa-play", "fa-pause");
  playBtn.setAttribute("title", "Pause");
  music.play();
}

function pauseSong() {
  isPlaying = false;
  playBtn.classList.replace("fa-pause", "fa-play");
  playBtn.setAttribute("title", "Play");
  music.pause();
}

playBtn.addEventListener("click", () => (isPlaying ? pauseSong() : playSong()));

// Load song

function loadSong(song) {
  // * textContent vs innerText:
  // * https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent#differences_from_innertext
  // * An important difference to note:
  // * innerText triggers a reflow/repaint EVERY reload, which can be computationally expensive,
  // * whereas textContent does only when text content changes.
  title.textContent = song.displayName;
  artist.textContent = song.artist;
  music.src = `music/${song.name}.mp3`;
  image.src = `img/${song.name}.jpg`;
}

let songIndex = 2;
let isShuffle = false;

function genRandomIndex() {
  // Generate random song index
  const maxIndex = songs.length - 1;
  const minIndex = 0;
  let randomIndex = (Math.random() * (maxIndex - minIndex + 1)) << 0;
  // if same as last songIndex, use songIndex + 1
  randomIndex = randomIndex === songIndex ? songIndex + 1 : randomIndex;
  return randomIndex;
}

function loadPrevSong() {
  if (isShuffle) {
    songIndex = genRandomIndex();
  } else {
    songIndex = songIndex === 0 ? songs.length - 1 : songIndex - 1;
  }
  loadSong(songs[songIndex]);
  playSong();
}

function loadNextSong() {
  if (isShuffle) {
    songIndex = genRandomIndex();
  } else {
    songIndex = songIndex === songs.length - 1 ? 0 : songIndex + 1;
  }
  loadSong(songs[songIndex]);
  playSong();
}

prevBtn.addEventListener("click", loadPrevSong);
nextBtn.addEventListener("click", loadNextSong);

// Toggle: Shuffle next song
function toggleShuffle() {
  isShuffle = !isShuffle;
  shuffleBtn.style.color = isShuffle ? "#2c2c2c" : "#818181";
  if (isShuffle) {
    music.loop = false;
    loopBtn.classList.replace("loop-active", "loop-inactive");
  }
}

shuffleBtn.addEventListener("click", toggleShuffle);

// Update progress bar & time

// Helper function: Format time in seconds (e.g. 126.43585) into minutes (e.g. 2:06)
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  return `${minutes}:${seconds}`;
}

function updateProgressBar(e) {
  if (isPlaying && e?.srcElement?.duration) {
    const { currentTime, duration } = e.srcElement;
    // Update progress bar width
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    // Update duration & current time display
    durationEl.textContent = formatTime(duration);
    currentTimeEl.textContent = formatTime(currentTime);
  }
}

function setProgressBar(e) {
  if (isPlaying) {
    const {
      offsetX: clickX,
      srcElement: { clientWidth: barWidth },
    } = e;
    const { duration } = music;
    music.currentTime = (clickX / barWidth) * duration;
  }
}

music.addEventListener("timeupdate", updateProgressBar);
progressContainer.addEventListener("click", setProgressBar);

// Auto play next song
music.addEventListener("ended", loadNextSong);

// Toggle: Loop current song
function toggleLoop() {
  music.loop = !music.loop;
  if (music.loop) {
    isShuffle = false;
    shuffleBtn.style.color = "#818181";
    loopBtn.classList.replace("loop-inactive", "loop-active");
  } else {
    loopBtn.classList.replace("loop-active", "loop-inactive");
  }
}

loopBtn.addEventListener("click", toggleLoop);

// On load
loadSong(songs[songIndex]);
