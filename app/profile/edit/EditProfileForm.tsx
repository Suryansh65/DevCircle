"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { createSupabaseClient } from "@/app/lib/supabase/client";

type Profile = {
  id: string;
  name: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
  skills: string[] | null;
};

type EditProfileFormProps = {
  profile: Profile;
};

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function EditProfileForm({ profile }: EditProfileFormProps) {
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [skills, setSkills] = useState((profile.skills ?? []).join(", "));
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(profile.avatar_url ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const supabase = createSupabaseClient();

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      setError("Choose a JPG, PNG, WebP image.");
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setError("Avatar images must be 5 MB or smaller.");
      return;
    }

    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError("");
    setSuccess("");
  }

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const cleanedName = name.trim();
    if (!cleanedName) {
      setError("Name is required.");
      setSaving(false);
      return;
    }

    let avatarUrl = profile.avatar_url;
    let uploadedPath: string | null = null;

    if (avatarFile) {
      const extension = avatarFile.name.split(".").pop()?.toLowerCase() || "jpg";
      uploadedPath = `${profile.id}/avatar-${Date.now()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(uploadedPath, avatarFile, { contentType: avatarFile.type });

      if (uploadError) {
        setError(uploadError.message || "Unable to upload avatar.");
        setSaving(false);
        return;
      }

      avatarUrl = supabase.storage.from("avatars").getPublicUrl(uploadedPath).data.publicUrl;
    }

    const normalizedSkills = skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean)
      .filter((skill, index, values) => values.indexOf(skill) === index);

    const { error: updateError } = await supabase
      .from("users")
      .update({
        name: cleanedName,
        bio: bio.trim() || null,
        skills: normalizedSkills,
        avatar_url: avatarUrl,
      })
      .eq("id", profile.id);

    if (updateError) {
      if (uploadedPath) {
        await supabase.storage.from("avatars").remove([uploadedPath]);
      }
      setError(updateError.message || "Unable to update profile.");
      setSaving(false);
      return;
    }

    setAvatarFile(null);
    setSuccess("Profile updated successfully.");
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <div
          className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#2A2D3A] bg-cover bg-center text-2xl font-bold text-white"
          style={previewUrl ? { backgroundImage: `url(${previewUrl})` } : undefined}
        >
          {!previewUrl && profile.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <label htmlFor="avatar" className="text-sm font-medium text-white">
            Profile image
          </label>
          <input
            id="avatar"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleAvatarChange}
            disabled={saving}
            className="mt-2 block w-full text-sm text-[#8B8FA8] file:mr-3 file:rounded-md file:border-0 file:bg-[#1D9E75] file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#36C99A]"
          />
          <p className="mt-1 text-xs text-[#8B8FA8]">JPG, PNG, WebP, or AVIF. Maximum 5 MB.</p>
        </div>
      </div>

      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-white">
          Name
        </label>
        <input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={saving}
          className="w-full rounded-lg border border-[#2A2D3A] bg-[#0F1117] px-3 py-2 text-sm text-white outline-none focus:border-[#1D9E75]"
        />
      </div>

      <div>
        <label htmlFor="username" className="mb-2 block text-sm font-medium text-white">
          Username
        </label>
        <input
          id="username"
          value={`@${profile.username}`}
          disabled
          className="w-full rounded-lg border border-[#2A2D3A] bg-[#0F1117] px-3 py-2 text-sm text-[#8B8FA8]"
        />
      </div>

      <div>
        <label htmlFor="bio" className="mb-2 block text-sm font-medium text-white">
          Bio
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          disabled={saving}
          rows={4}
          className="w-full resize-none rounded-lg border border-[#2A2D3A] bg-[#0F1117] px-3 py-2 text-sm text-white outline-none focus:border-[#1D9E75]"
        />
      </div>

      <div>
        <label htmlFor="skills" className="mb-2 block text-sm font-medium text-white">
          Skills
        </label>
        <input
          id="skills"
          value={skills}
          onChange={(event) => setSkills(event.target.value)}
          disabled={saving}
          placeholder="React, TypeScript, Supabase"
          className="w-full rounded-lg border border-[#2A2D3A] bg-[#0F1117] px-3 py-2 text-sm text-white outline-none focus:border-[#1D9E75]"
        />
        <p className="mt-1 text-xs text-[#8B8FA8]">Separate skills with commas.</p>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {success && <p className="text-sm text-[#36C99A]">{success}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-[#1D9E75] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#36C99A] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}