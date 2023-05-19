import { Sequelize } from "sequelize";

// const db = new Sequelize("jne_test", "root", "", {
//   host: "localhost",
//   dialect: "mysql"
// });
const db = new Sequelize("freedb_jne_tes", "freedb_jneroot", "RTzqv4Vp#kwQpv!", {
  host: "sql.freedb.tech",
  port: "3306",
  dialect: "mysql"
});
export default db;
