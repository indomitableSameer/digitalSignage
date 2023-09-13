function UploadContentForm() {
  return (
    <>
      <div className="contentform">
        <label className="col-sm-2 col-form-label">Discription</label>
        <input type="text" />
        <label className="col-sm-2 col-form-label">File Name</label>
        <input type="text" />
        <div className="input-group">
          <input
            type="file"
            className="form-control"
            id="inputGroupFile04"
            aria-describedby="inputGroupFileAddon04"
            aria-label="Upload"
          />
          <button
            className="btn btn-primary"
            type="button"
            id="inputGroupFileAddon04"
          >
            Upload
          </button>
        </div>
      </div>
    </>
  );
}
export default UploadContentForm;
