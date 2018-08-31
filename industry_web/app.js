let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let ejs = require("ejs");
let session = require("express-session");
let MobileDetect = require("mobile-detect"); //检测用户的移动设备类型
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let api = require("./routes/api");
let loginApi = require("./routes/loginApi.js");
let userApi = require("./routes/userApi.js");
let mobile = require("./routes/mobile.js");


let app = express();
let isLogin = function(req, res, next) {
  let md = new MobileDetect(req.headers["user-agent"]);

  if (req.session.basicAuth) {
    // 判断用户是否登录
    // console.log(req.session.basicAuth);
    next();
  } else {
    // 解析用户请求的路径
    let arr = req.url.split("/");
    // 去除 GET 请求路径上携带的参数
    for (let i = 0, length = arr.length; i < length; i++) {
      arr[i] = arr[i].split("?")[0];
    }

    //console.log('访问链接',arr);

    // 判断请求路径是否为根、登录、注册、登出，如果是不做拦截
    if (arr.length > 1 && arr[1] == "") {
      next();
    } else if (
      arr.length > 2 &&
      (arr[1] == "loginApi" ||
        arr[1] == "node_modules" ||
        arr[1] == "build" ||
        arr[2] == "register.html" ||
        arr[2] == "login.html" ||
        arr[2] == "logout" ||
        arr[2] == "mobile.html")
    ) {
      next();
    } else {
    	let arr = req.url.split("/");
      // 登录拦截

      //console.log('登录拦截', req.originalUrl);

      req.session.originalUrl = req.originalUrl ? req.originalUrl : null; // 记录用户原始请求路径
      //req.flash('error', '请先登录');
      if (!md.mobile()) {
        res.redirect("/industry/login.html"); // 将用户重定向到PC登录页面
      } else {        
        next();
      }
    }
  }
};
//设置session
app.use(
  session({
    secret: "aliyun_industry_web",
    rolling: true,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 * 2} // timeout after
  })
);
app.use(isLogin);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine(".html", ejs.__express);

app.use(logger('dev'));
app.use(express.json());
// 创建 application/x-www-form-urlencoded 编码解析
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/loginApi", loginApi);
app.use("/proxy", api);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/userApi", userApi);
app.use("/mobileApi", mobile);
app.use("/isExpire", function(req, res, next) {
  if (req.session.basicAuth) {
    res.send({
      code: 200
    });
  } else {
    res.send({
      code: 500
    });
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
