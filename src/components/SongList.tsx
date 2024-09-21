"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
import { Song } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Plus, Trash2, Eye } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface ExtendedSong extends Song {
  worshipLeaders: string[];
  keys: { leader: string; key: string }[];
}

const pushNotification = async (message: string) => {
  try {
    await addDoc(collection(db, "notifications"), {
      message,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error pushing notification:", error);
  }
};

export default function SongListWithUpload() {
  const [songs, setSongs] = useState<ExtendedSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [songToDelete, setSongToDelete] = useState<ExtendedSong | null>(null);
  const [title, setTitle] = useState("");
  const [origSinger, setOrigSinger] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [addDetailsDialogOpen, setAddDetailsDialogOpen] = useState(false);
  const [songToAddDetails, setSongToAddDetails] = useState<ExtendedSong | null>(null);
  const [newWorshipLeader, setNewWorshipLeader] = useState("");
  const [newKey, setNewKey] = useState("");
  const [viewDetailsDialogOpen, setViewDetailsDialogOpen] = useState(false);
  const [songToView, setSongToView] = useState<ExtendedSong | null>(null);

  useEffect(() => {
    fetchSongs();
  }, []);

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
    });

    return () => unsubscribe();
  }, []);

  const fetchSongs = async () => {
    try {
      const songsCollection = collection(db, "songs");
      const songSnapshot = await getDocs(songsCollection);
      const songList = songSnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            worshipLeaders: doc.data().worshipLeaders || [],
            keys: doc.data().keys || [],
          } as ExtendedSong)
      );
      setSongs(songList);
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await addDoc(collection(db, "songs"), { title, origSinger, worshipLeaders: [], keys: [] });
      await pushNotification(`New song added: ${title}`);
      setSuccess("Song uploaded successfully");
      setTitle("");
      setOrigSinger("");
    } catch (error) {
      console.error("Error uploading song:", error);
      setError("Failed to upload song");
    }
  };

  const handleDelete = async (song: ExtendedSong) => {
    setSongToDelete(song);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!songToDelete) return;

    try {
      await deleteDoc(doc(db, "songs", songToDelete.id));
      setSuccess("Song deleted successfully");
      fetchSongs();
    } catch (error) {
      console.error("Error deleting song:", error);
      setError("Failed to delete song");
    } finally {
      setDeleteDialogOpen(false);
      setSongToDelete(null);
    }
  };

  const handleAddDetails = (song: ExtendedSong) => {
    setSongToAddDetails(song);
    setNewWorshipLeader("");
    setNewKey("");
    setAddDetailsDialogOpen(true);
  };

  const handleAddDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songToAddDetails) return;

    try {
      await updateDoc(doc(db, "songs", songToAddDetails.id), {
        worshipLeaders: arrayUnion(newWorshipLeader),
        keys: arrayUnion({ leader: newWorshipLeader, key: newKey }),
      });
      setSuccess("Song details updated successfully");
      fetchSongs();
      setAddDetailsDialogOpen(false);
    } catch (error) {
      console.error("Error updating song details:", error);
      setError("Failed to update song details");
    }
  };

  const handleViewDetails = (song: ExtendedSong) => {
    setSongToView(song);
    setViewDetailsDialogOpen(true);
  };

  return (
    <Card className="w-full ">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-semibold">Set List</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Song
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Upload Song</DialogTitle>
            </DialogHeader>
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
              <Button type="submit" className="w-full">
                Upload Song
              </Button>
            </form>
          </DialogContent>
        </Dialog>
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
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Original Singer</TableHead>
                <TableHead>Worship Leaders</TableHead>
                <TableHead>Keys</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {songs.map((song) => (
                <TableRow key={song.id} className="cursor-pointer" onClick={() => handleViewDetails(song)}>
                  <TableCell>{song.title}</TableCell>
                  <TableCell>{song.origSinger}</TableCell>
                  <TableCell>
                    {song.worshipLeaders.length > 0 ? (
                      <div className="flex -space-x-2 overflow-hidden">
                        {song.worshipLeaders.slice(0, 3).map((leader, index) => (
                          <TooltipProvider key={index}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Avatar className="w-6 h-6 rounded-full">
                                  <AvatarImage
                                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${leader}`}
                                    className="w-6 h-6 rounded-full"
                                  />
                                  <AvatarFallback>{leader.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{leader}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                        {song.worshipLeaders.length > 3 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Avatar className="w-6 h-6 rounded-full bg-gray-300">
                                  +{song.worshipLeaders.length - 3}
                                </Avatar>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>+{song.worshipLeaders.length - 3} more</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    ) : (
                      "Not set"
                    )}
                  </TableCell>
                  <TableCell>
                    {song.keys.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {song.keys.slice(0, 3).map((keyInfo, index) => (
                          <TooltipProvider key={index}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="secondary">{keyInfo.key}</Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{keyInfo.leader}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                        {song.keys.length > 3 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="secondary" className="bg-gray-300 text-gray-700">
                                  +{song.keys.length - 3}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>+{song.keys.length - 3} more</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    ) : (
                      "Not set"
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddDetails(song);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Add Details</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(song);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(song);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the song &quot;{songToDelete?.title}&quot;? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={addDetailsDialogOpen} onOpenChange={setAddDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Add Song Details</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddDetailsSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newWorshipLeader">New Worship Leader</Label>
              <Input
                id="newWorshipLeader"
                value={newWorshipLeader}
                onChange={(e) => setNewWorshipLeader(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newKey">New Key</Label>
              <Input id="newKey" value={newKey} onChange={(e) => setNewKey(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">
              Add Details
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={viewDetailsDialogOpen} onOpenChange={setViewDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Song Details</DialogTitle>
          </DialogHeader>
          {songToView && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Title</h3>
                <p>{songToView.title}</p>
              </div>
              <div>
                <h3 className="font-semibold">Original Singer</h3>
                <p>{songToView.origSinger}</p>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="font-semibold">Worship Leaders and Keys</h3>
                {songToView.worshipLeaders.length > 0 ? (
                  <ul className="space-y-2">
                    {songToView.worshipLeaders.map((leader, index) => (
                      <li key={index} className="flex items-center justify-between space-x-2">
                        {/* <Avatar className="w-6 h-6 rounded-full">
                          <AvatarImage
                            src={`https://api.dicebear.com/6.x/initials/svg?seed=${leader}`}
                            className="w-6 h-6 rounded-full"
                          />
                          <AvatarFallback>{leader.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar> */}
                        <span>{leader}</span>
                        {songToView.keys
                          .filter((k) => k.leader === leader)
                          .map((keyInfo, keyIndex) => (
                            <Badge key={keyIndex} variant="secondary">
                              {keyInfo.key}
                            </Badge>
                          ))}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Not set</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
