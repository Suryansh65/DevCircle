import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server-client";
import EditProfileForm from "./EditProfileForm";

export default async function EditProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile, error } = await supabase
    .from("users")
    .select("id, name, username, bio, avatar_url, skills")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-[#0F1117] p-8 text-white">
        <h1 className="text-2xl font-bold">Unable to load your profile</h1>
        <p className="mt-2 text-sm text-[#8B8FA8]">Please try again later.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0F1117] px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold">Edit profile</h1>
        <p className="mt-2 text-sm text-[#8B8FA8]">Update your public profile information.</p>
        <section className="mt-8 rounded-xl border border-[#2A2D3A] bg-[#1A1D27] p-6 sm:p-8">
          <EditProfileForm profile={profile} />
        </section>
      </div>
    </main>
  );
}