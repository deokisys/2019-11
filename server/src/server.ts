import "dotenv/config";
import "reflect-metadata";

/**
 * IOC Container, DI based on Decorator, ORM
 */
import { Container } from "typedi";
import {
  useExpressServer,
  useContainer as routingUseContainer,
  Action
} from "routing-controllers";
import {
  getRepository,
  createConnection,
  useContainer as ormUseContainer
} from "typeorm";


/**
 * Custom Setting Import
 */
import { CustomNamingStrategy } from "./custom/CustomNamingStrategy";

/**
 * Load Apps(web, database etc)
 */
import app from "./app";
import { Users } from "./models/Users";

routingUseContainer(Container);
ormUseContainer(Container);
createConnection({
  type: "mysql",
  host:
    process.env.NODE_ENV === "development"
      ? process.env.DB_DOCKER_COMPOSE_SERVICE_HOST
      : process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: true,
  entities: [__dirname + "/models/*.js"],
  synchronize: process.env.NODE_ENV === "development" ? true : false,
  charset: "utf8mb4",
  namingStrategy: new CustomNamingStrategy()
})
  .then()
  .catch(err => console.log(err));

const expressApp = useExpressServer(app, {
  routePrefix: "api",
  controllers: [__dirname + "/controllers/**/*.js"],
  middlewares: [__dirname + "/middlewares/**/*.js"],
  authorizationChecker: async (action: Action) => {
    const token = action.request.headers["access-token"];
    const user = await getRepository(Users).findOne({
      where: { accessToken: token }
    });
    if (user === undefined) return false;
    return !!(action.request.user = {
      id: (<Users>user).id,
      name: (<Users>user).name
    });
  }
  // interceptors: [__dirname + "/interceptors/**/*.js"]
});

expressApp.listen(3000, () => {
  console.log("=====Express Server Started=====");
  console.log("=====Process Env=====");
  console.dir(process.env.NODE_ENV);
  console.dir(process.env);
});
