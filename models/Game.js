const { Model, DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../config/connection");

class Game extends Model {}

Game.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    event_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    character_id: {
      type: DataTypes.UUID,
      references: {
        model: "character",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM(["Active", "Inactive"]),
    },
  },
  {
    sequelize,
    freezeTableName: true,
    timestamps: false,
    underscored: true,
    modelName: "game",
  }
);

module.exports = Game;
