import { GAME } from "@lib/CONSTANTS";
import { Clip, Comment, Like, User } from "@prisma/client";
import styles from "@styles/Clip.module.css";
interface fullClip extends Clip {
  author: User;
  comments: Comment[];
  likes: Like[];
}
type clipIdProps = {
  clip: fullClip;
};

import dateFormat from "dateformat";
import CommentComponent from "./Comment";

function ClipComponent({ clip }: clipIdProps) {
  return (
    <div className={styles.clipContainer}>
      {!clip.srcURL.match(/\.mp4/)?.length ? (
        <img src={clip.srcURL} />
      ) : (
        <video
          src={clip.srcURL}
          poster={clip.thumbnailURL || ""}
          controls
        ></video>
      )}
      <div className={styles.videoInfo}>
        <div className={styles.videoMeta}>
          <div>
            <h1>
              {clip.title}{" "}
              <span className={styles.gameInfo}>| {GAME[clip.game]}</span>
            </h1>
            <p>By {clip.author.username}</p>
          </div>
          <div>
            <h3 style={{ textAlign: "right" }}>
              {dateFormat(clip.createdAt, "mmmm dS, yyyy")}
            </h3>
          </div>
        </div>
        <CommentComponent
          clip={clip}
          comments={clip.comments.map((c) => ({ ...c, author: clip.author }))}
        />
      </div>
    </div>
  );
}

export default ClipComponent;
