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
];

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
];

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
];

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
];

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
];

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
];

module.exports = {
  AIRPORTS,
  AIRCRAFT,
  USERS,
  FLIGHTS,
  BOOKINGS,
  PAYMENTS,
};