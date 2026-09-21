import { createClient } from "@/app/lib/supabase/server-client";
import { notFound } from "next/navigation";
import ProfilePostCard from "@/components/profilePostCard";
import Link from "next/link";
import { Pencil } from "lucide-react";

type ProfilePageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select(
      "id, username, name, bio, avatar_url, github_url, linkedin_url, skills",
    )
    .eq("id", id)
    .maybeSingle();
  console.log("Profile route id:", id);
  console.log("Profile result:", profile);
  console.log("Profile error:", profileError);

  if (profileError) {
    console.error("Error fetching profile:", profileError);
    return (
      <div className="min-h-screen bg-[#0F1117] p-8 text-white">
        <h1 className="text-2xl font-bold">Unable to load profile</h1>
        <p className="mt-2 text-sm text-[#8B8FA8]">Please try again later.</p>
      </div>
    );
  }

  if (!profile) notFound();

  const {
    data: { user: viewer },
  } = await supabase.auth.getUser();

  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("id, content, tags, created_at")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  const initials = profile.name.trim().charAt(0).toUpperCase() || "U";
  const skills: string[] = profile.skills ?? [];

  return (
    <main className="min-h-screen bg-[#0F1117] px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-3xl">
        <section className="rounded-xl border border-[#2A2D3A] bg-[#1A1D27] p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div
              className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#2A2D3A] bg-cover bg-center text-2xl font-bold text-white"
              style={
                profile.avatar_url
                  ? { backgroundImage: `url(${profile.avatar_url})` }
                  : undefined
              }
            >
              {!profile.avatar_url && initials}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                {viewer?.id === profile.id && (
                  <Link
                    href="/profile/edit"
                    className="rounded-lg border border-[#2A2D3A] px-2 py-1 text-xs font-medium text-[#C5C8D6] hover:border-[#1D9E75] hover:text-white"
                  >
                    <Pencil className="size-4" />
                  </Link>
                )}
              </div>
              <p className="mt-1 text-sm text-[#8B8FA8]">@{profile.username}</p>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-[#C5C8D6]">
                {profile.bio || "No bio yet."}
              </p>
            </div>
          </div>

          {skills.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-[#2A2D3A] px-3 py-1 text-xs text-[#8B8FA8]"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">Posts</h2>
          {postsError ? (
            <p className="text-sm text-red-400">Unable to load posts.</p>
          ) : posts.length === 0 ? (
            <p className="text-sm text-[#8B8FA8]">No posts yet.</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <ProfilePostCard
                  key={post.id}
                  post={post}
                  username={profile.username}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
