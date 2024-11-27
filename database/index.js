const Sequelize = require("sequelize");

class Database {
  static getInstance(config) {
    if (!Database.instance) {
      Database.instance = new Database(config);
    }
    return Database.instance;
  }

  constructor(config) {
    this.sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      config
    );
    this.testConnection();
  }

  async testConnection() {
    try {
      await this.sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }
}

module.exports = Database;
