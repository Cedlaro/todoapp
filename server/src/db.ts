import mysql from 'mysql2/promise';

export async function query<T>(sql: string, params: (string | number | null | boolean | Date)[] = []): Promise<T> {
console.log({
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
});

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const [rows] = await connection.execute(sql, params);
    return rows as T;
  } finally {
    await connection.end();
  }
}
