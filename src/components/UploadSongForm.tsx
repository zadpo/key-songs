"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function UploadSongForm() {
  const [title, setTitle] = useState("");
  const [origSinger, setOrigSinger] = useState("");
  const [worshipLeader, setWorshipLeader] = useState("");
  const [key, setKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/upload-song", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, origSinger, worshipLeader, key }),
      });

      if (!response.ok) {
        throw new Error("Failed to upload song");
      }

      setSuccess("Song uploaded successfully");
      setTitle("");
      setOrigSinger("");
      setWorshipLeader("");
      setKey("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Error uploading song");
      } else {
        setError("Error uploading song");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Upload Song</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="origSinger">Original Singer</Label>
              <Input
                id="origSinger"
                value={origSinger}
                onChange={(e) => setOrigSinger(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="worshipLeader">Worship Leader</Label>
              <Input
                id="worshipLeader"
                value={worshipLeader}
                onChange={(e) => setWorshipLeader(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="key">Key</Label>
              <Input id="key" value={key} onChange={(e) => setKey(e.target.value)} required />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert variant="default" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full">
              Upload Song
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
