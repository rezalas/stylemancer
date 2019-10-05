import React, { Component } from "react";
import Loop from "../game/Loop";
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
        state: {
          up: false,
          down: false,
          left: false,
          right: false,
          running: false,
          jumping: false,
          grounded: false,
        },
        color: "#ff0000",
      },
      friction: 0.8,
      gravity: 0.4,
    };
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }
  componentDidMount() {
    const page = this.refs.page.getBoundingClientRect();
    this.setState({ page });
  }
  handleKeyDown(e) {
    console.log("down: ", e.keyCode);
    const player = this.state.player;
    switch (e.keyCode) {
      // A, LeftArrow
      case 65:
      case 37:
        player.state.left = true;
        this.setState({ player });
        break;
      case 68:
      case 39:
        player.state.right = true;
        this.setState({ player });
        break;
      default:
        break;
    }
  }
  handleKeyUp(e) {
    console.log("up: ", e.keyCode);
    const player = this.state.player;
    switch (e.keyCode) {
      // A, LeftArrow
      case 65:
      case 37:
        player.state.left = false;
        this.setState({ player });
        break;
      // D, RightArrow
      case 68:
      case 39:
        player.state.right = false;
        this.setState({ player });
        break;
      default:
        break;
    }
  }
  render() {
    return (
      <div
        ref="page"
        onKeyDown={e => this.handleKeyDown(e)}
        onKeyUp={e => this.handleKeyUp(e)}
        tabIndex="0"
        style={{ height: "100%", width: "100%" }}>
        <Animation {...this.state} />
        <Hud handleKeyPress={this.handleKeyPress} />
      </div>
    );
  }
}

export default App;
