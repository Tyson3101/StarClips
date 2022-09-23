import Head from "next/head";

type TitleProps = {
  page: string;
  desc: string;
};

function Title({ page, desc }: TitleProps) {
  return (
    <Head>
      <title>{`${page} | StarClips`}</title>
      <meta name="description" content={desc} />
    </Head>
  );
}

export default Title;
