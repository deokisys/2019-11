import { getManager, EntityRepository, EntityManager, MoreThanOrEqual } from "typeorm"
import { AuctionLogs } from "../models/AuctionLogs"
import { Products } from "../models/Products"
import { Images } from "../models/Images"
import { prevDay } from "../util/DateUtils"

@EntityRepository()
export class LogReporsitory {
  constructor(private readonly em: EntityManager) {}

  public find() {
    return this.em.find(AuctionLogs)
  }

  public findOne(id: number) {
    return this.em.findOne(AuctionLogs, id)
  }

  public async findBuyLogs(user_id: number, dayago: number, page: number, limit: number) {
    let result = await this.em.query(
      "select '구매' as type, i.image_url, p.id as product_id, p.title, p.hope_price, p.register_date, p.is_sale, p.user_id as register_user, a.auction_price, a.auction_date, a.user_id as buy_user, a.is_winning from products as p join auction_logs as a on p.id=a.product_id join ( select i1.id,i1.product_id,i1.image_url from images as i1 join (select product_id,min(id) as id from images group by product_id) as a on i1.id=a.id) i on p.id=i.product_id where a.is_winning=true and a.user_id=? and a.auction_date>=? order by a.auction_date desc limit ?,?",
      [user_id, prevDay(dayago), (page - 1) * limit, limit]
    )
    let count = await this.em.query(
      "select count(*) as count from products as p join auction_logs as a on p.id=a.product_id where is_winning=true and a.user_id=? and a.auction_date>=?",
      [user_id, prevDay(dayago)]
    )

    return [result, count[0].count]

    // return this.em.findAndCount(AuctionLogs, {
    //   relations: ["product", "user"],
    //   where: {
    //     user: { id: user_id },
    //     isWinning: true,
    //     auctionDate: MoreThanOrEqual(prevDay(dayago)),
    //     Images: {
    //       relations: ["product"],
    //       where: { product: { id: 2 } }
    //     }
    //   },
    //   order: {
    //     auctionDate: "DESC"
    //   },
    //   skip: (page - 1) * limit,
    //   take: limit,
    //   cache: true
    // })
  }

  public async findSaleLogs(user_id: number, dayago: number, page: number, limit: number) {
    let result = await this.em.query(
      "select '판매' as type, i.image_url, p.id as product_id, p.title, p.hope_price, p.register_date, p.is_sale, p.user_id as register_user, a.auction_price, a.auction_date, a.user_id as buy_user, a.is_winning from products as p join auction_logs as a on p.id=a.product_id join ( select i1.id,i1.product_id,i1.image_url from images as i1 join (select product_id,min(id) as id from images group by product_id) as a on i1.id=a.id) i on p.id=i.product_id where a.is_winning=true and p.user_id=? and a.auction_date>=? order by a.auction_date desc limit ?,?",
      [user_id, prevDay(dayago), (page - 1) * limit, limit]
    )
    let count = await this.em.query(
      "select count(*) as count from products as p join auction_logs as a on p.id=a.product_id where is_winning=true and p.user_id=? and a.auction_date>=?",
      [user_id, prevDay(dayago)]
    )

    return [result, count[0].count]
  }

  public async findAllLogs(user_id: number, dayago: number, page: number, limit: number) {
    let result = await this.em.query(
      "select * from (select '구매' as type, i.image_url, p.id as product_id, p.title, p.hope_price, p.register_date, p.is_sale, p.user_id as register_user, a.auction_price, a.auction_date, a.user_id as buy_user, a.is_winning from products as p join auction_logs as a on p.id=a.product_id join ( select i1.id,i1.product_id,i1.image_url from images as i1 join (select product_id,min(id) as id from images group by product_id) as a on i1.id=a.id) i on p.id=i.product_id where a.is_winning=true and a.user_id=? and a.auction_date>=? union all select '판매' as type, i.image_url, p.id as product_id, p.title, p.hope_price, p.register_date, p.is_sale, p.user_id as register_user, a.auction_price, a.auction_date, a.user_id as buy_user, a.is_winning from products as p join auction_logs as a on p.id=a.product_id join ( select i1.id,i1.product_id,i1.image_url from images as i1 join (select product_id,min(id) as id from images group by product_id) as a on i1.id=a.id) i on p.id=i.product_id where a.is_winning=true and p.user_id=? and a.auction_date>=?) logall order by 8 desc limit ?,?",
      [user_id, prevDay(dayago), user_id, prevDay(dayago), (page - 1) * limit, limit]
    )
    let count = await this.em.query(
      "select count(*) as count from (select p.title,p.hope_price,p.register_date,p.is_sale,p.user_id as register_user,a.auction_price,a.auction_date,a.product_id as product_id ,a.user_id as buy_user,a.is_winning from products as p join auction_logs as a on p.id=a.product_id where a.user_id=? and a.is_winning=true and a.auction_date>=? union all select p2.title,p2.hope_price,p2.register_date,p2.is_sale,p2.user_id as register_user,a2.auction_price,a2.auction_date,a2.product_id as product_id ,a2.user_id as buy_user,a2.is_winning from products as p2 join auction_logs as a2 on p2.id=a2.product_id where p2.user_id=?  and a2.is_winning=true and a2.auction_date>=?) countall",
      [user_id, prevDay(dayago), user_id, prevDay(dayago)]
    )
    return [result, count[0].count]
  }

  public save(auctionLogs: AuctionLogs) {
    return this.em.save(auctionLogs)
  }
}
