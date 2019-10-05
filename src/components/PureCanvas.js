import React, { Component } from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

class PureCanvas extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return (
      <canvas
        ref={node =>
          node ? this.props.contextRef(node.getContext("2d")) : null
        }
        width={window.innerWidth}
        height={window.innerHeight * 0.67}
        css={css`
          display: block;
        `}></canvas>
    );
  }
}

export default PureCanvas;
