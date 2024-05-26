document.addEventListener('DOMContentLoaded', () => {
    const playlists = JSON.parse(localStorage.getItem('playlists')) || {};
    const playlistAudio = document.getElementById('playlist-audio');
    const currentTrackCoverImg = document.getElementById('current-track-cover-img');
    const currentTrackTitle = document.getElementById('current-track-title');
    let currentTrackIndex = 0;
    let isShuffle = false;
    let isRepeat = false;
    let isPlaying = false;

    function updatePlaylists() {
        const playlistTracks = document.querySelector('.playlist-tracks');
        playlistTracks.innerHTML = '';

        if (playlists['My Playlist 1']) {
            playlists['My Playlist 1'].forEach((beat, index) => {
                const li = document.createElement('li');
                li.classList.add('playlist-track');
                li.dataset.index = index;

                const dragHandle = document.createElement('span');
                dragHandle.classList.add('drag-handle');
                dragHandle.innerHTML = '&#9776;'; // Drag icon (☰)

                const trackName = document.createElement('span');
                trackName.textContent = beat.name;

                const playButton = document.createElement('button');
                playButton.innerHTML = '&#9658;'; // Play icon
                playButton.classList.add('play-beat');
                playButton.dataset.src = beat.src;
                playButton.dataset.cover = beat.cover; // 设置封面图片路径
                playButton.dataset.name = beat.name;
                playButton.addEventListener('click', () => {
                    playTrack(index);
                });

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete-beat');
                deleteButton.addEventListener('click', () => {
                    playlists['My Playlist 1'].splice(index, 1);
                    localStorage.setItem('playlists', JSON.stringify(playlists));
                    updatePlaylists();
                });

                li.appendChild(dragHandle);
                li.appendChild(trackName);
                li.appendChild(playButton);
                li.appendChild(deleteButton);
                playlistTracks.appendChild(li);
            });
        }
    }

    function playTrack(index) {
        if (playlists['My Playlist 1'] && playlists['My Playlist 1'][index]) {
            currentTrackIndex = index;
            const track = playlists['My Playlist 1'][index];
            playlistAudio.src = track.src;
            currentTrackCoverImg.src = track.cover;
            currentTrackTitle.textContent = track.name;
            playlistAudio.play();
            isPlaying = true;
            updatePlayPauseButton();
        }
    }

    function togglePlayPause() {
        if (isPlaying) {
            playlistAudio.pause();
        } else {
            playlistAudio.play();
        }
        isPlaying = !isPlaying;
        updatePlayPauseButton();
    }

    function updatePlayPauseButton() {
        const playPauseButton = document.querySelector('.play');
        playPauseButton.innerHTML = isPlaying ? '&#10074;&#10074;' : '&#9658;';
    }

    document.querySelector('.play-playlist').addEventListener('click', () => {
        playTrack(0);
    });

    document.querySelector('.play').addEventListener('click', togglePlayPause);

    document.querySelector('.next').addEventListener('click', () => {
        if (isShuffle) {
            currentTrackIndex = Math.floor(Math.random() * playlists['My Playlist 1'].length);
        } else {
            currentTrackIndex = (currentTrackIndex + 1) % playlists['My Playlist 1'].length;
        }
        playTrack(currentTrackIndex);
    });

    document.querySelector('.prev').addEventListener('click', () => {
        if (isShuffle) {
            currentTrackIndex = Math.floor(Math.random() * playlists['My Playlist 1'].length);
        } else {
            currentTrackIndex = (currentTrackIndex - 1 + playlists['My Playlist 1'].length) % playlists['My Playlist 1'].length;
        }
        playTrack(currentTrackIndex);
    });

    document.querySelector('.shuffle').addEventListener('click', () => {
        isShuffle = !isShuffle;
        document.querySelector('.shuffle').classList.toggle('active');
    });

    document.querySelector('.repeat').addEventListener('click', () => {
        isRepeat = !isRepeat;
        document.querySelector('.repeat').classList.toggle('active');
    });

    playlistAudio.addEventListener('ended', () => {
        if (isRepeat) {
            currentTrackIndex = (currentTrackIndex + 1) % playlists['My Playlist 1'].length;
            playTrack(currentTrackIndex);
        } else if (currentTrackIndex < playlists['My Playlist 1'].length - 1) {
            currentTrackIndex++;
            playTrack(currentTrackIndex);
        }
    });

    updatePlaylists();

    // Initialize Sortable
    const sortable = new Sortable(document.querySelector('.playlist-tracks'), {
        animation: 150,
        handle: '.drag-handle',
        onEnd: function (evt) {
            const oldIndex = evt.oldIndex;
            const newIndex = evt.newIndex;
            playlists['My Playlist 1'].splice(newIndex, 0, playlists['My Playlist 1'].splice(oldIndex, 1)[0]);
            localStorage.setItem('playlists', JSON.stringify(playlists));
            updatePlaylists();
        }
    });
});

