const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const mysqlcon = require('./mysqlcon');

const app = express();
const port = 3000;

// 解析 JSON 格式的請求主體
app.use(bodyParser.json());

// 建立與 MySQL 的連線池
const pool = mysql.createPool({
  mysqlcon
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL');

    // 處理 POST 請求的路由
    app.post('/users/signup', async (req, res) => {
      try {
        // 取得請求中的資料
        const { name, email, password } = req.body;

        // 檢查必填欄位是否存在
        if (!name || !email || !password) {
          res.status(400).json({ error: 'Missing fields' });
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
          provider: 'facebook',
          name: name,
          email: email,
          picture: 'https://schoolvoyage.ga/images/123498.png'
        };

        res.status(200).json(userResponse);
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
