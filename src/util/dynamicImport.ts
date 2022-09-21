import dynamic, { DynamicOptions } from "next/dynamic";

export default function dynamicImport(
  file: string,
  importOptions: DynamicOptions = { ssr: false }
) {
  return dynamic(() => import("../" + file), { ...importOptions });
}
