"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  User.init(
    {
      username: DataTypes.STRING,
      fullname: DataTypes.STRING,
      date_of_birth: DataTypes.DATEONLY,
      password: DataTypes.STRING,
      gender: DataTypes.BOOLEAN,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      address: DataTypes.STRING,
      bought_vip: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "User",
      timestamps: false,
    }
  );

  // User.verify = async (email, result) => {
  //   await sequelize.query(
  //     "update Users set email_verify_at = ? where email = ?",[
  //       new Date(), email
  //     ],
  //     (err, res) => {
  //       if (err) {
  //         console.log("error: ", err);
  //         result(null, err);
  //         return;
  //       }
  //       if (res.affectedRows == 0) {
  //         result({ kind: "not_found" }, null);
  //         return;
  //       }
  //       result(null, { email: email });
  //     }
  //   );
  // };
  User.verify = async (email, result) => {
    try {
        const [rows, fields] = await sequelize.query(
            "UPDATE Users SET email_verify_at = :emailVerifyAt WHERE email = :email",
            {
                replacements: {
                    emailVerifyAt: new Date(),
                    email: email
                }
            }
        );

        if (rows && rows.affectedRows > 0) {
            result(null, { email: email });
        } else {
            result({ kind: "not_found" }, null);
        }
    } catch (error) {
        console.error("Error: ", error);
        result(error, null);
    }
};
  return User;
};
