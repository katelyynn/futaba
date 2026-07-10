"use client";

import { album } from '../types/album';
import { playlist } from '../types/playlist';
import { song } from '../types/song';
import { request, session } from './client';
import { getCoverArt } from './cover';
import { createStreamURL } from './player';

export async function getPlaylists(session: session): Promise<playlist[]> {
  const res = await request(session, "getPlaylists");

  const playlists: playlist[] = [];
  /* @ts-expect-error guh */
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

  playlists.sort((a, b) => new Date(b.changed).getTime() - new Date(a.changed).getTime());

  return playlists;
}

export async function getPlaylist(session: session, id: string) {
  const res = await request(session, "getPlaylist", { id });

  const playlist = res.playlist;

  const art = getCoverArt(session, playlist.coverArt);

  const songs: song[] = [];
  /* @ts-expect-error guh */
  playlist.entry?.forEach((song, index) => {
    const songArt = getCoverArt(session, song.coverArt);

    /* @ts-expect-error guh */
    const artists = [];
    /* @ts-expect-error guh */
    const unrelated = [];

    /* @ts-expect-error guh */
    song.contributors.forEach(contrib => {
      unrelated.push(contrib.artist.id);
    });

    /* @ts-expect-error guh */
    song.artists.forEach(artist => {
      //if (artist.name == composer || display.includes(artist.name)) return;
      /* @ts-expect-error guh */
      if (unrelated.includes(artist.id)) return;

      artists.push(artist);
    });

    songs.push({
      id: song.id,
      name: song.title,
      /* @ts-expect-error guh */
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
      explicit: song.explicitStatus != '',
      genres: song.genres,
      index: index + 1,
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
