"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExtendedSong } from "@/types";
import { Music, User, Trash2 } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ViewDetailsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  songToView: ExtendedSong | null;
  onUpdate: (updatedSong: ExtendedSong) => void;
}

export default function ViewDetailsDialog({ open, setOpen, songToView, onUpdate }: ViewDetailsDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [leaderToDelete, setLeaderToDelete] = useState<string | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [localSongToView, setLocalSongToView] = useState<ExtendedSong | null>(null);

  useEffect(() => {
    if (songToView) {
      setLocalSongToView(songToView);
    }
  }, [songToView]);

  const handleDeleteConfirm = async () => {
    if (!localSongToView || !leaderToDelete) return;

    setIsDeleting(true);

    try {
      const updatedWorshipLeaders = localSongToView.worshipLeaders.filter(
        (leader) => leader !== leaderToDelete
      );
      const updatedKeys = localSongToView.keys.filter((key) => key.leader !== leaderToDelete);

      const songRef = doc(db, "songs", localSongToView.id);
      await updateDoc(songRef, {
        worshipLeaders: updatedWorshipLeaders,
        keys: updatedKeys,
      });

      const updatedSong: ExtendedSong = {
        ...localSongToView,
        worshipLeaders: updatedWorshipLeaders,
        keys: updatedKeys,
      };

      setLocalSongToView(updatedSong);
      onUpdate(updatedSong);
    } catch (error) {
      console.error("Error deleting worship leader:", error);
    } finally {
      setIsDeleting(false);
      setLeaderToDelete(null);
      setAlertOpen(false);
    }
  };

  const handleDeleteClick = (leader: string) => {
    setLeaderToDelete(leader);
    setAlertOpen(true);
  };

  if (!localSongToView) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">Song Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex items-start space-x-3">
              <Music className="w-5 h-5 text-primary" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Title</h3>
                <p className="text-lg font-semibold">{localSongToView.title}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-primary" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Original Singer</h3>
                <p className="text-lg font-semibold">{localSongToView.origSinger}</p>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                <span>Worship Leaders and Keys</span>
              </h3>
              {localSongToView.worshipLeaders.length > 0 ? (
                <ul className="space-y-3">
                  {localSongToView.worshipLeaders.map((leader, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span className="text-sm">{leader}</span>
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          {localSongToView.keys
                            .filter((k) => k.leader === leader)
                            .map((keyInfo, keyIndex) => (
                              <Badge key={keyIndex} variant="secondary" className="text-xs">
                                {keyInfo.key}
                              </Badge>
                            ))}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(leader)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Not set</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the worship leader and their
              associated key.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
