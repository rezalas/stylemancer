import React, { Component } from "react";
import Animation from "./Animation";
import Hud from "./Hud";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: null,
      player: {
        x: 100,
        y: 100,
        width: 120,
        height: 200,
        speed: 3,
        velX: 0,
        velY: 0,
        jumping: false,
        grounded: false,
        color: "#ff0000",
      },
      friction: 0.8,
      gravity: 0.4,
    };
  }
  componentDidMount() {
    const page = this.refs.page.getBoundingClientRect();
    this.setState({ page });
  }
  render() {
    return (
      <div ref="page" style={{ height: "100%", width: "100%" }}>
        <Animation {...this.state} />
        <Hud />
      </div>
    );
  }
}

export default App;
