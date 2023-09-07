import { MouseEvent, useRef, useState } from "react";
import axios, { HttpStatusCode } from "axios";
//axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
const api = axios.create({
  baseURL: "http://api.dss.com:8000",
});

function DeviceAdd() {
  const [mac, setMac] = useState("");
  const [loc, setLoc] = useState("");
  const [alertMsg, setAlertMsg] = useState("");

  const [devicelist, setDeviceList] = useState([""]);

  const getMessage = () => {
    return alertMsg.length != 0 ? (
      <div className="alert alert-danger" role="alert">
        {alertMsg}
      </div>
    ) : (
      ""
    );
  };

  const getDevices = async () => {
    setAlertMsg("");
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
    setAlertMsg("");
    let addReqRes = await api
      .post("/addDevice", { Mac: mac, Location: loc })
      .then((res) =>
        res.status == HttpStatusCode.Ok
          ? setAlertMsg("Added Entry Successfully!")
          : setAlertMsg(String(res.data))
      )
      .catch((error) => {
        setAlertMsg(String(error.message));
      });

    //console.log(addReqRes);
    //getDevices();
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
          <label className="col-sm-2 col-form-label">Country</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="countryid"
              placeholder="Country"
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
