"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { ExtendedSong } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import SongUploadDialog from "./SongUploadDialog";
import SongTable from "./SongTable";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import AddDetailsDialog from "./AddDetailsDialog";
import ViewDetailsDialog from "./ViewDetailsDialog";

export default function SongList() {
  const [songs, setSongs] = useState<ExtendedSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [songToDelete, setSongToDelete] = useState<ExtendedSong | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [addDetailsDialogOpen, setAddDetailsDialogOpen] = useState(false);
  const [songToAddDetails, setSongToAddDetails] = useState<ExtendedSong | null>(null);
  const [viewDetailsDialogOpen, setViewDetailsDialogOpen] = useState(false);
  const [songToView, setSongToView] = useState<ExtendedSong | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "songs"), (snapshot) => {
      const songsList = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            title: doc.data().title || "",
            origSinger: doc.data().origSinger || "",
            worshipLeaders: doc.data().worshipLeaders || [],
            keys: doc.data().keys || [],
          } as ExtendedSong)
      );
      setSongs(songsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = (song: ExtendedSong) => {
    setSongToDelete(song);
    setDeleteDialogOpen(true);
  };

  const handleAddDetails = (song: ExtendedSong) => {
    setSongToAddDetails(song);
    setAddDetailsDialogOpen(true);
  };

  const handleViewDetails = (song: ExtendedSong) => {
    setSongToView(song);
    setViewDetailsDialogOpen(true);
  };

  const handleAddDetailsSubmit = (updatedSong: ExtendedSong) => {
    setSongs((prevSongs) => prevSongs.map((song) => (song.id === updatedSong.id ? updatedSong : song)));
    setSuccess("Song details updated successfully");
  };

  const handleDeleteConfirm = async () => {
    if (songToDelete) {
      try {
        await deleteDoc(doc(db, "songs", songToDelete.id));
        setSuccess("Song deleted successfully");
        setDeleteDialogOpen(false);
        setSongToDelete(null);
      } catch (error) {
        console.error("Error deleting song:", error);
        setError("Failed to delete song. Please try again.");
      }
    }
  };

  const handleUpdateSong = (updatedSong: ExtendedSong) => {
    setSongs((prevSongs) => prevSongs.map((song) => (song.id === updatedSong.id ? updatedSong : song)));
    setSuccess("Worship leader and key deleted successfully");
  };

  return (
    <Card className="w-full shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-semibold">Set List</CardTitle>
        <SongUploadDialog open={open} setOpen={setOpen} setSuccess={setSuccess} setError={setError} />
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert variant="default" className="mb-4 bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        <SongTable
          songs={songs}
          loading={loading}
          onDelete={handleDelete}
          onAddDetails={handleAddDetails}
          onViewDetails={handleViewDetails}
        />
      </CardContent>
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        songToDelete={songToDelete}
        onConfirm={handleDeleteConfirm}
      />
      <AddDetailsDialog
        open={addDetailsDialogOpen}
        setOpen={setAddDetailsDialogOpen}
        songToAddDetails={songToAddDetails}
        onSubmit={handleAddDetailsSubmit}
      />
      <ViewDetailsDialog
        open={viewDetailsDialogOpen}
        setOpen={setViewDetailsDialogOpen}
        songToView={songToView}
        onUpdate={handleUpdateSong}
      />
    </Card>
  );
}
