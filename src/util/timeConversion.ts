import format from "format-duration";

export default function TimeConversion(num: number) {
  return format(num * 1000);
}
