"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExtendedSong } from "@/types";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AddDetailsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  songToAddDetails: ExtendedSong | null;
  onSubmit: (updatedSong: ExtendedSong) => void;
}

const worshipLeaders = [
  "Zadrach",
  "Shiela",
  "Joyce",
  "Loraine",
  "Ivy",
  "Lousie",
  "Jhazz",
  "Thek",
  "Denise",
  "Bel",
  "Veemar",
]; // Add your worship leaders here
const musicalKeys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export default function AddDetailsDialog({
  open,
  setOpen,
  songToAddDetails,
  onSubmit,
}: AddDetailsDialogProps) {
  const [newWorshipLeader, setNewWorshipLeader] = useState("");
  const [newKey, setNewKey] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songToAddDetails || !newWorshipLeader || !newKey) return;

    try {
      const songRef = doc(db, "songs", songToAddDetails.id);
      await updateDoc(songRef, {
        worshipLeaders: arrayUnion(newWorshipLeader),
        keys: arrayUnion({ key: newKey, leader: newWorshipLeader }),
      });

      const updatedSong: ExtendedSong = {
        ...songToAddDetails,
        worshipLeaders: [...songToAddDetails.worshipLeaders, newWorshipLeader],
        keys: [...songToAddDetails.keys, { key: newKey, leader: newWorshipLeader }],
      };

      onSubmit(updatedSong);
      setNewWorshipLeader("");
      setNewKey("");
      setOpen(false);
    } catch (error) {
      console.error("Error updating song details:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">Add Song Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="newWorshipLeader" className="text-sm font-medium text-muted-foreground">
              Worship Leader
            </Label>
            <Select onValueChange={setNewWorshipLeader} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a worship leader" />
              </SelectTrigger>
              <SelectContent>
                {worshipLeaders.map((leader) => (
                  <SelectItem key={leader} value={leader}>
                    {leader}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newKey" className="text-sm font-medium text-muted-foreground">
              Key
            </Label>
            <Select onValueChange={setNewKey} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a key" />
              </SelectTrigger>
              <SelectContent>
                {musicalKeys.map((key) => (
                  <SelectItem key={key} value={key}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Add Details
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
