/** * Created by besteric on 2017/7/18.
 */
let express = require('express');
let router = express.Router();
let proxy = require('express-http-proxy');
let session = require('express-session');

let whiteList = ['/api/user/login','/api/user/logout','/api/user/register'];
// 120.27.216.240:8080
router.use('/', proxy('120.27.216.240:8089',{
// router.use('/', proxy('192.168.91.44:8089',{
	proxyReqPathResolver: req => {
		//user did not login
		if(whiteList.indexOf(req.path) === -1 && !req.session.basicAuth){
			return '/api/user/login'
		}
		return require('url').parse(req.url).path;
	},
	proxyReqOptDecorator: (proxyReqOpts, srcReq) =>{
	// add basic auth to request header
	if(whiteList.indexOf(srcReq.path) === -1){
		proxyReqOpts.headers['Authorization'] = srcReq.session.basicAuth || '';
	}
	return proxyReqOpts;
	},
	userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
	// console.log('userResDecorator',userReq.body.userName)

	let data;

	userRes.header("Content-Type", "application/json; charset=utf-8");
	try{
		data = JSON.parse(proxyResData.toString('utf8'));
	}catch(e){
		// userRes.status(200);
		data = {
			code: 500,
			data: '',
			message: '接口返回异常'
		}
	}
	// URL not in WhiteList and did not login
	if(whiteList.indexOf(userReq.path) === -1 && !userReq.session.basicAuth){
		userRes.status(200);
		data = {
			code: 500,
			data: '/industry/login.html',
			message: '用户未登录'
		}

	}else{

		userRes.status(200);

		if(userReq.path ==='/api/user/logout'){

			data = {
				code: 200,
				data: '/industry/login.html',
				message: 'success'
			}

			userReq.session.basicAuth = null

		}

		// login success write basicAuth to session
		if(userReq.path ==='/api/user/login' && data.message && data.message === 'success'){
			let permissions = new Buffer(data.data[1]).toString('base64');
			let user = userReq.headers.authorization.substring(6);
			let prefix = userReq.headers.authorization.substring(0,6);
			let buf = new Buffer(user, 'base64').toString();
			let params = null;
			try {
				params = `${buf}:${data.data[0]}:${data.data[2]}`;
			} catch (error) {
				params = `${buf}:${data.data[0]}`;
			}
			let authorization = new Buffer(params).toString('base64');
			authorization = prefix + authorization;
			userReq.session.basicAuth = authorization;
			userRes.cookie('userName', userReq.body.userName);
			userRes.cookie('permissions', permissions);
		}

	}
		return JSON.stringify(data);
	}
}));

module.exports = router;
