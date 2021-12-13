import React from "react"
import styled from "styled-components"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 5rem;
  text-align: left;
  box-sizing: border-box;
  align-items: flex-start;
  padding: 0.5rem;
`

const Text = styled.span`
  font-size: var(--font-size-xxl);
  font-weight: 700;
  color: var(--color-secondary);
`

const Header = ({ text }) => {
  return (
    <Container>
      <Text>{text}</Text>
    </Container>
  )
}

export default Header
