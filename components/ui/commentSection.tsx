"use client";

import { useState, useEffect, useMemo } from "react";
import { createSupabaseClient } from "@/app/lib/supabase/client";
import { MoreHorizontal, Send, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";

type CurrentUser = {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
};

type Comment = {
  id: number;
  post_id: number;
  user_id: string;
  parent_id: number | null;
  content: string;
  created_at: string;
  author: { name: string; username: string };
};

type CommentSectionProps = {
  postId: string;
  currentUser: CurrentUser;
  postAuthorId: string;
  onCommentsCountChange: (count: number) => void;
};

export default function CommentSection({
  postId,
  currentUser,
  postAuthorId,
  onCommentsCountChange,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentFocused, setCommentFocused] = useState(false);
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyFocused, setReplyFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const supabase = useMemo(() => createSupabaseClient(), []);

  useEffect(() => {
    onCommentsCountChange(comments.length);
  }, [comments.length, onCommentsCountChange]);

  useEffect(() => {
    // Fetch comments for this postId
    const fetchComments = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("comments")
          .select(`*, author:users!comments_user_id_fkey(name, username)`)
          .eq("post_id", postId)
          .order("created_at", { ascending: true });
        if (error) throw error;
        setComments(data as Comment[]);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
      setLoading(false);
    };
    fetchComments();
  }, [postId, supabase]);

  // Handle new comment submission
  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    setError("");

    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        user_id: currentUser.id,
        content: newComment.trim(),
      })
      .select()
      .single();

    if (error || !data) {
      console.error("Error submitting comment:", error);
      setError("Failed to submit comment. Please try again.");
    } else {
      setComments((prev) => [
        ...prev,
        {
          ...(data as Comment),
          author: { name: currentUser.name, username: currentUser.username },
        },
      ]);
      setNewComment("");
    }
    setSubmitting(false);
  }

  // Handle reply submit
  async function handleReplySubmit(
    e: React.SubmitEvent<HTMLFormElement>,
    parentId: number,
  ) {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSubmitting(true);
    setError("");

    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        user_id: currentUser.id,
        parent_id: parentId,
        content: replyText.trim(),
      })
      .select()
      .single();

    if (error || !data) {
      console.error("Error submitting reply:", error);
      setError("Failed to submit reply. Please try again.");
    } else {
      setComments((prev) => [
        ...prev,
        {
          ...(data as Comment),
          author: { name: currentUser.name, username: currentUser.username },
        },
      ]);
      setReplyText("");
      setReplyTo(null);
      setReplyFocused(false);
    }
    setSubmitting(false);
  }

  // Handle delete comment
  async function handleDeleteComment() {
    if (!commentToDelete) return;
    setDeleting(true);

    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentToDelete);

    if (!error) {
      setComments((prev) => prev.filter((c) => c.id != commentToDelete));
    } else {
      setError("Failed to delete comment");
    }
    setDeleting(false);
    setCommentToDelete(null);
  }

  return (
    <section className="mt-6 border-t border-white/10 pt-5">
      <h2 className="mb-4 text-lg font-semibold text-white">
        Comments ({comments.length})
      </h2>
      <form
        onSubmit={handleSubmit}
        onFocus={() => setCommentFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setCommentFocused(false);
          }
        }}
        className="mt-5"
      >
        <label htmlFor="comment" className="sr-only">
          Add a comment
        </label>
        <div className="flex min-h-12 items-center gap-3 rounded-full border border-[#2A2D3A] bg-[#0F1117] px-2.5 py-1.5 transition-colors focus-within:border-[#1D9E75]">
          <div
            className="flex size-8 min-w-8 items-center justify-center rounded-full bg-[#2A2D3A] bg-cover bg-center text-sm font-bold text-white"
            style={
              currentUser.avatarUrl
                ? { backgroundImage: `url(${currentUser.avatarUrl})` }
                : undefined
            }
          >
            {!currentUser.avatarUrl && currentUser.name.charAt(0)}
          </div>
          <textarea
            id="comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={1}
            disabled={submitting}
            className="min-w-0 flex-1 resize-none bg-transparent px-1 py-2 text-sm text-white placeholder-[#8B8FA8] focus:outline-none"
          />
          {(commentFocused || newComment.trim()) && (
            <button
              type="submit"
              aria-label="Post comment"
              title="Post comment"
              disabled={submitting || !newComment.trim()}
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#1D9E75] transition-colors hover:bg-[#1D9E75]/10 hover:text-[#36C99A] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="size-4" />
            </button>
          )}
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </form>

      {loading ? (
        <p className="py-4 text-sm text-slate-500">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="py-4 text-sm text-slate-500">No comments yet.</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className={`rounded-lg px-2.5 py-2 mt-2 ${comment.parent_id ? "ms-8" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Author Image  */}
                  <div className="size-8 min-w-8 shrink-0 aspect-square overflow-hidden rounded-full bg-[#2A2D3A] flex items-center justify-center text-white font-bold mb-1">
                    {comment.author?.name.charAt(0) || "A"}
                  </div>
                  {/* Author Name and Username */}
                  <div className="flex flex-col">
                    <p className="text-sm text-white">
                      {comment.author?.name || "Anonymous"}
                    </p>
                    <span className=" text-xs font-normal text-slate-500">
                      @{comment.author?.username || "user"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <time className="text-xs text-slate-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </time>
                  {/* 3 dots with dropdown options */}
                  {(comment.user_id === currentUser.id ||
                    postAuthorId === currentUser.id) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="rounded-md p-1 text-slate-500 hover:bg-[#242D3A] hover:text-white"
                        aria-label="Comment options"
                      >
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-red-400 focus:text-red-400"
                          onClick={() => setCommentToDelete(comment.id)}
                        >
                          <Trash2 className="mr-2 size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
              {/* Comment Content */}
              <p className="mt-2 ms-11 whitespace-pre-wrap text-sm text-slate-300">
                {comment.content}
              </p>
              {/* button to reply on this comment */}
              <button
                type="button"
                onClick={() => {
                  setReplyTo((currentReply) =>
                    currentReply === comment.id ? null : comment.id,
                  );
                  setReplyText("");
                  setReplyFocused(false);
                }}
                aria-label={`Reply to ${comment.author?.name || "comment"}`}
                className="mt-2 ms-11 text-xs text-slate-500 hover:text-slate-300 hover:bg-[#1D1F26] border-2 border-[#2A2D3A] hover:border-slate-300 px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
              >
                {/* Reply icon with hover effect */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 10h11a7 7 0 017 7v1M3 10l6-6M3 10l6 6"
                  />
                </svg>
              </button>
              {replyTo === comment.id && (
                <form
                  onSubmit={(event) => handleReplySubmit(event, comment.id)}
                  onFocus={() => setReplyFocused(true)}
                  onBlur={(event) => {
                    if (
                      !event.currentTarget.contains(event.relatedTarget as Node)
                    ) {
                      setReplyFocused(false);
                    }
                  }}
                  className="mt-3 ms-11"
                >
                  <label htmlFor={`reply-${comment.id}`} className="sr-only">
                    Reply to {comment.author?.name || "comment"}
                  </label>
                  <div className="flex min-h-10 items-center gap-2 rounded-full border border-[#2A2D3A] bg-[#0F1117] px-2 py-1 transition-colors focus-within:border-[#1D9E75]">
                    <input
                      id={`reply-${comment.id}`}
                      value={replyText}
                      onChange={(event) => setReplyText(event.target.value)}
                      placeholder="Add a reply..."
                      disabled={submitting}
                      className="min-w-0 flex-1 bg-transparent px-2 py-1 text-xs text-white placeholder-[#8B8FA8] focus:outline-none"
                    />
                    {(replyFocused || replyText.trim()) && (
                      <button
                        type="submit"
                        aria-label="Post reply"
                        title="Post reply"
                        disabled={submitting || !replyText.trim()}
                        className="flex size-7 shrink-0 items-center justify-center rounded-full text-[#1D9E75] transition-colors hover:bg-[#1D9E75]/10 hover:text-[#36C99A] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Send className="size-3.5" />
                      </button>
                    )}
                  </div>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Confirmation dialog */}
      <AlertDialog
        open={commentToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setCommentToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this comment?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              disabled={deleting}
              onClick={handleDeleteComment}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
