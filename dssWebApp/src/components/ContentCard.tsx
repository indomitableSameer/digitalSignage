import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
function ContentCard() {
  return (
    <>
      <div className="card" style={{ width: "18rem" }}>
        <img src="../../testImg/1.png" className="card-img-top" />
        <div className="card-body">
          <h5 className="card-title">Test File</h5>
          <h6 className="card-text">File Created : 11.01.23</h6>
          <h6 className="card-text">
            Discription : Fra-Uas Event Presentation
          </h6>
          <button className="btn btn-primary">Delete</button>
        </div>
      </div>
      <div className="card" style={{ width: "18rem" }}>
        <img src="../../testImg/1.png" className="card-img-top" />
        <div className="card-body">
          <h5 className="card-title">Test File</h5>
          <h6 className="card-text">File Created : 11.01.23</h6>
          <h6 className="card-text">
            Discription : Fra-Uas Event Presentation
          </h6>
          <button className="btn btn-primary">Delete</button>
        </div>
      </div>
    </>
  );
}

export default ContentCard;
