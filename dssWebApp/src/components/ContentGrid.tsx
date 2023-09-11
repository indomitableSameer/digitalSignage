function ContentGrid() {
  const getContent = () => {
    return [
      {
        img: "../../testImg/1.png",
        filename: "Test File",
        createdAt: "11.01.23",
        discription: "Presentation1",
      },
      {
        img: "../../testImg/1.png",
        filename: "Test File2",
        createdAt: "12.01.23",
        discription: "Presentation2",
      },
      {
        img: "../../testImg/1.png",
        filename: "Test File3",
        createdAt: "15.05.23",
        discription: "Presentation3",
      },
      {
        img: "../../testImg/1.png",
        filename: "Test File",
        createdAt: "11.01.23",
        discription: "Presentation1",
      },
      {
        img: "../../testImg/2.png",
        filename: "Test File2",
        createdAt: "12.01.23",
        discription: "Presentation2",
      },
      {
        img: "../../testImg/2.png",
        filename: "Test File3",
        createdAt: "15.05.23",
        discription: "Presentation3",
      },
    ];
  };
  return (
    <div className="container">
      <div className="row row-cols-auto contentgrid">
        {getContent().map((item, index) => {
          return (
            <div key={index} className="col">
              <div className="card" style={{ width: "18rem" }}>
                <img src={item.img} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">{item.filename}</h5>
                  <h6 className="card-text">File Created: {item.createdAt}</h6>
                  <h6 className="card-text">{item.discription}</h6>
                  <button className="btn btn-primary">Delete</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ContentGrid;
