const express = require("express")
const app = express()
const PORT = 8798
const crypto = require("crypto")

const AIRPORTS = [
  {
    id: 1,
    airport_name: "JFK",
    city: "New York",
    country: "United States of America",
    country_code: "USA",
  },
  {
    id: 2,
    airport_name: "Muritala International",
    city: "Lagos",
    country: "Nigeria",
    country_code: "NGN",
  },
  {
    id: 3,
    airport_name: "Ercan",
    city: "Famagusta",
    country: "Turkey",
    country_code: "TRNC",
  },
]

const AIRCRAFT = [
  {
    id: 1,
    aircraft_name: "Turkish airlines",
    seat_capacity: 200,
    reg_number: "123FFF",
  },
  {
    id: 2,
    aircraft_name: "Air Morocco",
    seat_capacity: 250,
    reg_number: "456JPQ",
  },
  {
    id: 3,
    aircraft_name: "Qatar Airways",
    seat_capacity: 300,
    reg_number: "094ZHT",
  },
]

const USERS = [
  {
    id: 1,
    full_name: "John Paul",
    email: "johnpaul@gmail.com",
    password: "***Password1",
  },
  {
    id: 2,
    full_name: "Rihanat Bello",
    email: "rb@gmail.com",
    password: "Password1",
  },
  {
    id: 3,
    full_name: "Bolu Lawale",
    email: "bl@gmail.com",
    password: "Password3",
  },
]

const FLIGHTS = [
  {
    id: 1,
    flight_number: "111",
    departure_time: "2026-11-30",
    departure_airport: "JFK",
    price: 1000,
    aircraft_name: "Turkish airlines",
    status: "pending",
    arrival_time: "2026-12-30",
  },
]

const BOOKINGS = [
  {
    id: 1,
    flight_number: "111",
    full_name: "John Paul",
    status: "awaiting",
    booking_ref: "456787",
  },
  {
    id: 2,
    flight_number: "111",
    full_name: "Bolu Lawale",
    status: "awaiting",
    booking_ref: "987656",
  },
]

const PAYMENTS = [
  {
    id: 1,
    booking_ref: "987656",
    price: 1000,
    status: "paid",
    payment_ref: "cbvbbnxngvhf",
  },
  {
    id: 2,
    booking_ref: "456787",
    price: 1000,
    status: "paid",
    payment_ref: "fbmfjngjbngjng",
  },
]

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello World")
})

// AIRPORT

app.get("/airports", (req, res) => {
  res.status(200).json({
    status: true,
    message: "All airports retrieved",
    data: AIRPORTS,
  })
})

app.get("/airport/:id", (req, res) => {
  const { id } = req.params

  const singleAirport = AIRPORTS.find((a) => a.id === Number(id))

  if (singleAirport === undefined) {
    res.status(400).json({
      status: false,
      message: "Invalid airport information",
    })
    return
  }

  res.status(200).json({
    status: true,
    message: "Airport retrieved",
    data: singleAirport,
  })
})

// AIRCRAFT

app.get("/aircrafts", (req, res) => {
  res.status(200).json({
    status: true,
    message: "All aircrafts retrieved",
    data: AIRCRAFT,
  })
})

app.post("/create/aircraft", (req, res) => {
  const { aircraft_name, seat_capacity } = req.body

  const reg = crypto.randomUUID()

  const reg_number = reg.split("-")[0]

  if (!aircraft_name || !seat_capacity) {
    res.status(400).json({
      status: false,
      message: "Provide all necessary fields",
    })
    return
  }

  AIRCRAFT.push({ id: AIRCRAFT.length + 1, reg_number, ...req.body })

  res.status(200).json({
    status: true,
    message: "Aircraft created",
  })
})

app.get("/aircraft/:id", (req, res) => {
  const { id } = req.params

  const singleAircraft = AIRCRAFT.find((a) => a.id === Number(id))

  if (singleAircraft === undefined) {
    res.status(400).json({
      status: false,
      message: "Invalid aircraft information",
    })
    return
  }

  res.status(200).json({
    status: true,
    message: "Aircraft retrieved",
    data: singleAircraft,
  })
})

app.delete("/delete/aircraft/:id", (req, res) => {
  const { id } = req.params

  const checkIfExists = AIRCRAFT.findIndex((ele) => ele.id === Number(id))

  if (checkIfExists === -1) {
    res.status(400).json({
      status: false,
      message: "Invalid ID provided",
    })
    return
  }

  AIRCRAFT.splice(checkIfExists, 1)

  res.status(200).json({
    status: true,
    message: "Aircraft deleted successfully",
  })
})

// USER

app.get("/users", (req, res) => {
  res.status(200).json({
    status: true,
    message: "All users retrieved",
    data: USERS,
  })
})

app.get("/user/:id", (req, res) => {
  const { id } = req.params

  const singleuser = USERS.find((a) => a.id === Number(id))

  if (singleuser === undefined) {
    res.status(400).json({
      status: false,
      message: "Invalid user information",
    })
    return
  }

  res.status(200).json({
    status: true,
    message: "User retrieved",
    data: singleuser,
  })
})

app.post("/create/user", (req, res) => {
  const { full_name, email, password } = req.body

  if (!full_name || !email || !password) {
    res.status(400).json({
      status: false,
      message: "All fields are required",
    })
    return
  }

  const checkIfUserExists = USERS.find((ele) => ele.email === email)

  if (checkIfUserExists) {
    res.status(400).json({
      status: false,
      message: "User exists, Please signup with a different email",
    })
    return
  }

  const details = { id: USERS.length + 1, ...req.body }

  USERS.push(details)

  res.status(200).json({
    status: true,
    message: "User created successfully",
  })
})

app.patch("/update/user/:userId", (req, res) => {
  const { userId } = req.params

  const userDetailsToBeUpdated = USERS.find((u) => u.id === Number(userId))

  if (!userDetailsToBeUpdated) {
    return res.status(400).json({
      status: false,
      message: "User not found",
    })
  }
  const { email, ...rest } = req.body
  const bodyDetails = rest
  const allUpdates = Object.entries(bodyDetails)

  allUpdates.map((data) => {
    return (userDetailsToBeUpdated[data[0]] = data[1])
  })

  // if (full_name) userDetailsToBeUpdated.full_name = full_name
  // if (password) userDetailsToBeUpdated.password = password

  res.status(200).json({
    status: true,
    message: "User updated successfully",
  })
})

// NOT FOUND

app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: "Seems you got lost 🙃",
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
