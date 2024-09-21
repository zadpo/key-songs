"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Music, Link as LinkIcon, Calendar } from "lucide-react";
import { TrackUploadDialog } from "./TrackUpload";

interface Track {
  id: string;
  title: string;
  date: Date;
  type: "mp3" | "drive";
  fileUrl?: string;
  driveLink?: string;
}

export function TrackList() {
  const [tracks, setTracks] = useState<Track[]>([]);

  const handleTrackUpload = (newTrack: Omit<Track, "id">) => {
    setTracks((prevTracks) => [
      ...prevTracks,
      { ...newTrack, id: Date.now().toString() }, // Using timestamp as a simple id
    ]);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Uploaded Tracks</CardTitle>
        <TrackUploadDialog onUpload={handleTrackUpload} />
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          {tracks.length === 0 ? (
            <p className="text-center text-muted-foreground">No tracks uploaded yet.</p>
          ) : (
            tracks.map((track) => (
              <Card key={track.id} className="mb-4">
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
                  <Button variant="outline" size="sm">
                    {track.type === "mp3" ? "Play" : "Open Link"}
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
