import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import useMounted from "./useMounted";

type mediaQueryProps = {
  query: string;
};

export default function useClientMediaQuery({ query }: mediaQueryProps) {
  const mediaQueryResult = useMediaQuery({ query });
  const isMounted = useMounted();
  if (!isMounted) {
    return true;
  }
  return mediaQueryResult;
}
