const express = require('express');
const app = express();
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    let videoUrl = 'https://www.youtube.com/watch?v=97ci-XxXjsQ'; // Thay thế bằng liên kết YouTube của bạn
    res.render('index', {videoUrl: videoUrl});
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
