"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Music, Link as LinkIcon, Plus } from "lucide-react";

interface TrackUploadDialogProps {
  onUpload: (track: {
    title: string;
    date: Date;
    type: "mp3" | "drive";
    fileUrl?: string;
    driveLink?: string;
  }) => void;
}

export function TrackUploadDialog({ onUpload }: TrackUploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date>();
  const [uploadType, setUploadType] = useState<"mp3" | "drive">("mp3");
  const [mp3File, setMp3File] = useState<File | null>(null);
  const [driveLink, setDriveLink] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTrack = {
      title,
      date: date || new Date(),
      type: uploadType,
      fileUrl: uploadType === "mp3" ? URL.createObjectURL(mp3File!) : undefined,
      driveLink: uploadType === "drive" ? driveLink : undefined,
    };
    onUpload(newTrack);
    // Reset form after submission
    setTitle("");
    setDate(undefined);
    setUploadType("mp3");
    setMp3File(null);
    setDriveLink("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Upload New Track
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Upload New Track</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Song Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full"
              placeholder="Enter song title"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Upload Type</Label>
            <RadioGroup
              value={uploadType}
              onValueChange={(value) => setUploadType(value as "mp3" | "drive")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mp3" id="mp3" />
                <Label htmlFor="mp3" className="flex items-center">
                  <Music className="w-4 h-4 mr-1" />
                  Upload MP3
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="drive" id="drive" />
                <Label htmlFor="drive" className="flex items-center">
                  <LinkIcon className="w-4 h-4 mr-1" />
                  Google Drive Link
                </Label>
              </div>
            </RadioGroup>
          </div>

          {uploadType === "mp3" ? (
            <div className="space-y-2">
              <Label htmlFor="mp3-file" className="text-sm font-medium">
                MP3 File
              </Label>
              <Input
                id="mp3-file"
                type="file"
                accept=".mp3"
                onChange={(e) => setMp3File(e.target.files?.[0] || null)}
                required
                className="w-full"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="drive-link" className="text-sm font-medium">
                Google Drive Link
              </Label>
              <Input
                id="drive-link"
                type="url"
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
                required
                className="w-full"
                placeholder="Enter Google Drive link"
              />
            </div>
          )}

          <Button type="submit" className="w-full">
            Upload Song
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
