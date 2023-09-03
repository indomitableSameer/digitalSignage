function DeviceAdd(){
    return(
        <div>
            <form>
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Device Mac</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" id="macid" placeholder="Mac Id"/>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Device Loc</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" id="locationid" placeholder="Location Id"/>
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-10">
                    <button type="submit" className="btn btn-primary">Add</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default DeviceAdd;