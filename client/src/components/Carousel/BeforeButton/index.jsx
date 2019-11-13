import React from 'react'
import styled from 'styled-components'
import Left from '@material-ui/icons/ArrowLeft';

const Container = styled.div`
    width:100%;
    display: ${props => props.display ? 'flex' : 'none'};
    justify-content:center;
    align-items:center;
    opacity:0.3;
    margin:auto;
    z-index:3;
    transition: opacity 0.15s ease-in-out;

    &:hover{
        opacity:1;
    }

    svg{
        width: 100%;
        height: 100%;
    }
`

const Components = (props) => {
    const { onClick, visible } = props

    return (
        <Container display={visible} onClick={onClick}>
            <Left/>
        </Container>
    )
}

export default Components