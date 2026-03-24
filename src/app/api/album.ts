"use client";

import { request, session } from './client';
import { getCoverArt } from './cover';

export async function getArtists(session: session) {
  console.log('getArtists');
  const res = await request(session, "getArtists");

  console.info('res', res);

  return res.artists.index.flatMap(group =>
    group.artist.map(artist => ({
      id: artist.id,
      art: artist.artistImageUrl,
      name: artist.name,
      albums: artist.albumCount,
      roles: artist.roles
    }))
  );
}

export async function getAlbum(session: session, id: string) {
  const res = await request(session, "getAlbum", { id });

  const album = res.album;
  console.info('album req', album);

  const art = getCoverArt(session, album.coverArt);

  const songs = [];
  album.song.forEach(song => {
    songs.push({
      id: song.id,
      name: song.title,
      artists: song.artists,
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
      path: song.path
    });
  });

  const type = album.releaseTypes[0] || 'album';

  return {
    id: album.id,
    name: album.name,
    artists: album.artists,
    art: art,
    songs,
    songCount: album.songCount,
    played: album.played,
    plays: album.plays,
    type,
    compilation: album.isCompilation,
    genres: album.genres,
    duration: album.duration,
    discTitles: album.discTitles,
    year: album.year,
    explicit: album.explicitStatus
  };
}