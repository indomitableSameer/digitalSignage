function UploadContentForm() {
  return (
    <>
      <div className="input-group contentform">
        <label className="col-sm-2 col-form-label">
          <span>Discription</span>
        </label>
        <input type="text" className="form-control" />
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
    </>
  );
}
export default UploadContentForm;
