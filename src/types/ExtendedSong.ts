export interface ExtendedSong {
  id: string;
  title: string;
  origSinger: string;
  worshipLeaders: string[];
  keys: { leader: string; key: string }[];
}
