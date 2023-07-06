import React from "react";
import styled from "styled-components";

export default function Stickman(position) {
  const ImageStick = styled.div`
    position: fixed;
    top: 100px;
    left: 100px;
    width: 50px;
    height: 100px;
    background-color: black;
  `;
  return <ImageStick />;
}
