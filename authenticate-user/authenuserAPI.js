
const express = require("express");
const router = express.Router();
const chatController = require("../chat_controller");
const auth_config = require("./auth_config");
const jwtTool = require("./jwtTool");
var mysqlDBTool = require('../mysqlDBTool');
var formidable = require('formidable');
const jwt = require("jsonwebtoken");

// Biến cục bộ trên server này sẽ lưu trữ tạm danh sách token
// Trong dự án thực tế, nên lưu chỗ khác, có thể lưu vào Redis hoặc DB
let tokenList = {};

let initAPIs = (app) => {
  router.post("/loginchecker", async (req, res) => {
    try {
      //loginhere

      // console.log("req: ????");
      var form = new formidable.IncomingForm();
      form.parse(req,async function (err, fields, files) {
        if(fields!==undefined){
          console.log("fields: ", fields);
        }
        console.log("files: ", files);
        var username = fields.username;
        var password = fields.password;
        var result = await mysqlDBTool.checklogin(username, password);
        console.log(result);
        if (result) {
          mysqlDBTool.updateAccount_islogin(username, getDateString(new Date()));
          const userFakeData = {
            _id: result.userid,
            name: result.username,
          };
          // debug(`Thực hiện tạo mã Token, [thời gian sống 1 giờ.]`);
          const accessToken = await jwtTool.generateToken(userFakeData, auth_config.accessTokenSecret, auth_config.accessTokenLife);

          // debug(`Thực hiện tạo mã Refresh Token, [thời gian sống 10 năm] =))`);
          const refreshToken = await jwtTool.generateToken(userFakeData, auth_config.refreshTokenSecret, auth_config.refreshTokenLife);
          // Lưu lại 2 mã access & Refresh token, với key chính là cái refreshToken để đảm bảo unique và không sợ hacker sửa đổi dữ liệu truyền lên.
          // lưu ý trong dự án thực tế, nên lưu chỗ khác, có thể lưu vào Redis hoặc DB
          tokenList[refreshToken] = {accessToken, refreshToken};

          // debug(`Gửi Token và Refresh Token về cho client...`);
          var userid = result.userid, username = result.username;
          return res.status(200).json({accessToken, refreshToken, userid, username});

        }else {
          res.json({ status: "login_false" }) ;
        }
        //res.write('File uploaded and moved!');
        res.status(200).end();
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  });

  router.post("/refresh-token", async (req, res) => {
    // User gửi mã refresh token kèm theo trong body
    const refreshTokenFromClient = req.body.refreshToken;
    // debug("tokenList: ", tokenList);

    // Nếu như tồn tại refreshToken truyền lên và nó cũng nằm trong tokenList của chúng ta
    if (refreshTokenFromClient && (tokenList[refreshTokenFromClient])) {
      try {
        // Verify kiểm tra tính hợp lệ của cái refreshToken và lấy dữ liệu giải mã decoded
        const decoded = await jwtTool.verifyToken(refreshTokenFromClient, auth_config.refreshTokenSecret);
        // Thông tin user lúc này các bạn có thể lấy thông qua biến decoded.data
        // có thể mở comment dòng debug bên dưới để xem là rõ nhé.
        // debug("decoded: ", decoded);
        const userFakeData = decoded.data;
        // debug(`Thực hiện tạo mã Token trong bước gọi refresh Token, [thời gian sống vẫn là 1 giờ.]`);
        const accessToken = await jwtTool.generateToken(userFakeData, auth_config.accessTokenSecret, auth_config.accessTokenLife);
        // gửi token mới về cho người dùng

        // save token
        tokenList[refreshTokenFromClient] = {accessToken, refreshTokenFromClient};
        return res.status(200).json({accessToken});
      } catch (error) {
        // refresh token expired
        if("jwt expired".localeCompare(error.message)==0){
          // console.log("error:", error.code, error.message);
          delete tokenList[refreshTokenFromClient];
        }
        // debug(error);
        res.status(403).json({
          message: 'Invalid refresh token.',
        });
      }
    } else {
      // Không tìm thấy token trong request
      return res.status(403).send({
        message: 'refresh-token: No token provided.',
      });
    }
  });

  // Sử dụng authMiddleware.isAuth trước những api cần xác thực
  router.use(async (req, res, next) => {
    // Lấy token được gửi lên từ phía client, thông thường tốt nhất là các bạn nên truyền token vào header
    const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"];
    if (tokenFromClient) {
      // Nếu tồn tại token
      try {
        // Thực hiện giải mã token xem có hợp lệ hay không?
        const decoded = await jwtTool.verifyToken(tokenFromClient, auth_config.accessTokenSecret);
        // Nếu token hợp lệ, lưu thông tin giải mã được vào đối tượng req, dùng cho các xử lý ở phía sau.
        req.jwtDecoded = decoded;

        // Cho phép req đi tiếp sang controller.
        next();
      } catch (error) {
        //
        // Nếu giải mã gặp lỗi: Không đúng, hết hạn...etc:
        // debug("Error while verify token:", error);
        return res.status(401).json({
          message: 'Unauthorized.',
        });
      }
    } else {
      // Không tìm thấy token trong request
      return res.status(403).send({
        message: 'router.use: No token provided.',
      });
    }
  });

  function getDateString(d){
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    var hh = new Intl.DateTimeFormat('en', { hour: '2-digit', hour12: false }).format(d);
    const mm = new Intl.DateTimeFormat('en', { minute: '2-digit' }).format(d);
    const ss = new Intl.DateTimeFormat('en', { second: '2-digit' }).format(d);
    if (parseInt(hh)>23) {
      hh="00";
    }
    return  `${ye}-${mo}-${da} ${hh}:${mm}:${ss}`;
  }

  // check session availble:
  router.get("/getuserSession", chatController.getuserSession_availble);
  // List Protect APIs:
  router.get("/friends", chatController.friendLists);
  // List Protect APIs:
  router.get("/groupchats", chatController.groupchatLists);
  router.get("/groupchats_messagedata", chatController.groupConversation);
  router.get("/groupchats_info", chatController.groupInfomation);
  router.post("/postmessagetogroup", chatController.postmessagetogroup);
  router.get("/groupchats_unreadmessage", chatController.groupchats_Unreadmessagedata);
  router.post("/postitemReadedmessageGroup", chatController.postitemReadedmessageGroup);
  router.get("/groupnotify", chatController.groupnotify);
  router.get("/istillonline", chatController.istillonline);
  router.get("/friendstillonline", chatController.friendstillonline);
  // router.get("/example-protect-api", ExampleController.someAction);
  return app.use("/", router);
}
module.exports = initAPIs;
