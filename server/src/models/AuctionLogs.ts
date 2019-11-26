import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Products } from "./Products"
import { Users } from "./Users"

@Entity()
export class AuctionLogs {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  auctionPrice: number

  @Column()
  auctionDate: Date

  @Column()
  isWinning: boolean

  @ManyToOne(
    type => Products,
    products => products.auctionLogs
  )
  product: Products
  @ManyToOne(
    type => Users,
    users => users.auctionLogs
  )
  user: Users
}
