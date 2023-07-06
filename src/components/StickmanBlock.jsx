import React from "react";
import styled from "styled-components";

export default function StickmanBlock(stickman) {
  const ImageStick = styled.div`
    position: fixed;
    top: 10px;
    left: 10px;
    width: 100px;
    height: 100px;
    background-color: black;
  `;
  return <ImageStick />;
}
