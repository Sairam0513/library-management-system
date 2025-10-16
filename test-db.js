const db = require("./db");

async function testDB() {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    console.log("DB test result:", rows[0].result);
  } catch (err) {
    console.error("DB test failed:", err);
  }
}

testDB();
