const express = require('express');
const mysql = require('mysql2');

const app = express();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123321',
  database: 'bdwoodshop'
});

db.connect((err) => {
  if (err) {
    console.log('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

app.use(express.json());
app.use(express.static('/Users/heros/myapp/public'));
app.use('/img', express.static('/Users/heros/myapp/public/img'));

app.get('/', function(req, res) {
  res.sendFile("index.html");
});

// Маршрут для регистрации пользователя
app.post('/register', (req, res) => {
  const { username, password, email } = req.body;

  // Проверка наличия обязательных полей
  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Необходимо заполнить все поля' });
  }

  // Проверка длины пароля
  if (password.length < 6) {
    return res.status(400).json({ error: 'Пароль должен быть не менее 6 символов' });
  }

  // Проверка уникальности имени пользователя
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка базы данных' });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: 'Имя пользователя уже занято' });
    }

    // Вставка нового пользователя в базу данных
    db.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, password, email], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Ошибка базы данных' });
      }

      res.status(201).json({ success: 'Пользователь успешно зарегистрирован' });
    });
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});