function Login(){
    return(
        <div>
            <form>
            <div className="form-group row">
                <label className="col-sm-2 col-form-label">Email</label>
                <div className="col-sm-10">
                    <input type="email" className="form-control" id="inputEmail3" placeholder="Email"/>
                </div>
            </div>
            <div className="form-group row">
                <label className="col-sm-2 col-form-label">Password</label>
                <div className="col-sm-10">
                    <input type="password" className="form-control" id="inputPassword3" placeholder="Password"/>
                </div>
            </div>
            <fieldset className="form-group">
                <div className="row">
                    <legend className="col-form-label col-sm-2 pt-2">Type</legend>
                    <div className="col-sm-10">
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="gridRadios" id="installer" value="installer"/>
                            <label className="form-check-label">Installer</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="gridRadios" id="admin" value="admin"/>
                            <label className="form-check-label">Admin</label>
                        </div>
                    </div>
                </div>
            </fieldset>
            <div className="form-group row">
                <div className="col-sm-10">
                <button type="submit" className="btn btn-primary">Sign in</button>
                </div>
            </div>
            </form>
        </div>
    );
}

export default Login;