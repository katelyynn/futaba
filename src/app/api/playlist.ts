"use client";

import { album } from '../types/album';
import { song } from '../types/song';
import { request, session } from './client';
import { getCoverArt } from './cover';
import { createStreamURL } from './player';

export async function getPlaylists(session: session) {
  const res = await request(session, "getPlaylists");

  const playlists = [];
  res.playlists.playlist.forEach(playlist => {
    const art = getCoverArt(session, playlist.coverArt);

    playlists.push({
      id: playlist.id,
      name: playlist.name,
      comment: playlist.comment,
      duration: playlist.duration,
      songs: playlist.songCount,
      created: playlist.created,
      art: art,
      changed: playlist.changed
    });
  });

  return playlists;
}

export async function getPlaylist(session: session, id: string) {
  const res = await request(session, "getPlaylist", { id });

  const playlist = res.playlist;

  const art = getCoverArt(session, playlist.coverArt);

  const songs: song[] = [];
  playlist.song.forEach(song => {
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
    });
  });

  return {
    id: playlist.id,
    name: playlist.name,
    comment: playlist.comment,
    duration: playlist.duration,
    songCount: playlist.songCount,
    created: playlist.created,
    changed: playlist.changed,
    art: art,
    songs
  };
}