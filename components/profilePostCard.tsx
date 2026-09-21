import Link from "next/link";


type ProfilePost = {
  id: number;
  content: string;
  tags: string[] | null;
  created_at: string;
};

type ProfilePostCardProps = {
  post: ProfilePost;
  username: string;
};

export default function ProfilePostCard({
  post,
  username,
}: ProfilePostCardProps) {
  return (
    <article className="rounded-xl border border-[#2A2D3A] bg-[#1A1D27] p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <Link
          href={`/profile/${username}`}
          className="text-sm font-semibold text-white hover:text-[#36C99A]"
        >
          @{username}
        </Link>
        <time
          dateTime={post.created_at}
          className="text-xs text-[#8B8FA8]"
        >
          {new Date(post.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </time>
     
      </div>

      <p className="whitespace-pre-wrap text-sm leading-6 text-white">
        {post.content}
      </p>

      {(post.tags ?? []).length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {(post.tags ?? []).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#2A2D3A] px-2 py-1 text-xs text-[#8B8FA8]"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}