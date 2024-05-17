const path = require('path');//dùng cho hàm join
const express = require('express');

const configViewEngine = (app) => {
    app.set('views', path.join('../client', 'views')); //thiết lập đường dẫn đến các file .ejs, ở đây dùng đường dẫn trực tiếp đến folder views, nhưng đang ở trong folder config => phải trở ra folder src
    app.set('view engine', 'ejs'); //lựa chọn loại views engine
    
    //config static file
    app.use(express.static(path.join('../client', '/public'))); //để server biết được những file trong thư mục public là người dùng có thể quan sát được, ở đây dùng ./src bởi vì đang ở trong folder config => phải quay lại thư mục src
};

module.exports = {
    configViewEngine
}