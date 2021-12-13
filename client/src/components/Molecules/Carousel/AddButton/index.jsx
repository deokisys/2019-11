import React from "react"
import styled from "styled-components"

import FoundImage from "../../../../assets/found.png"
import NotFoundImage from "../../../../assets/notFound.png"
import { size } from "../constant"

const Container = styled.div`
  width: ${size}rem;
  height: ${size}rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
  background-color: white;
`

const Button = styled.input`
    display: inline-block;
    width: 15rem;
    height: 15rem;
    overflow: hidden;
    box-sizing: border-box;
    border-radius: 20px;
    padding: 15rem 0 0 0;
    background: url(${NotFoundImage}) no-repeat center center;
    background-size:cover;
    border:none;
    outline: none;

    transition: background .5s ease-in-out;

    &:hover{
    background-image: url('${FoundImage}');
    }
`

const Span = styled.span`
  font-family: "BMJUA";
  width: 100%;
  word-break: keep-all;
`

const Component = props => {
  const { trigger } = props
  const handleFile = ev => {
    const files = ev.target.files
    trigger(files)
  }

  return (
    <Container>
      <Button type={"file"} onChange={handleFile} />
      <Span>이미지를 끌어다 놓거나 클릭해주세요</Span>
    </Container>
  )
}

export default Component
