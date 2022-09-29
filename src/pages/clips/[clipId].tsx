import ClipComponent from "@components/static/Clip";
import ReactToastContainer from "@components/static/ReactToastContainer";
import prisma from "@lib/PrismaClient";
import { Clip, Like, User, Comment } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
interface fullClip extends Clip {
  author: User;
  comments: Comment[];
  likes: Like[];
}
type clipIdProps = {
  clip: fullClip;
};
function ClipId({ clip }: clipIdProps) {
  if (!clip) return <h1>No Clip Found</h1>;
  return (
    <>
      <ReactToastContainer />
      <ClipComponent clip={clip} />
    </>
  );
}

export default ClipId;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const clip = await prisma.clip.findFirst({
    where: { clipId: context.params?.["clipId"] as string },
    include: {
      comments: true,
      likes: true,
      author: true,
    },
  });
  if (!clip)
    return {
      props: {},
    };
  return {
    props: {
      clip,
    },
  };
}
