"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { OtpInput } from "@/components/OtpInput";

export default function Login() {
  const [error, setError] = useState("");
  const router = useRouter();
  const { login, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, loading, router]);

  const handleSubmit = (pin: string) => {
    if (login(pin)) {
      router.push("/");
    } else {
      setError("Invalid PIN");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="pt-6">
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="space-y-2">
              <OtpInput length={6} onComplete={handleSubmit} />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
