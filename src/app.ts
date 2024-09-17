import cors from "cors";
import express from "express";
import path from "path";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import ConnectMongoDb from "connect-mongodb-session";
import { MORGAN_FORMAT } from "./libs/utils/config";
import { T } from "./libs/types/common";
import routerAdmin from "./router-admin";
import router from "./router";

const MongoDBStore = ConnectMongoDb(session); //Store
const store = new MongoDBStore({
  uri: String(process.env.MONGO_URL),
  collection: "sessions", //mongoDB collection session create
});

/** express-1-ENTRANCE */

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("./uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan(MORGAN_FORMAT));

/** express-2-SESSIONS */

app.use(
  session({
    secret: String(process.env.SESSION_SECRET),
    cookie: {
      maxAge: 3600000000,
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(function (req, res, next) {
  const sessionInstance = req.session as T;
  const localsInstance = res.locals;
  localsInstance.member = sessionInstance.member;
  next();
});

/** express-3-WIEW */

/** express-4-ROUTERS */
app.use("/admin", routerAdmin);
app.use("/", router);

export default app;
