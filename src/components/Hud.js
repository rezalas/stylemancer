import React, { Component } from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

class Hud extends Component {
  render() {
    return (
      <div
        id="hud"
        css={css`
          width: 100%;
          height: 33vh;
          display: block;
          background-color: purple;
        `}></div>
    );
  }
}

export default Hud;
