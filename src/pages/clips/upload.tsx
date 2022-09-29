import ReactToastContainer from "@components/static/ReactToastContainer";
import Title from "@components/static/Title";
import styles from "@styles/Upload.module.css";
import { useSession } from "next-auth/react";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import token from "randomatic";
import Link from "next/link";

type Media = {
  name: string;
  file: File;
  url: string;
  type: string;
};

function Upload() {
  const { data: session, status } = useSession();
  const uploadClipVideoRef = useRef() as { current: HTMLVideoElement };
  const uploadClipRef = useRef() as { current: HTMLInputElement };
  const uploadImageRef = useRef() as { current: HTMLInputElement };
  const [inputtedThumbnail, setInputtedThumbnail] = useState<Media>();
  const [inputtedVideo, setInputtedVideo] = useState<Media | null>();
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    if (status === "unauthenticated") setMessage("| Log in to upload a clip!");
    console.log(status);
  }, [status]);

  const [title, setTitle] = useState("");
  const [visabilty, setVisabilty] = useState("public");
  const [game, setGame] = useState("");

  async function uploadVideoToCDN(e: FormEvent<HTMLFormElement>) {
    let clipId = token("Aa0", 15 + Math.floor(Math.random() * 15));
    e.preventDefault();
    if (!title || !visabilty || !game)
      return toast("Please Input a Title and Game", { type: "error" });
    if (!inputtedVideo?.file)
      return toast("Please upload a clip", { type: "error" });
    const id = toast.loading(
      "Uploading Clip... | Could take up to 2 mins depending on file size",
      { toastId: "uploadclip" }
    );
    setUploading(true);
    setMessage("Uploading...");
    const serverSendData = {
      title,
      visabilty,
      game,
      thumbnail: inputtedThumbnail,
      video: inputtedVideo,
      clipId,
    };
    const CDNSendData = new FormData();
    for (let key of Object.keys(inputtedVideo as any)) {
      CDNSendData.append("clip_" + key, (inputtedVideo as any)[key]);
    }
    if (inputtedThumbnail) {
      for (let key of Object.keys(inputtedVideo as any)) {
        CDNSendData.append("thumbnail_" + key, (inputtedThumbnail as any)[key]);
      }
    }
    try {
      CDNSendData.append("email", session?.user?.email!);
      CDNSendData.append("addClip", "true");
      CDNSendData.append("id", clipId);

      const resCDN = await fetch(process.env.NEXT_PUBLIC_CDN_URL + "/clips", {
        method: "POST",
        headers: {
          authorization: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
        },
        body: CDNSendData,
      });
      if (resCDN.ok) {
        const { videoURL, thumbnailURL } = await resCDN.json();
        const resDB = await fetch("/api/clips", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            addClip: true,
            id: clipId,
            videoURL,
            thumbnailURL,
            ...serverSendData,
          }),
        });
        if (resDB.ok) {
          toast.update(id, {
            render: "Uploaded!",
            type: "success",
            isLoading: false,
            closeButton: true,
            autoClose: 5000,
          });
          setLink("http://localhost:3000/clips/" + clipId);
          setMessage("Clip uploaded at ");
        } else Promise.reject((await resDB.json()).error);
      } else Promise.reject((await resCDN.json()).error);
    } catch (e: any) {
      toast.update(id, {
        render: e,
        type: "error",
        isLoading: false,
        closeButton: true,
        autoClose: 5000,
      });
    }
    setUploading(false);
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
      type: eventFile.name.match(/\.gif$/)?.length ? "gif" : "video",
    };
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

    setInputtedThumbnail(media);
  }
  console.log(inputtedVideo);
  return (
    <>
      <Title page="Upload" desc="Upload Clip Page" />
      <ReactToastContainer autoClose={3000} />
      <div className={styles.uploadPage}>
        <header>
          <h2>Upload Clip</h2>
          <span>
            {message}
            <Link href={link}>
              <a>{link}</a>
            </Link>
          </span>
        </header>
        <form autoComplete="off" spellCheck={false} onSubmit={uploadVideoToCDN}>
          <div className={styles.details}>
            <div className={styles.formInput}>
              <label htmlFor="Title">Title:</label>
              <input
                disabled={status !== "authenticated" || uploading}
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
                disabled={status !== "authenticated" || uploading}
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
              <select
                disabled={status !== "authenticated" || uploading}
                name="game"
                onChange={(e) => setGame(e.target.value)}
              >
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
              disabled={status !== "authenticated" || uploading}
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
              {inputtedVideo.type === "gif" ? (
                <img src={inputtedVideo.url} className={styles.videoPreview} />
              ) : (
                <video
                  preload="metadata"
                  className={styles.videoPreview}
                  controls
                  ref={uploadClipVideoRef}
                  src={inputtedVideo.url + "#t=0.1"}
                ></video>
              )}
              {inputtedVideo.type === "gif" ? null : (
                <div className={styles.formInput}>
                  <input
                    disabled={status !== "authenticated" || uploading}
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
              )}
            </>
          ) : (
            <div className={styles.mediaPreview}>
              <span>Video Preview</span>
            </div>
          )}
          <button
            type="submit"
            className={styles.submitBtn}
            aria-label="Upload Video"
            disabled={uploading}
          >
            Upload
          </button>
        </form>
      </div>
    </>
  );
}

export default Upload;
