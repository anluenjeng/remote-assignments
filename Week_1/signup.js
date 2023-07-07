const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = 3000;
const secretKey = 'your-secret-key'; // 替換為你的密鑰

function isValidEmail(email) {
  // Regular expression to match email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
}

// 解析 JSON 格式的請求主體
app.use(bodyParser.json());

// 建立與 MySQL 的連線池
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL');

    // 處理 POST 請求的路由
    app.post('/api/1.0/users/signup', async (req, res) => {
      try {
        // 取得請求中的資料
        const { name, email, password } = req.body.data || req.body;

        // 檢查必填欄位是否存在
        if (!name || !email || !password) {
          res.status(400).json({ error: 'Missing fields' });
          return;
        }

        if (!isValidEmail(email)) {
          res.status(400).json({ error: 'Invalid email' });
          return;
        }

        const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
          return res.status(403).json({ error: 'Email already exists' });
        }

        // 將使用者資料放到資料庫中
        const hashedPassword = await bcrypt.hash(password, 10); // 使用 bcrypt 對密碼進行加密
        const user = {
          name: name,
          email: email,
          password: hashedPassword
        };

        const result = await connection.query('INSERT INTO users SET ?', user);
        const insertedUserId = result[0].insertId; // 取得插入的 userId

        const userResponse = {
          id: insertedUserId,
          provider: 'native',
          name: name,
          email: email,
          picture: 'url'
        };

        // 生成 Access Token
        const accessToken = jwt.sign(userResponse, secretKey);

        // 回傳使用者資訊和 Access Token
        const responseData = {
          data: {
            access_token: accessToken,
            user: userResponse
          }
        };

        res.status(200).json(responseData);
      } catch (error) {
        console.error('Error message:', error.message);
        res.status(500).json({ message: 'Server Error' });
      }
    });

    // 啟動伺服器
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
  }
})();


