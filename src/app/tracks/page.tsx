"use client";

import { TrackList } from "@/components/Tracks/Track-List";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProtectedTrackList() {
  return (
    <ProtectedRoute>
      <TrackList />
    </ProtectedRoute>
  );
}
