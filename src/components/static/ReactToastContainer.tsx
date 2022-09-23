import React from "react";
import { ToastContainer, ToastContainerProps } from "react-toastify";

function ReactToastContainer(props?: ToastContainerProps) {
  return (
    <ToastContainer
      theme={"dark"}
      autoClose={6000}
      pauseOnHover={true}
      position={"bottom-left"}
      pauseOnFocusLoss={false}
      {...props}
    />
  );
}

export default ReactToastContainer;
