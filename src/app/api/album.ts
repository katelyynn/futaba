"use client";

import { album } from '../types/album';
import { song } from '../types/song';
import { request, session } from './client';
import { getCoverArt } from './cover';
import { createStreamURL } from './player';

export async function getAlbums(session: session, size = 100) {
  console.log('getAlbums');
  const res = await request(session, "getAlbumList", { type: "recent", size });

  console.info('res', res);

  const albums = [];
  res.albumList.album.forEach(album => {
    const art = getCoverArt(session, album.id);

    albums.push({
      id: album.id,
      name: album.name,
      artists: album.artists,
      duration: album.duration,
      songs: album.songCount,
      played: album.played,
      plays: album.plays,
      created: album.created,
      art: art,
      year: album.year,
      explicit: album.explicitStatus,
      starred: album.starred
    });
  });

  return albums;
}

export async function getAlbum(session: session, id: string) {
  const res = await request(session, "getAlbum", { id });

  const album = res.album;
  console.info('album req', album);

  const art = getCoverArt(session, album.coverArt);

  const songs: Record<string, song[]> = {};
  const songsList: song[] = [];
  album.song.forEach(song => {
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

    const disc = song.discNumber || 0;

    if (!songs[disc]) songs[disc] = [];

    const newSong = {
      id: song.id,
      name: song.title,
      artists: artists,
      duration: song.duration,
      played: song.played,
      plays: song.playCount,
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
      art: songArt,
      starred: song.starred
    }

    songsList.push(newSong);
    songs[disc].push(newSong);
  });

  const type = album.isCompilation ? 'compilation' : album.releaseTypes[0]?.toLowerCase().trim() || 'album';

  return {
    id: album.id,
    name: album.name,
    artists: album.artists,
    art: art,
    songs,
    songsList: songsList,
    songCount: album.songCount,
    played: album.played,
    plays: album.plays,
    type,
    genres: album.genres,
    duration: album.duration,
    discTitles: album.discTitles,
    year: album.year,
    explicit: album.explicitStatus
  };
}

export async function getAlbumInfo(session: session, id: string) {
  const res = await request(session, "getAlbumInfo2", { id });

  return res.albumInfo;
}