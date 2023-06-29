const express = require('express');

const app = express();

// //1.
// app.get('/data',(req,res)=>{
//     res.send('Lack of Parameter')

// })

////2.
// app.get('/data', (req, res) => {
//     const val = req.query.number;
//     if (isNaN(Number(val))) {
//         res.send('Wrong Parameter');
//     } 
//   });

//3&4
app.get('/data',(req,res)=>{
    const num = req.query.number;
    let sum = 0;
    for (i=1;i<=num;i++){
        sum += i
    }
    res.send(String(sum));
    }
)



app.listen(3000);