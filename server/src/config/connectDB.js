const { Sequelize } = require("sequelize");

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize("BTLthpt", "root", "123456", {
  host: "localhost",
  port: "3307", //vi dung docker nen can map port 3307:3306, nếu chỗ này không khai báo port thì default là 3306
  dialect: "mysql",
  logging: true,
});

const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = {
  connect,
};
