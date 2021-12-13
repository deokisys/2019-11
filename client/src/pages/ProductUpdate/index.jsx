import React, { useState, useEffect } from "react";
import styled from "styled-components";

import Spinner from "../../components/Atoms/Spinner";
import Button from "../../components/Atoms/BoxButton";
import Carousel from "../../components/Molecules/Carousel";
import TitleBox from "../../components/Atoms/InputWithLimit";
import MoneyBox from "../../components/Molecules/MoneyBox";
import ItemDescription from "../../components/Atoms/TextareaWithLength";
import Header from "../../components/Atoms/Header";
import ToggleButton from "../../components/Atoms/ToggleButton";
import AlertDialog from "../../components/Molecules/AlertDialog";

import apiConfig from "../../config/api";
import pathConfig from "../../config/path";

import { getFetch, putJsonFetch } from "../../services/fetchService";
import { term2ReaminString } from "../../utils/converter";
import { validDialog, invalidDialog } from "./constants";
import { limits } from "../../constants/values";
import { message } from "../../constants/strings";
import { strEmpty } from "../../utils/validator";

const { apiUrl } = apiConfig;
const { products } = pathConfig;

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

const ContentDiv = styled.div`
  width: 80%;
  margin: 0 auto;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;

const TopContentDiv = styled.div`
  width: 100%;
  height: 23rem;
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const CarouselDiv = styled.div`
  width: 23rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border-radius: 10px;
  border: var(--color-gray) solid 1px;
`;

const InputDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: calc(100% - 20rem);
  max-width: 30rem;
  height: 100%;
  font-family: "BMJUA";
`;

const MoneyDiv = styled.div`
  width: 17.5rem;
  display: flex;
  height: fit-content;
  flex-direction: column;
  margin: 0.25rem 0;
`;

const ItemTitle = styled.span`
  text-align: left;
  font-size: 1.1rem;
  font-weight: 500;
`;

const RemainTerm = styled.span`
  text-align: end;
  font-size: var(--font-size-sm);
`;

const SelectorDiv = styled.div`
  width: 15rem;
  margin: 0.5rem 0;
  text-align: right;
`;

const AuctionDiv = styled.div`
  display: flex;
  width: 15rem;
  height: 2rem;
  justify-content: space-between;
  align-items: center;
`;

const Component = ({ match }) => {
  const productId = match.params.id;

  const [isLoading, setLoading] = useState(true);
  const [origin, setOrigin] = useState({});

  const [newTitle, setNewTitle] = useState("");
  const [newImgList, setNewImgList] = useState([]);
  const [newContent, setNewContent] = useState("");
  const [remainDate, setRemain] = useState("");
  const [open, setOpen] = useState(false);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    (async () => {
      const [json] = await getFetch(`${apiUrl}${products}/${productId}`);
      const { title, contents, images } = json;

      setOrigin(json);
      setNewTitle(title);
      setNewImgList(images.map(v => v.imageUrl));
      setNewContent(contents);

      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (origin) {
      if (origin.auctionDeadline == null) setRemain("비 경매 상품입니다.");
      else setRemain(term2ReaminString(Date.now(), origin.auctionDeadline));
    }
  }, [origin, remainDate, setRemain]);

  const validation = () => {
    setValid(!strEmpty(newTitle) && !strEmpty(newContent));
    setOpen(true);
  };

  const updateProduct = async () => {
    const result = await putJsonFetch(
      `${apiUrl}${products}/${origin.id}`,
      {},
      {
        title: newTitle,
        contents: newContent
      }
    );

    if (result.id === origin.id) window.location = `/products/${origin.id}`;
    else {
      alert(message.serverBusy);
      window.location = `/`;
    }
  };

  return isLoading ? (
    <Spinner />
  ) : (
    <Container>
      <ContentDiv>
        <Header text={"상품 정보 수정"} />
        <TopContentDiv>
          <CarouselDiv>
            <Carousel list={newImgList} handler={setNewImgList} readOnly={true} />
          </CarouselDiv>
          <InputDiv>
            <TitleBox
              hint={"상품 제목"}
              value={newTitle}
              limit={limits.productTitle}
              onChange={v => setNewTitle(v)}
              isBlockMode={true}
            />
            <SelectorDiv>
              <RemainTerm>{remainDate}</RemainTerm>
            </SelectorDiv>
            <AuctionDiv>
              <ItemTitle>경매</ItemTitle>
              <ToggleButton checked={origin.isAuction} />
            </AuctionDiv>
            <MoneyDiv>
              <ItemTitle>즉시 구매가</ItemTitle>
              <MoneyBox money={origin.immediatePrice} disabled />
            </MoneyDiv>
            {(() => {
              if (origin.isAuction)
                return (
                  <>
                    <MoneyDiv>
                      <ItemTitle>경매 시작가</ItemTitle>
                      <MoneyBox money={origin.startBidPrice} disabled />
                    </MoneyDiv>
                    <MoneyDiv>
                      <ItemTitle>낙찰 예상가</ItemTitle>
                      <MoneyBox money={origin.hopePrice} disabled />
                    </MoneyDiv>
                  </>
                );
            })()}
          </InputDiv>
        </TopContentDiv>
        <ItemDescription
          title={"상품 설명"}
          content={newContent}
          handler={setNewContent}
          limit={limits.productContent}
          isBlockMode={true}
        />
        <ButtonContainer>
          <Button text={"수정"} onClick={e => validation()} />
        </ButtonContainer>
      </ContentDiv>
      {open ? (
        <AlertDialog
          title={valid ? validDialog.title : invalidDialog.title}
          content={valid ? validDialog.content : invalidDialog.content}
          cancelAble={valid ? validDialog.cancelAble : invalidDialog.cancelAble}
          onAccept={valid ? () => updateProduct() : undefined}
          onDismiss={() => setOpen(false)}
        />
      ) : (
        undefined
      )}
    </Container>
  );
};

export default Component;
