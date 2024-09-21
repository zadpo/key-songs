"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Trash2, Eye, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { ExtendedSong } from "@/types";
import { Input } from "@/components/ui/input";

interface SongTableProps {
  songs: ExtendedSong[];
  loading: boolean;
  onDelete: (song: ExtendedSong) => void;
  onAddDetails: (song: ExtendedSong) => void;
  onViewDetails: (song: ExtendedSong) => void;
}

export default function SongTable({ songs, loading, onDelete, onAddDetails, onViewDetails }: SongTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSongs, setFilteredSongs] = useState<ExtendedSong[]>(songs);
  const itemsPerPage = 12;

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = songs.filter(
      (song) =>
        song.title.toLowerCase().includes(lowercasedQuery) ||
        song.origSinger.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredSongs(filtered);
    setCurrentPage(1);
  }, [searchQuery, songs]);

  const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSongs = filteredSongs.slice(startIndex, endIndex);

  const goToNextPage = () => setCurrentPage((page) => Math.min(page + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((page) => Math.max(page - 1, 1));

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by title or original singer"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
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
          {currentSongs.map((song) => (
            <TableRow key={song.id} className="cursor-pointer" onClick={() => onViewDetails(song)}>
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
                            <Avatar className="w-6 h-6 text-xs font-inter items-center justify-center rounded-full bg-gray-300">
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
                      onAddDetails(song);
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
                      onDelete(song);
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
                      onViewDetails(song);
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
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredSongs.length)} of {filteredSongs.length}{" "}
          songs
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={goToPreviousPage} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous Page</span>
          </Button>
          <p className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </p>
          <Button variant="outline" size="sm" onClick={goToNextPage} disabled={currentPage === totalPages}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next Page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
