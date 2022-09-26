import ReactToastContainer from "@components/static/ReactToastContainer";
import Title from "@components/static/Title";
import styles from "@styles/Upload.module.css";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { toast } from "react-toastify";

type Media = {
  name: string;
  file: File;
  url: string;
  type: string;
};

function Upload() {
  const uploadClipVideoRef = useRef() as { current: HTMLVideoElement };
  const uploadClipRef = useRef() as { current: HTMLInputElement };
  const uploadImageRef = useRef() as { current: HTMLInputElement };
  const [inputtedThumbnail, setInputtedThumbnail] = useState<Media>();
  const [inputtedVideo, setInputtedVideo] = useState<Media | null>();

  const [title, setTitle] = useState("");
  const [visabilty, setVisabilty] = useState("public");
  const [game, setGame] = useState("");

  function uploadVideoToCDN(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title || !visabilty || !game)
      return toast("Please Input a Title and Game", { type: "error" });
  }

  function uploadClip(e: ChangeEvent<HTMLInputElement>) {
    const eventFile = e.target.files?.[0];
    if (!eventFile || !eventFile.name.match(/\.(gif|mp4)$/)?.length) return;
    const fileSize = eventFile.size / 1024 / 1024;
    if (fileSize > 300) return toast("File size too big!", { type: "error" });
    const blob = new Blob([eventFile]);
    const url = URL.createObjectURL(blob);
    const media = {
      name: eventFile.name,
      file: eventFile,
      url,
      type: "video",
    };
    console.log({ name: media.name, url: media.url, type: media.type });
    setInputtedVideo(media);
  }
  function uploadThumbnail(e: ChangeEvent<HTMLInputElement>) {
    const eventFile = e.target.files?.[0];
    if (!eventFile) return;
    const fileSize = eventFile.size / 1024 / 1024;
    if (fileSize > 2) return toast("File size too big!", { type: "error" });
    const blob = new Blob([eventFile]);
    const url = URL.createObjectURL(blob);
    const media = {
      name: eventFile.name,
      file: eventFile,
      url,
      type: "image",
    };
    console.log({ name: media.name, url: media.url, type: media.type });
    setInputtedThumbnail(media);
  }
  return (
    <>
      <Title page="Upload" desc="Upload Clip Page" />
      <ReactToastContainer />
      <div className={styles.uploadPage}>
        <header>
          <h2>Upload Clip</h2>
        </header>
        <form autoComplete="off" spellCheck={false} onSubmit={uploadVideoToCDN}>
          <div className={styles.details}>
            <div className={styles.formInput}>
              <label htmlFor="Title">Title:</label>
              <input
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Rekt so hard"
                type="text"
                name="title"
                aria-label="title"
                required
              />
            </div>
            <div className={styles.formInput}>
              <label htmlFor="visabilty">Visabilty:</label>
              <select
                name="visabilty"
                onChange={(e) => setVisabilty(e.target.value)}
              >
                <option value="public">Public</option>
                <option value="unlisted">Unlisted</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div className={styles.formInput}>
              <label htmlFor="game">Game:</label>
              <select name="game" onChange={(e) => setGame(e.target.value)}>
                <option value=""></option>
                <option value="rocketleague">Rocket League</option>
                <option value="vlorant">Valorant</option>
                <option value="rust">Rust</option>
                <option value="minecraft">Minecraft</option>
                <option value="fortnite">Fortnite</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className={styles.formInput}>
            <input
              type="file"
              name="clip"
              accept=".mp4,.gif"
              multiple={false}
              ref={uploadClipRef}
              onChange={uploadClip}
            />
            <label
              htmlFor="clip"
              className={styles.clipUpload}
              onClick={() => uploadClipRef.current.click()}
            >
              Upload Clip
            </label>
            <span className={styles.sizeLimit}>300mb limit</span>
          </div>
          {inputtedVideo ? (
            <>
              <video
                preload="metadata"
                className={styles.videoPreview}
                controls
                ref={uploadClipVideoRef}
                src={inputtedVideo.url + "#t=0.1"}
              ></video>
              <div className={styles.formInput}>
                <input
                  type="file"
                  name="thumbnail"
                  accept=".png,.jpeg,.jpg"
                  multiple={false}
                  ref={uploadImageRef}
                  onChange={uploadThumbnail}
                />
                <label
                  htmlFor="thumbnail"
                  className={styles.imageUpload}
                  onClick={() => uploadImageRef.current.click()}
                >
                  Upload Thumbnail
                  {
                    <span className={styles.imageNamePreview}>
                      <br />
                      {inputtedThumbnail?.name || ""}
                    </span>
                  }
                </label>
                <span className={styles.sizeLimit}>2mb limit</span>
              </div>
            </>
          ) : (
            <div className={styles.mediaPreview}></div>
          )}
          <button
            type="submit"
            className={styles.submitBtn}
            aria-label="Sign In"
          >
            Upload
          </button>
        </form>
      </div>
    </>
  );
}

export default Upload;
