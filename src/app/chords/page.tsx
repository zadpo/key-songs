"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// This is a mock function to simulate fetching song data
// In a real application, you would replace this with an API call
const fetchSongData = async (title: string) => {
  // Simulating API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock data
  return {
    title: title,
    artist: "Sample Artist",
    lyrics: `Here are the lyrics for ${title}\nVerse 1\nChorus\nVerse 2\nChorus`,
    chords: `Chords for ${title}:\nVerse: C G Am F\nChorus: F C G Am`,
  };
};

export default function ChordFinder() {
  const [searchTerm, setSearchTerm] = useState("");
  const [songData, setSongData] = useState<null | {
    title: string;
    artist: string;
    lyrics: string;
    chords: string;
  }>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchSongData(searchTerm);
      setSongData(data);
    } catch (error) {
      console.error("Error fetching song data:", error);
      setError("Failed to fetch song data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getChords = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/getChords");
      if (!res.ok) {
        throw new Error("Failed to fetch chords");
      }
      const { chords } = await res.json();
      console.log(chords);
      // You might want to do something with the chords here,
      // such as setting them in state or displaying them
    } catch (error) {
      console.error("Error fetching chords:", error);
      setError("Failed to fetch chords. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chord Finder</h1>
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter song title"
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>
      </form>
      <Button onClick={getChords} disabled={isLoading} className="mb-4">
        Get Chords
      </Button>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {songData && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {songData.title} - {songData.artist}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">Lyrics:</h3>
              <pre className="whitespace-pre-wrap">{songData.lyrics}</pre>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Chords</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap">{songData.chords}</pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
