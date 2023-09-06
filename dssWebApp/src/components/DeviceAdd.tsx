import { MouseEvent, useRef, useState } from "react";
import axios from "axios";
//axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
const api = axios.create({
  baseURL: "http://api.dss.com:8000",
});

function DeviceAdd() {
  const [mac, setMac] = useState("");
  const [loc, setLoc] = useState("");

  const [devicelist, setDeviceList] = useState([""]);

  let api_retrun = [""];
  const getMessage = () => {
    return api_retrun.length != 0 ? <p>{api_retrun}</p> : null;
  };

  const getDevices = async () => {
    let data = await api
      .get("/deviceList")
      .then((res) => {
        console.log(res.data);
        setDeviceList(res.data);
      })
      .catch((error) => {
        // error is handled in catch block
        if (error.response) {
          // status code out of the range of 2xx
          console.log("Data :", error.response.data);
          console.log("Status :" + error.response.status);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Error on setting up the request
          console.log("Error", error.message);
        }
      });
    console.log(data);
  };

  const handleSubmit = async (
    event: MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    let addReqRes = await api
      .post("/addDevice", { Mac: mac, Location: loc })
      .then((res) => console.log(res.status))
      .catch((error) => {
        // error is handled in catch block
        if (error.response) {
          // status code out of the range of 2xx
          console.log("Data :", error.response.data);
          console.log("Status :" + error.response.status);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Error on setting up the request
          console.log("Error", error.message);
        }
      });
    console.log(addReqRes);
    getDevices();
  };

  return (
    <>
      <form id="macaddform">
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Device Mac</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="macid"
              placeholder="Mac Id"
              onChange={(event) => setMac(event.target.value)}
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Device Loc</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="locationid"
              placeholder="Location Id"
              onChange={(event) => setLoc(event.target.value)}
            />
          </div>
        </div>
        <div className="form-group row">
          <div className="col-sm-10">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={(event) => handleSubmit(event)}
            >
              Add
            </button>
          </div>
        </div>
      </form>
      {getMessage()}
    </>
  );
}

export default DeviceAdd;
