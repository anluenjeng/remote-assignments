const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// 解析 JSON 格式的請求主體
app.use(bodyParser.json());

// 建立與 MySQL 的連線
const pool = mysql.createPool({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '0000',
  database: 'Canchu'
});

//connection.query(
  //'SELECT * FROM `users` WHERE `name` = "Page"',
  //function(err, results, fields) {
    //console.log(err);
    //console.log(results); // results contains rows returned by server
    //console.log(fields); // fields contains extra meta data about results, if available
 // }
//);
// 建立連線
pool.getConnection((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');})


// 從資料庫中讀取已存在的使用者信箱
pool.query('SELECT email FROM users', (error, results) => {
     if (error) {
       console.error('Error reading data:', error);
       return;
     }
     console.log('Existing user emails:', results);
  
// 將已存在的使用者信箱存儲在 existingUserEmails 變數中
     const existingUserEmails = results.map((row) => row.email);

// 處理 POST 請求的路由
     app.post('/users/signup', (re, res) => {
       // 取得請求中的資料
       const { name, email, password } = req.body;

//從資料庫中讀取已存在的使用者信箱
pool.query('SELECT email FROM users', (error, results) => {
    if (error) {
      console.error('Error reading data:', error);
      return;
    }
    console.log('Existing user emails:', results);
  
// 將已存在的使用者信箱存儲在 existingUserEmails 變數中
    const existingUserEmails = results.map((row) => row.email);

// 處理 POST 請求的路由
    app.post('/users/signup', (req, res) => {
      // 取得請求中的資料
      const { name, email, password } = req.body;
      
      // 檢查必填欄位是否存在
      if (!name || !email || !password) {
        res.status(400).json({ error: 'Missing fields' });
      } else if (existingUserEmails.includes(email)) {
        res.status(403).json({ error: 'Email Already Exists' });
      } else {
        // 插入使用者資料
        const user = {
          name: name,
          email: email,
          password: password
        };

        connection.query('INSERT INTO users SET ?', user, (error, results) => {
          if (error) {
            console.error('Error inserting data:', error);
            res.status(500).json({ error: 'Server Error' });
            return;
          }
          console.log('Data inserted successfully');

          
          // 假設註冊成功，回傳成功訊息和使用者資訊
          const userResponse = {
            id: userId,
            provider: 'facebook',
            name: name,
            email: email,
            picture: 'https://schoolvoyage.ga/images/123498.png'
          };

          const response = {
            access_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6joiYXJ0aHVIjoxNjEzNTY3MzA0fQ.6EPCOfBGynidAfpVqlvbHGWHCJ5LZLtKvPaQ',
            user: userResponse
          };

          res.setHeader('Content-Type', 'application/json');
          res.status(200).json(response);
        });
      }
    });
})
});
});
app.listen(3000, () => {
  console.log(`Server started on port ${port}`);
});
