import { album } from '../types/album.ts';
import { artist } from '../types/artist.ts';
import type { song } from '../types/song.ts';
import { request } from './client.ts';
import type { session } from './client.ts';
import { getCoverArt } from './cover.ts';
import { createStreamURL } from './player.ts';

export async function search(session: session, query: string) {
  const res = await request(session, "search3", { query, artistCount: 10 });

  const results = res.searchResult3;

  const albums: album[] = [];
  const artists: artist[] = [];
  const songs: song[] = [];

  if (results.album) {
    /* @ts-expect-error guhhh */
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
        year: album.year,
        starred: album.starred,
        explicit: false
      });
    })
  }

  if (results.artist) {
    /* @ts-expect-error guhhh */
    results.artist.forEach(artist => {
      artists.push({
        id: artist.id,
        art: artist.artistImageUrl,
        name: artist.name,
        albums: artist.albumCount,
        songs: artist.songCount,
        created: artist.created
      });
    });
  }

  if (results.song) {
    /* @ts-expect-error guhhh */
    results.song.forEach(song => {
      const songArt = getCoverArt(session, song.coverArt);

      /* @ts-expect-error guhhh */
      const artists = [];
      /* @ts-expect-error guhhh */
      const unrelated = [];

      /* @ts-expect-error guhhh */
      song.contributors.forEach(contrib => {
        unrelated.push(contrib.artist.id);
      });

      /* @ts-expect-error guhhh */
      song.artists.forEach(artist => {
        //if (artist.name == composer || display.includes(artist.name)) return;
        /* @ts-expect-error guhhh */
        if (unrelated.includes(artist.id)) return;

        artists.push(artist);
      });

      songs.push({
        id: song.id,
        name: song.title,
        /* @ts-expect-error guhhh */
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
        explicit: song.explicitStatus != '',
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
