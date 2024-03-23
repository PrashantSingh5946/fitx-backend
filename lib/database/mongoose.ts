require("dotenv").config();
const { connect } = require("mongoose");

const Connection = connect(process.env.MONGODB_URL);

module.exports = Connection;
