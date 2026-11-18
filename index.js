const express = require("express");
const app = express();
const PORT = 8798;
const crypto = require("crypto");
const mysql = require("mysql2/promise");
const { v4 : uuidv4 } = require('uuid');
const Joi = require('joi');

app.use(express.json()); // middleware to parse incoming JSON requests
// Create the connection to database
const mysqlConnection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "Aviator",
  port: 8889,
});



 const AirportSchema = Joi.object({
  airport_name: Joi.string().required(),
  city: Joi.string().required().messages({
    'string.empty': 'City cannot be empty',
  }),
  country: Joi.string().required().messages({
    'string.empty': 'Country cannot be empty',
  }),
  country_code: Joi.string().length(3).optional().messages({
    'string.length': 'Country code must be 3 characters long',
  }),
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

// AIRPORT
app.post("/create/airport", async (req, res) => {
  
  const { airport_name, city, country, country_code } = req.body;

  try {
  const validateResult = AirportSchema.validate({ airport_name, city, country, country_code });
  // console.log("see", validateResult.error.details[0].message);

  if (validateResult.error) {
    throw new Error(validateResult.error.details[0].message);
  }


    const checkAirportSqlQuery =
      "SELECT * FROM `Airport` WHERE airport_name = ?";
    const [checkResults, checkFields] = await mysqlConnection.query(
      checkAirportSqlQuery,
      [airport_name],
    );

    if (checkResults.length > 0) {
      throw new Error("Airport already exists");
    }

    // const airportId = crypto.randomUUID(); 
    const airportId = uuidv4(); // Generate a unique ID for the airport
    
    const sqlQuery = "INSERT INTO `Airport` (airport_id, airport_name, city, country, country_code) VALUES (?, ?, ?, ?, ?)";
    const [results, fields] = await mysqlConnection.query(sqlQuery, [
      airportId,
      airport_name,
      city,
      country,
      country_code,
    ]);

    res.status(200).json({
      status: true,
      message: "Airport created successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

app.get("/airports", async (req, res) => {
  try {
    // const sqlQuery = "SELECT * FROM `Airport`";
    const [results, fields] = await mysqlConnection.query(
      "SELECT * FROM `Airport`",
    );

    if (results.length === 0) {
      throw new Error("No airports found");
    }

    res.status(200).json({
      status: true,
      message: "All airports retrieved",
      data: results,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

app.get("/airport/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const sqlQuery = "SELECT * FROM `Airport` WHERE airport_id = ?";
    const [results, fields] = await mysqlConnection.query(sqlQuery, [id]);

    if (results.length === 0) {
      throw new Error("Invalid airport information");
    }
    console.log("see", results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available

    res.status(200).json({
      status: true,
      message: "Airport retrieved",
      data: results,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

// previous Update
app.put("/update/airport/:id", async (req, res) => {
  const { id } = req.params;
  const { airport_name, city, country, country_code } = req.body;

  try {
    const sqlQuery =
      "UPDATE `Airport` SET airport_name = ?, city = ?, country = ?, country_code = ? WHERE airport_id = ?";
    const [results, fields] = await mysqlConnection.query(sqlQuery, [
      airport_name,
      city,
      country,
      country_code,
      id,
    ]);

    if (results.affectedRows === 0) {
      throw new Error("Invalid airport information");
    }

    res.status(200).json({
      status: true,
      message: "Airport updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

// Latest Update
app.put("/update/airport/:id", async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  const validateResult = AirportSchema.validate(body);
  if (validateResult.error) {
    return res.status(400).json({
      status: false,
      message: validateResult.error.details[0].message,
    });
  }

  try {
    const fieldsToUpdate = Object.keys(body); // airport_name, city, country, country_code
    const valuesToUpdate = Object.values(body); //MM

    const pickingAllKeys = fieldsToUpdate
      .map((key) => {
        return [`${key} = ?`];
      })
      .join(", "); // airport_name = ?, city =?, country, country_code
    const queryies = `UPDATE Airport SET ${pickingAllKeys} WHERE airport_id = ?`;

    const setClause = fieldsToUpdate.map((field) => `${field} = ?`).join(", ");
    const sqlQuery = `UPDATE \`Airport\` SET ${setClause} WHERE airport_id = ?`;

    const [results, fields] = await mysqlConnection.query(sqlQuery, [
      ...valuesToUpdate,
      id,
    ]);

    if (results.affectedRows === 0) {
      throw new Error("Invalid airport information");
    }

    res.status(200).json({
      status: true,
      message: "Airport updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});
// AIRCRAFT

app.get("/aircrafts", (req, res) => {
  res.status(200).json({
    status: true,
    message: "All aircrafts retrieved",
    data: AIRCRAFT,
  });
});

app.post("/create/aircraft", (req, res) => {
  const { aircraft_name, seat_capacity } = req.body;

  const reg = crypto.randomUUID();

  const reg_number = reg.split("-")[0];

  if (!aircraft_name || !seat_capacity) {
    res.status(400).json({
      status: false,
      message: "Provide all necessary fields",
    });
    return;
  }

  AIRCRAFT.push({ id: AIRCRAFT.length + 1, reg_number, ...req.body });

  res.status(200).json({
    status: true,
    message: "Aircraft created",
  });
});

app.get("/aircraft/:id", (req, res) => {
  const { id } = req.params;

  const singleAircraft = AIRCRAFT.find((a) => a.id === Number(id));

  if (singleAircraft === undefined) {
    res.status(400).json({
      status: false,
      message: "Invalid aircraft information",
    });
    return;
  }

  res.status(200).json({
    status: true,
    message: "Aircraft retrieved",
    data: singleAircraft,
  });
});

app.delete("/delete/aircraft/:id", (req, res) => {
  const { id } = req.params;

  try {
    // const checkIfExists = AIRCRAFT.findIndex((ele) => ele.id === Number(id));
    const sqlQuery = "DELETE FROM `Aircraft` WHERE aircraft_id = ?";  
    const [results, fields] = mysqlConnection.query(sqlQuery, [id]);

    if (results === -1) {
      throw new Error("Aircraft not found");
    }

    // AIRCRAFT.splice(results, 1);

    res.status(200).json({
      status: true,
      message: "Aircraft deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

// USER

app.get("/users", (req, res) => {
  res.status(200).json({
    status: true,
    message: "All users retrieved",
    data: USERS,
  });
});

app.get("/user/:id", (req, res) => {
  const { id } = req.params;

  const singleuser = USERS.find((a) => a.id === Number(id));

  if (singleuser === undefined) {
    res.status(400).json({
      status: false,
      message: "Invalid user information",
    });
    return;
  }

  res.status(200).json({
    status: true,
    message: "User retrieved",
    data: singleuser,
  });
});

app.post("/create/user", (req, res) => {
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password) {
    res.status(400).json({
      status: false,
      message: "All fields are required",
    });
    return;
  }

  const checkIfUserExists = USERS.find((ele) => ele.email === email);

  if (checkIfUserExists) {
    res.status(400).json({
      status: false,
      message: "User exists, Please signup with a different email",
    });
    return;
  }

  const details = { id: USERS.length + 1, ...req.body };

  USERS.push(details);

  res.status(200).json({
    status: true,
    message: "User created successfully",
  });
});

app.patch("/update/user/:userId", (req, res) => {
  const { userId } = req.params;

  const userDetailsToBeUpdated = USERS.find((u) => u.id === Number(userId));

  if (!userDetailsToBeUpdated) {
    return res.status(400).json({
      status: false,
      message: "User not found",
    });
  }
  const { email, ...rest } = req.body;
  const bodyDetails = rest;
  const allUpdates = Object.entries(bodyDetails);

  allUpdates.map((data) => {
    return (userDetailsToBeUpdated[data[0]] = data[1]);
  });

  // if (full_name) userDetailsToBeUpdated.full_name = full_name
  // if (password) userDetailsToBeUpdated.password = password

  res.status(200).json({
    status: true,
    message: "User updated successfully",
  });
});

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

// npm install --save mysql2
// npm install -S psckage

// npm install --dev psckage
// npm install -D psckage

// // first approach to create a user
// const firstName = req.body.firstName;
// const lastName = req.body.lastName;
// const email = req.body.email;

// // seecond approach to create a user
// const { firstName, lastName, email } = req.body;

// // third approach to create a user
// const {body} = req;
