import React, { useState, useContext, useRef, useReducer } from "react"
import styled from "styled-components"

import Header from "../../components/Atoms/Header"
import TradeBox from "../../components/Organisim/TradeBox"
import InfiniteScroll from "../../components/Molecules/InfiniteScroll"
import Footer from "../../components/Atoms/Footer"

import userContext from "../../context/UserContext"

import apiConfig from "../../config/api"
import pathConfig from "../../config/path"
import { getFetch } from "../../services/fetchService"

import { limits } from "./contants"

const { url, apiUrl } = apiConfig
const { products } = pathConfig

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 60rem;
  height: 90%;
  padding: 1rem;
  margin: 5px auto;
  border-radius: 30px;
  overflow-y: auto;
`

const ScrollFrame = styled.div`
  width: 60rem;
  height: 90%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`

const Page = () => {
  const [user] = useContext(userContext)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const reset = useRef(false)

  const fetcher = async () => {
    const fetchUrl = `${apiUrl}${products}/onlySale/${user.id}/${offset}/${limits}`
    const [list, cnt] = await getFetch(fetchUrl)
    setOffset(offset + list.length)
    setHasMore(offset.current < cnt)

    return list.map(value => {
      return {
        key: value.id,
        id: value.id,
        link: `${url}/products/${value.id}`,
        title: value.title,
        status: "경매중",
        thumbnail: value.thumbnailUrl,
        price: value.immediatePrice,
        time: new window.Date(value.registerDate)
      }
    })
  }

  const drawer = item => item.map(value => <TradeBox {...value} />)

  return (
    <Container>
      <ContentContainer>
        <Header text={"경매중인 내 상품"} />
        <ScrollFrame>
          <InfiniteScroll
            fetcher={fetcher}
            drawer={drawer}
            hasMore={hasMore}
            reset={reset.current}
          />
        </ScrollFrame>
      </ContentContainer>
      <Footer />
    </Container>
  )
}

export default Page
