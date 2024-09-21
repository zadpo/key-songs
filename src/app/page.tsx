"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Upload, List, Users } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import ProtectedRoute from "@/components/ProtectedRoute";
import { BarChart } from "recharts";
import { TrackDashboard } from "@/components/Tracks/Dashboard";
import { SongChart } from "@/components/Setlist/BarChart";
import { ExtendedSong } from "@/types";

export default function Home() {
  const [stats, setStats] = useState({
    totalSongs: 0,
    totalArtists: 0,
    recentUploads: 0,
  });
  const [recentActivity, setRecentActivity] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [songs, setSongs] = useState<ExtendedSong[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const songsCollection = collection(db, "songs");
        const songsSnapshot = await getDocs(songsCollection);

        const songsData = songsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "",
            origSinger: data.origSinger || "",
            worshipLeaders: data.worshipLeaders || [],
            keys: data.keys || [],
          } as ExtendedSong;
        });

        setSongs(songsData);

        const totalSongs = songsData.length;
        const artistsSet = new Set(songsData.flatMap((song) => [song.origSinger, ...song.worshipLeaders]));
        const totalArtists = artistsSet.size;

        const recentUploadsQuery = query(songsCollection, orderBy("createdAt", "desc"), limit(5));
        const recentUploadsSnapshot = await getDocs(recentUploadsQuery);
        const recentUploads = recentUploadsSnapshot.size;

        setStats({
          totalSongs,
          totalArtists,
          recentUploads,
        });

        const recentActivityList = recentUploadsSnapshot.docs.map((doc) => {
          const song = doc.data();
          return `New song "${song.title}" by ${song.origSinger} added`;
        });
        setRecentActivity(recentActivityList);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Welcome to Key Songs</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Welcome to Key Songs</h1>
        <p>You can see here</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Songs</CardTitle>
              <Music className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stats.totalSongs}</div>
              )}
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Artists</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stats.totalArtists}</div>
              )}
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Uploads</CardTitle>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stats.recentUploads}</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
              <Link href="/upload" passHref>
                <Button className="w-full">
                  <Upload className="mr-2 h-4 w-4" /> Upload New Song
                </Button>
              </Link>
              <Link href="/songs" passHref>
                <Button variant="outline" className="w-full">
                  <List className="mr-2 h-4 w-4" /> View Song List
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                <ul className="space-y-2">
                  {recentActivity.map((activity, index) => (
                    <li key={index} className="flex items-center">
                      <Music className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-6">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-4 w-4" />
                Songs Added per Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-[400px] w-full" /> : <SongChart songs={songs} />}
            </CardContent>
          </Card>
          <Card className="shadow-none ">
            <TrackDashboard />
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
