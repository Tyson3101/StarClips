import { BiSearchAlt2 } from "react-icons/bi";

type SearchBarProps = {
  size: {
    width?: string;
    height: string;
    svg: number;
  };
};

function SearchBar({ size: { height, svg: svgSize } }: SearchBarProps) {
  return (
    <>
      <input
        style={{
          height,
          outline: "none",
          backgroundColor: "whitesmoke",
          border: "none",
          borderRadius: "4%",
          textIndent: "5px",
        }}
        type={"text"}
        placeholder={"Fortnite"}
      />{" "}
      <button style={{ height, outline: "none" }} name="Search Button">
        <BiSearchAlt2 size={svgSize} />
      </button>
    </>
  );
}

export default SearchBar;
