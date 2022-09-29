import styles from "@styles/Comment.module.css";
import { useRef, useState } from "react";
import Link from "next/link";
import { Clip, Comment, User } from "@prisma/client";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

interface fullComment extends Comment {
  author: User;
}
type CommentComponentProps = {
  comments: fullComment[];
  clip: Clip;
};

function CommentComponent({
  comments: initalComments,
  clip,
}: CommentComponentProps) {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState(initalComments);
  const [range, setRange] = useState([0, 5]);
  const inputRef = useRef() as { current: HTMLInputElement };
  async function createComment() {
    const message = inputRef.current.value;
    console.log(message);
    if (!message || !message.length || !session?.user) return;
    if (message.length > 80)
      return toast("Comment can't be longer than 80 chars.", { type: "error" });
    if (
      comments.filter((c) => c.author.email === session.user.email).length >= 5
    )
      return toast("Are you spamming comments?", { type: "error" });
    const res = await fetch("/api/clips/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        addComment: true,
        email: session.user.email,
        message,
        clipId: clip.clipId,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setComments([...comments, data.comment]);
    } else {
      toast("Error!", { type: "error" });
    }
  }
  return (
    <div className={styles.commentComponent}>
      <div className={styles.inputSection}>
        <input
          disabled={status !== "authenticated"}
          type="text"
          placeholder="Rate the clip!"
          ref={inputRef}
        />
        <button disabled={status !== "authenticated"} onClick={createComment}>
          Post
        </button>
      </div>
      <div className={styles.commentsSection}>
        {comments.length ? (
          comments.slice(range[0], range[1]).map((comment, i) => (
            <div className={styles.comment} key={i}>
              <span className={styles.username}>
                <Link href={"/users/" + comment.author.username}>
                  <a>{comment.author.username}: </a>
                </Link>
              </span>
              <span className={styles.value}>{comment.message}</span>
            </div>
          ))
        ) : (
          <div className={styles.commentsNotFound}>
            <h4>No Comments.. Yet.</h4>
          </div>
        )}
      </div>
      <div className={styles.commentsPages}>
        <div className={styles.buttons}>
          <button
            onClick={() => {
              if (range[0] !== 0) setRange([range[0] - 5, range[1] - 5]);
            }}
          >
            Last Page
          </button>
          <button
            onClick={() => {
              if (range[1] < comments.length)
                setRange([range[0] + 5, range[1] + 5]);
            }}
          >
            Next Page
          </button>
        </div>
        <span>
          Page {range[1] / 5} of{" "}
          {comments.length === 0 ? 0 : Math.ceil(comments.length / 5)}
        </span>
      </div>
    </div>
  );
}

export default CommentComponent;
