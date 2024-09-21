"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, Link as LinkIcon, Calendar, Play, Pause, SkipBack, SkipForward, Trash2 } from "lucide-react";
import { TrackUploadDialog } from "./TrackUpload";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import WaveSurfer from "wavesurfer.js";

interface Track {
  id: string;
  title: string;
  date: Date;
  type: "mp3" | "drive";
  fileUrl?: string;
  driveLink?: string;
  category: "Sunday Records" | "Back Tracks";
}

export function TrackList() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<"Sunday Records" | "Back Tracks">("Sunday Records");
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      const tracksCollection = collection(db, "tracks");
      const trackSnapshot = await getDocs(tracksCollection);
      const trackList = trackSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          type: data.type,
          fileUrl: data.fileUrl,
          driveLink: data.driveLink,
          date: data.date instanceof Date ? data.date : new Date(data.date),
          category: data.category || "Sunday Records",
        };
      }) as Track[];
      setTracks(trackList);
    };

    fetchTracks();
  }, []);

  const handleTrackUpload = (newTrack: Track) => {
    setTracks((prevTracks) => [...prevTracks, newTrack]);
  };

  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (currentTrackIndex !== null && currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentTrackIndex !== null && currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  };

  const handleDelete = async (trackId: string) => {
    await deleteDoc(doc(db, "tracks", trackId));
    setTracks((prevTracks) => prevTracks.filter((track) => track.id !== trackId));
    if (currentTrackIndex !== null && tracks[currentTrackIndex].id === trackId) {
      setCurrentTrackIndex(null);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (currentTrackIndex !== null && waveformRef.current) {
      const track = tracks[currentTrackIndex];

      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }

      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "rgb(200, 0, 200)",
        progressColor: "rgb(100, 0, 100)",
        url: track.fileUrl,
        barWidth: 2,
        barGap: 1,
        barRadius: 2,
        height: 100,
      });

      wavesurferRef.current.on("ready", () => {
        if (isPlaying) {
          wavesurferRef.current?.play();
        }
      });

      wavesurferRef.current.on("finish", () => {
        setIsPlaying(false);
      });

      return () => {
        if (wavesurferRef.current) {
          wavesurferRef.current.destroy();
        }
      };
    }
  }, [currentTrackIndex, tracks, isPlaying]);

  const filteredTracks = tracks.filter((track) => track.category === activeTab);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between gap-8">
        <CardTitle className="text-2xl font-bold">Track List</CardTitle>
        <TrackUploadDialog onUpload={handleTrackUpload} />
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "Sunday Records" | "Back Tracks")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="Sunday Records">Sunday Records</TabsTrigger>
            <TabsTrigger value="Back Tracks">Back Tracks</TabsTrigger>
          </TabsList>
          <TabsContent value="Sunday Records">
            <TrackListContent
              tracks={filteredTracks}
              currentTrackIndex={currentTrackIndex}
              isPlaying={isPlaying}
              onPlay={(index) => {
                setCurrentTrackIndex(index);
                setIsPlaying(true);
              }}
              onDelete={handleDelete}
            />
          </TabsContent>
          <TabsContent value="Back Tracks">
            <TrackListContent
              tracks={filteredTracks}
              currentTrackIndex={currentTrackIndex}
              isPlaying={isPlaying}
              onPlay={(index) => {
                setCurrentTrackIndex(index);
                setIsPlaying(true);
              }}
              onDelete={handleDelete}
            />
          </TabsContent>
        </Tabs>
        <div className="mt-4">
          <div ref={waveformRef} className="w-full bg-white rounded-md" />
        </div>
        <div className="mt-4 flex justify-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            disabled={currentTrackIndex === null || currentTrackIndex === 0}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handlePlayPause}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={currentTrackIndex === null || currentTrackIndex === tracks.length - 1}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface TrackListContentProps {
  tracks: Track[];
  currentTrackIndex: number | null;
  isPlaying: boolean;
  onPlay: (index: number) => void;
  onDelete: (id: string) => void;
}

function TrackListContent({ tracks, currentTrackIndex, isPlaying, onPlay, onDelete }: TrackListContentProps) {
  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
      {tracks.length === 0 ? (
        <p className="text-center text-muted-foreground">No tracks uploaded yet.</p>
      ) : (
        tracks.map((track, index) => (
          <Card key={track.id} className="mb-4 shadow-none">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                {track.type === "mp3" ? (
                  <Music className="h-6 w-6 text-primary" />
                ) : (
                  <LinkIcon className="h-6 w-6 text-primary" />
                )}
                <div>
                  <h3 className="font-semibold">{track.title}</h3>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {track.date.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={() => onPlay(index)}>
                  {currentTrackIndex === index && isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="outline" size="icon" onClick={() => onDelete(track.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </ScrollArea>
  );
}
