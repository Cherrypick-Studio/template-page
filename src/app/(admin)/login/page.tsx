import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  // If already authenticated as admin, go straight to dashboard
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseKey && supabaseUrl !== "your-supabase-project-url") {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user && error !== "unauthorized") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (profile?.role === "admin") {
        redirect("/dashboard");
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8 gap-3">
          <Image
            src="/assets/ic-logo-cherrypick.svg"
            alt="CherryPick logo"
            width={160}
            height={40}
            className="h-10 w-auto"
          />
          <p className="text-sm text-[#888888]">Admin Dashboard</p>
        </div>

        <div className="bg-white border border-[#EBEBEB] rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-[#1A1A1A] mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-[#888888] mb-6">
            Sign in to your admin account
          </p>

          {error === "unauthorized" && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
              Your account does not have admin access. Please contact the site administrator.
            </div>
          )}

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
