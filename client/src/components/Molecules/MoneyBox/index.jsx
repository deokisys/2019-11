import React from "react"
import styled from "styled-components"

const Container = styled.div`
  width: 100%;
  display: flex;

  border-radius: 5px;
  border: #dfdfdf solid 1.5px;
  overflow: hidden;

  input {
    text-align: right;
  }

  &:focus-within {
    border: var(--color-primary) solid 1.5px;

    div {
      background: var(--color-primary);
      color: white;
    }
  }
`

const WonDiv = styled.div`
  width: 2rem;
  height: 2rem;
  background: #dfdfdf;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
`
const NonBorderBox = styled.input`
  font-family: "BMJUA";
  width: 100%;
  padding: 0.25rem 0.5rem;
  box-sizing: border-box;
  border: none;
  outline: none;
  font-size: var(--font-size-md);
`

const Component = ({ money, handler, disabled, ...otherProps }) => {
  const changeHandler = ev => {
    const input = ev.target.value.replace(/[^0-9]/g, "")
    handler(input.substring(0, 9))
  }

  return (
    <Container {...otherProps}>
      <NonBorderBox
        value={money}
        onChange={disabled ? undefined : changeHandler}
        disabled={disabled}
      />
      <WonDiv>
        <span>원</span>
      </WonDiv>
    </Container>
  )
}

export default Component
