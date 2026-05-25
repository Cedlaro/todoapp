import 'dotenv/config';
import app from './app';

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);

  console.log("in",process.env.MYSQL_DATABASE, process.env.DB_HOST);
});
