import React, { Component } from "react";
import Canvas from "./Canvas";

class Animation extends Component {
  constructor(props) {
    super(props);
    this.updateAnimationState = this.updateAnimationState.bind(this);
  }
  componentDidMount() {
    this.rAF = requestAnimationFrame(this.updateAnimationState);
  }
  updateAnimationState() {
    this.rAF = requestAnimationFrame(this.updateAnimationState);
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.rAF);
  }
  render() {
    return <Canvas {...this.props} />;
  }
}

export default Animation;
