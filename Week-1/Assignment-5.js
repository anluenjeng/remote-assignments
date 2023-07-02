const express = require('express');

const app = express();

app.get('/data',(req,res)=>{
    const number = req.query.number;

    if (!number) {
    res.send('Lack of Parameter');
    } else if (isNaN(Number(number))) {
    res.send('Wrong Parameter');
    } else {
    let sum = 0;
    for (let i = 1; i <= number; i++) {
        sum += i;
    }
    res.send(sum.toString());
    }
});



app.listen(3000);