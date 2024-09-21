export interface Song {
  id: string;
  title: string;
  origSinger: string;
  worshipLeader: string;
  key: string;
}

export interface ExtendedSong {
  id: string;
  title: string;
  origSinger: string;
  worshipLeaders: string[];
  keys: { leader: string; key: string }[];
  createdAt: number;
}
