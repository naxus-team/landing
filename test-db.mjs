import pg from "pg";

const pool = new pg.Pool({
  connectionString: "postgresql://postgres@localhost:5432/naxus",
});

console.log("DB URL:", process.env.DATABASE_URL);


try {
  const result = await pool.query("SELECT NOW()");
  console.log("DB Connected:", result.rows[0]);
} catch (err) {
  console.error("DB Error:", err.message);
} finally {
  await pool.end();
}