import React, { Component } from "react";
import PureCanvas from "./PureCanvas";

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.saveContext = this.saveContext.bind(this);
  }

  saveContext(ctx) {
    this.ctx = ctx;
    this.width = this.ctx.canvas.width;
    this.height = this.ctx.canvas.height;
  }

  componentDidUpdate() {
    const { player } = this.props;
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = this.props.player.color;
    this.ctx.fillRect(
      player.x,
      player.y,
      player.width,
      player.height
    );
    this.ctx.restore();
  }

  render() {
    return (
      <PureCanvas contextRef={this.saveContext} {...this.props} />
    );
  }
}

export default Canvas;
