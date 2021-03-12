
const auth_config = require("./authenticate-user/auth_config");
const jwtTool = require("./authenticate-user/jwtTool");
var mysqlDBTool = require('./mysqlDBTool');
var formidable = require('formidable');

let messagetoGroup = async (req, res) => {
  // Lấy token được gửi lên từ phía client, thông thường tốt nhất là các bạn nên truyền token vào header
  const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"];
  if (tokenFromClient ) {
    // Nếu tồn tại token
      try {
        // Thực hiện giải mã token xem có hợp lệ hay không?
        const decoded = await jwtTool.verifyToken(tokenFromClient, auth_config.accessTokenSecret);
        if(decoded){
          // console.log("req: ????");
          var form = new formidable.IncomingForm();
          form.parse(req,async function (err, fields, files) {
            if(fields!==undefined){
              console.log("fields: ", fields);
            }
            console.log("files: ", files);
            const userFakeData = decoded.data;
            var userid = decoded.data._id;
            var  groupid = fields.groupid;
            var  message = fields.message;
            var  datetime_send = fields.datetime_send;
            var result = await mysqlDBTool.sendmessagetoGroup(userid, groupid, message, datetime_send );
            return res.status(200).json(result);

            //res.write('File uploaded and moved!');
            res.status(200).end();
          });
        }
      } catch (error) {
        //removeDeadToken
        removeDeadToken(tokenFromClient);
        console.log(error);
        // Nếu giải mã gặp lỗi: Không đúng, hết hạn...etc:
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
}

let friendLists = async (req, res) => {
  // Lấy token được gửi lên từ phía client, thông thường tốt nhất là các bạn nên truyền token vào header
  const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"];
  if (tokenFromClient) {
    // Nếu tồn tại token
    try {
      // Thực hiện giải mã token xem có hợp lệ hay không?
      const decoded = await jwtTool.verifyToken(tokenFromClient, auth_config.accessTokenSecret);
      const userFakeData = decoded.data;

      var userid = decoded.data._id;
      var result = await mysqlDBTool.getFriendlist(userid);
      return res.status(200).json(result);
    } catch (error) {
      //removeDeadToken
      removeDeadToken(tokenFromClient);
      console.log(error);
      // Nếu giải mã gặp lỗi: Không đúng, hết hạn...etc:
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
}


let groupchatLists = async (req, res) => {
  // Lấy token được gửi lên từ phía client, thông thường tốt nhất là các bạn nên truyền token vào header
  const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"];
  if (tokenFromClient) {
    // Nếu tồn tại token
    try {
      // Thực hiện giải mã token xem có hợp lệ hay không?
      const decoded = await jwtTool.verifyToken(tokenFromClient, auth_config.accessTokenSecret);
      const userFakeData = decoded.data;

      var userid = decoded.data._id;
      var result = await mysqlDBTool.getGroupchatLists(userid);
      return res.status(200).json(result);
    } catch (error) {
      //removeDeadToken
      removeDeadToken(tokenFromClient);
      console.log(error);
      // Nếu giải mã gặp lỗi: Không đúng, hết hạn...etc:
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
}


let groupConversation = async (req, res) => {
  // Lấy token được gửi lên từ phía client, thông thường tốt nhất là các bạn nên truyền token vào header

  // console.log(req.headers["x-access-token"]);
  var querydata = {groupID: req.query.groupID };
  const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"];
  if (tokenFromClient) {
    // Nếu tồn tại token
    try {
      // Thực hiện giải mã token xem có hợp lệ hay không?
      const decoded = await jwtTool.verifyToken(tokenFromClient, auth_config.accessTokenSecret);
      const userFakeData = decoded.data;

      var userid = decoded.data._id;
      var result = await mysqlDBTool.getGroupConversation(userid, querydata.groupID);
      return res.status(200).json(result);
    } catch (error) {
      //removeDeadToken
      removeDeadToken(tokenFromClient);
      console.log(error);
      // Nếu giải mã gặp lỗi: Không đúng, hết hạn...etc:
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
}


let getGroupInfomation = async (req, res) => {
  // Lấy token được gửi lên từ phía client, thông thường tốt nhất là các bạn nên truyền token vào header

  // console.log(req.headers["x-access-token"]);
  var querydata = {groupID: req.query.groupID };
  const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"];
  if (tokenFromClient) {
    // Nếu tồn tại token
    try {
      // Thực hiện giải mã token xem có hợp lệ hay không?
      const decoded = await jwtTool.verifyToken(tokenFromClient, auth_config.accessTokenSecret);
      const userFakeData = decoded.data;

      var userid = decoded.data._id;
      var result = await mysqlDBTool.getGroupInfomation(userid, querydata.groupID);
      return res.status(200).json(result);
    } catch (error) {
      //removeDeadToken
      removeDeadToken(tokenFromClient);
      console.log(error);
      // Nếu giải mã gặp lỗi: Không đúng, hết hạn...etc:
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
}
//get user id
let getuserSession_availble = async (req, res) => {

  // Lấy token được gửi lên từ phía client, thông thường tốt nhất là các bạn nên truyền token vào header
  const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"];
  if (tokenFromClient) {
    // Nếu tồn tại token
    try {

      // Thực hiện giải mã token xem có hợp lệ hay không?
      const decoded = await jwtTool.verifyToken(tokenFromClient, auth_config.accessTokenSecret);
      const userFakeData = decoded.data;

      // console.log("user availble: ",userFakeData._id);
      return res.status(200).json({
        availble: true,
        session: userFakeData._id,
      });
    } catch (error) {
      console.log(error);
      //removeDeadToken
      removeDeadToken(tokenFromClient);
      // Nếu giải mã gặp lỗi: Không đúng, hết hạn...etc:
      return res.status(401).json({
        message: 'Unauthorized.',
      });
    }
  } else {
    // Không tìm thấy token trong request
    return res.status(403).send({
      message: 'No token provided.',
    });
  }
}

module.exports = {
  friendLists: friendLists,
  getuserSession_availble: getuserSession_availble,
  groupchatLists: groupchatLists,
  groupConversation: groupConversation,
  messagetoGroup: messagetoGroup,
  getGroupInfomation: getGroupInfomation,
};
