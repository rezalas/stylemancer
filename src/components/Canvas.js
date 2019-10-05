import React, { Component } from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

class Canvas extends Component {
  render() {
    return (
      <canvas
        id="canvas"
        css={css`
          width: 100%;
        `}></canvas>
    );
  }
}

export default Canvas;
