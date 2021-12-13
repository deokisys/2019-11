import { Products } from "./../../models/Products";
import * as Faker from "faker";
import { define } from "typeorm-seeding";
import moment from "moment";
import * as Moment from "moment";
import { extendMoment } from "moment-range";
import "moment-timezone";

moment.tz.setDefault("Asia/Seoul");

const randomBetween = (min: number, max: number) => {
  return Math.round(Math.random() * (max - min) + min);
};

define(Products, (faker: typeof Faker, settings: any): Products => {
  const product = new Products();

  const buyerId = !!randomBetween(0, 1)
    ? randomBetween(1, settings.userCount)
    : false;
  const isAuction = !!randomBetween(0, 1);

  const basePrice = faker.random.number();
  const halfPrice = basePrice / 2;
  const minPrice = basePrice / 3;

  const hasExtension = randomBetween(0, 1);
  const registerDate = moment()
    .add(settings.index, "m")
    .format("YYYY-MM-DD HH:mm:ss");
  const auctionDeadline = moment(registerDate)
    .add(3, "m")
    .format("YYYY-MM-DD HH:mm:ss");
  //.add(randomBetween(1, 60), "d")
  // 연장이 유무 여부도 임시 데이터로 입력
  const extensionDate = moment(auctionDeadline)
    .add(1, "m")
    .format("YYYY-MM-DD HH:mm:ss");
  //.add(randomBetween(1, 10), "d")
  // 등록일과 경매종료일 중간값으로 설정
  const soldDate = extendMoment(Moment)
    .range(new Date(registerDate), new Date(auctionDeadline))
    .center()
    .format("YYYY-MM-DD HH:mm:ss");

  faker.locale = "ko"; // faker.locale = "en";
  product.title = faker.commerce.productName();
  product.contents = faker.lorem.paragraphs();
  product.immediatePrice = basePrice;
  product.isAuction = isAuction;
  product.auctionDeadline = auctionDeadline;
  product.extensionDate = extensionDate;

  if (isAuction) {
    product.hopePrice = halfPrice;
    product.startBidPrice = minPrice;
  }

  if (buyerId) {
    product.buyerId = buyerId;
    product.soldPrice = randomBetween(minPrice, basePrice);
    product.soldDate = soldDate;
  }

  product.registerDate = registerDate;
  product.thumbnailUrl = `https://picsum.photos/id/${settings.index}/400/400`;
  product.categoryCode = randomBetween(1, 7);

  //product.images =
  //product.seller =
  //product.bids =

  return product;
});
