const express = require(`express`);
const cors = require(`cors`);
require("dotenv").config();
const cookieParser = require(`cookie-parser`);

const app = express();
const PORT = process.env.APP_PORT;
app.use(cors());
app.use(cookieParser());

const userRoute = require(`./routes/user.route`);
const mejaRoute = require("./routes/meja.route");
const menuRoute = require("./routes/menu.route");
const authRoute = require("./routes/auth.route");
const transaksiRoute = require("./routes/transaksi.route");
const paymentRoute = require("./routes/payment.route");

// app.use(`/auth`, authRoute);
app.use(`/user`, userRoute);
app.use(`/meja`, mejaRoute);
app.use(`/menu`, menuRoute);
app.use("/transaksi", transaksiRoute);
app.use("./payment", paymentRoute);

app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Server kasir app running on port
    ${PORT}`);
});
