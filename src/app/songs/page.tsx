"use client";

import Songlist from "@/components/Setlist/Songlist";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProtectedSonglist() {
  return (
    <ProtectedRoute>
      <Songlist />
    </ProtectedRoute>
  );
}
