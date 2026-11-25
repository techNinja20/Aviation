require('dotenv').config()
const express = require("express");
const app = express();
const PORT = process.env.APP_PORT;
const userRoute = require("./src/route/userRoute");
const { mysqlConnection } = require('./src/config/mysqlConnect');

app.use(express.json()); // middleware to parse incoming JSON requests


const connectToDatabase = async () => {
  try {
    const responseFromDbConnection = await mysqlConnection.getConnection()

    console.log("Database connected successfuly")
    responseFromDbConnection.release()
  } catch (error) {
    console.log("Error: ", error)
  }
}

connectToDatabase()


app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(userRoute)



// NOT FOUND

app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: "Seems you got lost 🙃",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



