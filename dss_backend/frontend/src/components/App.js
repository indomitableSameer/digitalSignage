import React, { Component } from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";
import AddDevicePage from "./AddDevicePage";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div>
            <HomePage/>
            <AddDevicePage/>
        </div>);
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);