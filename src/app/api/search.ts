import { request, session } from './client';
import { getCoverArt } from './cover';
import { createStreamURL } from './player';

export async function search(session: session, query: string) {
  const res = await request(session, "search3", { query });

  const results = res.searchResult3;

  const albums = [];
  const artists = [];
  const songs = [];

  if (results.album) {
    results.album.forEach(album => {
      const art = getCoverArt(session, album.id);
      const type = album.isCompilation ? 'compilation' : album.releaseTypes[0]?.toLowerCase().trim() || 'album';

      albums.push({
        id: album.id,
        name: album.name,
        artists: album.artists,
        duration: album.duration,
        songs: album.songCount,
        played: album.played,
        plays: album.plays,
        type,
        created: album.created,
        art: art,
        date: album.releaseDate,
        year: album.year
      });
    })
  }

  if (results.artist) {
    results.artist.forEach(artist => {
      artists.push({
        id: artist.id,
        art: artist.artistImageUrl,
        name: artist.name,
        albums: artist.albumCount,
        roles: artist.roles
      });
    });
  }

  if (results.song) {
    results.song.forEach(song => {
      const songArt = getCoverArt(session, song.coverArt);

      const artists = [];
      const unrelated = [];

      song.contributors.forEach(contrib => {
        unrelated.push(contrib.artist.id);
      });

      song.artists.forEach(artist => {
        //if (artist.name == composer || display.includes(artist.name)) return;
        if (unrelated.includes(artist.id)) return;

        artists.push(artist);
      });

      songs.push({
        id: song.id,
        name: song.title,
        artists: artists,
        duration: song.duration,
        played: song.played,
        plays: song.plays,
        created: song.created,
        comment: song.comment,
        contentType: song.contentType,
        bitDepth: song.bitDepth,
        bitRate: song.bitRate,
        bpm: song.bpm,
        channelCount: song.channelCount,
        explicit: song.explicitStatus,
        genres: song.genres,
        index: song.track,
        suffix: song.suffix,
        path: song.path,
        url: createStreamURL(song.id, session),
        albumId: song.albumId,
        art: songArt
      });
    });
  }

  return {
    albums,
    artists,
    songs
  };
}