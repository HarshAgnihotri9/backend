const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();
app.use(express.json());
app.use(bodyparser.json());

app.get("/", (req, res) => {
  res.send("hiii everyone");
});

const port = process.env.PORT;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(port, () => {
      console.log("connected succesfully");
      console.log("Server started on port no. " + port);
    });
  })
  .catch((error) => {
    console.log(error);
  });
