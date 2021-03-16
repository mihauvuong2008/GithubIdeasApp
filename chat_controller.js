
const auth_config = require("./authenticate-user/auth_config");
const jwtTool = require("./authenticate-user/jwtTool");
var mysqlDBTool = require('./mysqlDBTool');
var formidable = require('formidable');

let postmessagetogroup = async (req, res) => {
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
            // if(fields!==undefined){
            //   console.log("fields: ", fields);
            // }
            // console.log("files: ", files);
            const userFakeData = decoded.data;
            var userid = decoded.data._id;
            var  groupid = fields.groupid;
            var  message = fields.message;
            var  datetime_send = fields.datetime_send;
            var unhide = await mysqlDBTool.unhide_yourmind(userid, message, datetime_send );
            if (unhide) {
              var unhide_usermindid = unhide.insertId;
              var result = await mysqlDBTool.say_to_group(userid, unhide_usermindid, groupid, datetime_send );
              var getgroupmember = await mysqlDBTool.get_group_member(userid, groupid);
              if (getgroupmember)
              getgroupmember.forEach((item, i) => {
                var sendNoticetouser =  mysqlDBTool.insert_unread_group(item.userid , unhide_usermindid, groupid );
              });

            }
                  // console.log(unhide);
                  return res.status(200).json(unhide);
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
      // console.log(result);
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


let groupchats_Unreadmessagedata = async (req, res) => {
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
      var result = await mysqlDBTool.groupchats_UnreadMessagedata(userid, querydata.groupID);
      // console.log(result);
      return res.status(200).json(result);//
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

let postitemReadedmessageGroup = async (req, res) => {
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
            // if(fields!==undefined){
            //   console.log("fields: ", fields);
            // }
            // console.log("files: ", files);
            const userFakeData = decoded.data;
            var userid = decoded.data._id;

            var  readerid = userid;
            var  unhide_usermindid = fields.unhide_usermindid;
            var  datetime_read = fields.datetime_read;
              /**/
            var unread = await mysqlDBTool.update_unread_group(readerid, unhide_usermindid, datetime_read );
            // console.log(unread);
            return res.status(200).json(unread);

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
        username: userFakeData.name,
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
  groupchats_Unreadmessagedata: groupchats_Unreadmessagedata,
  postmessagetogroup: postmessagetogroup,
  getGroupInfomation: getGroupInfomation,
  postitemReadedmessageGroup: postitemReadedmessageGroup,

};
