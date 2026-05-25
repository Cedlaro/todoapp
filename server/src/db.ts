import mysql from 'mysql2/promise';

export async function query<T>(sql: string, params: (string | number | null | boolean | Date)[] = []): Promise<T> {
console.log({
   host:process.env.MYSQL_HOST
});

  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_NAME,
  });

  try {
    const [rows] = await connection.execute(sql, params);
    return rows as T;
  } finally {
    await connection.end();
  }
}
