document.addEventListener('DOMContentLoaded', () => {
    const libraryContainer = document.querySelector('.beat-grid');
    const library = JSON.parse(localStorage.getItem('musicLibrary')) || [];

    // 动态添加上传的音乐文件到页面中
    library.forEach(beat => {
        const beatElement = document.createElement('div');
        beatElement.classList.add('beat');
        beatElement.innerHTML = `
            <img src="${beat.coverSrc}" alt="${beat.title} Cover" class="beat-cover">
            <h3>${beat.title}</h3>
            <audio controls class="audio-player">
                <source src="${beat.musicSrc}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
            <button class="add-to-playlist" data-beat="${beat.title}" data-src="${beat.musicSrc}" data-cover="${beat.coverSrc}">Add to Playlist</button>
        `;
        libraryContainer.appendChild(beatElement);
    });

    const addToPlaylistButtons = document.querySelectorAll('.add-to-playlist');

    addToPlaylistButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const beatName = e.target.dataset.beat;
            const beatSrc = e.target.dataset.src;
            const beatCover = e.target.dataset.cover;
            addToPlaylist(beatName, beatSrc, beatCover);
        });
    });

    function addToPlaylist(beatName, beatSrc, beatCover) {
        let playlists = JSON.parse(localStorage.getItem('playlists')) || {};

        if (!playlists['My Playlist 1']) {
            playlists['My Playlist 1'] = [];
        }
        playlists['My Playlist 1'].push({ name: beatName, src: beatSrc, cover: beatCover });
        localStorage.setItem('playlists', JSON.stringify(playlists));
    }
});

