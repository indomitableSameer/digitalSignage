import React from "react";
import ContentGrid from "../components/ContentGrid";
import UploadContentForm from "../components/UploadContentForm";

function Content() {
  return (
    <div className="content">
      <UploadContentForm />
      <ContentGrid />
    </div>
  );
}

export default Content;
