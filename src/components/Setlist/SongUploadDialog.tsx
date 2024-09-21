import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface SongUploadDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setSuccess: (message: string) => void;
  setError: (message: string) => void;
}

export default function SongUploadDialog({ open, setOpen, setSuccess, setError }: SongUploadDialogProps) {
  const [title, setTitle] = useState("");
  const [origSinger, setOrigSinger] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await addDoc(collection(db, "songs"), { title, origSinger, worshipLeaders: [], keys: [] });
      setSuccess("Song uploaded successfully");
      setTitle("");
      setOrigSinger("");
      setOpen(false);
    } catch (error) {
      console.error("Error uploading song:", error);
      setError("Failed to upload song");
    }
  };

  return (
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
  );
}
