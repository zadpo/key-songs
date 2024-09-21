import Link from "next/link";
import { Home, LogOut, Music, Upload } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { Button } from "../ui/button";

export function Sidebar() {
  const { logout } = useAuth();
  return (
    <div className="flex h-screen w-64 flex-col p-3 bg-white border rounded-tr-[40px]">
      <div className="flex items-center justify-center h-14 border-b">
        <h1 className="text-xl font-semibold">Music App</h1>
      </div>
      <nav className="flex-1 space-y-2 py-4">
        <Link
          href="/"
          className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
        >
          <Home className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/songs"
          className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
        >
          <Music className="h-5 w-5" />
          <span>Song List</span>
        </Link>
        <Link
          href="/tracks"
          className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
        >
          <Upload className="h-5 w-5" />
          <span>Upload Song</span>
        </Link>
      </nav>
      <div>
        <Button onClick={logout} className="w-full">
          Logout
          <LogOut className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
