var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "githubideanodejswebapp"
});


let mysqlConnecState = false;
// if(!mysqlConnecState){
//   connectMysqlDB();
// }
module.exports = {
  connectMysqlDB: connectMysqlDB = async function(){
    if(!mysqlConnecState)
    new Promise(function(resolve, reject) {
      if(!mysqlConnecState){
        con.connect(async function(err) {
          if (err){ throw err; reject(false)};
          // console.log("Connected!");
          mysqlConnecState = true;
          resolve(mysqlConnecState);
        });
      }
    });
  },

  check_docdatatable_exist: function(){

    var check_ckeditordata_exit = "SELECT * FROM information_schema.tables WHERE table_schema = 'githubideanodejswebapp' AND table_name = 'ckeditordata' LIMIT 1;"
    con.query(check_ckeditordata_exit, function (err, result) {
      if (err) throw err;
      return result.length;
    });
  },
  create_docdatatable: function(){

    // console.log("create table ckeditor doc data:");
    var create_ckeditordata = "CREATE TABLE IF NOT EXISTS ckeditordata ( id_doc INT AUTO_INCREMENT NOT NULL PRIMARY KEY, doc_name VARCHAR(255) NOT NULL, content MEDIUMTEXT, link VARCHAR (511), creatdate DATETIME )";
    con.query(create_ckeditordata, function (err, result) {
      if (err) throw err;
      // console.log("Table ckeditor doc data created!");
    });
  },

  insert_docdata: function(titleData, htmlData){

    // console.log("insert_docdata:");
    var insert_ckeditordata = "INSERT INTO  ckeditordata ( doc_name, content , creatdate ) value ('"+titleData+"', '"+htmlData+"', '"+Date.prototype.toMysqlFormat() +"')";
    con.query(insert_ckeditordata, function (err, result) {
      if (err) throw err;
      // console.log("insert_docdataed!");
    });
  },
  update_docdata: function(iddoc, titleData, htmlData){

    // console.log("update_docdata:");
    var update_ckeditordata = "UPDATE ckeditordata set   doc_name ='" + titleData + "',  content ='" + htmlData + "'  where id_doc='"+ iddoc +"'";
    con.query(update_ckeditordata, function (err, result) {
      if (err) throw err;
      // console.log("update_docdataed!");
    });
  },
  loadall_docdatatable: async function(){
    return new Promise( function (resolve, reject) {

      // console.log("loadall_docdatatable:");
      con.query("SELECT * FROM ckeditordata", function (err, result, fields) {
        if (err) {throw err;reject()};
        resolve(result);
      });
    });
  },
  load_docdata: async function(iddoc){
    return new Promise( function (resolve, reject) {

      // console.log("load_docdata:");
      con.query("SELECT * FROM ckeditordata where id_doc='"+ iddoc +"'", function (err, result, fields) {
        if (err) {throw err;reject()};
        resolve(result);
      });
    });
  },

  remove_doc: async function(iddoc){
    return new Promise( function (resolve, reject) {

      // console.log("remove_doc:");
      var sql = "DELETE FROM ckeditordata WHERE id_doc ='"+ iddoc +"'";
      con.query(sql, function (err, result, fields) {
        if (err) {throw err;reject()};
        resolve(result);
      });
    });
  },

  //=================================chatapp=====================================
  checklogin: async function(username, password){
    return new Promise( function (resolve, reject) {

      // console.log("remove_doc:");
      var sql = "select userid, username, password, availabletoken FROM chatappuser WHERE username ='"+ username +"'";
      con.query(sql, function (err, result, fields) {
        if (err) {throw err;reject()};
        if(result.length == 0){
          resolve(false);
        }else {

          if( result[0].password.localeCompare(password) == 0){
            resolve(result[0]);
          }else{
            resolve(null);
          }
        }
      });
    });
  },

  updateAccount_islogin: async function(userid, logindatetime){
    return new Promise( function (resolve, reject) {
      // console.log("remove_doc:");
      var sql = "UPDATE  chatappuser set lastdatetimelogin ='"+ logindatetime +"' WHERE userid ='"+ userid +"'";
      con.query(sql, function (err, result, fields) {
        if (err) {throw err;reject()};
        resolve(result);
      });
    });
  },

  getfriendlastlogin: async function(userid, friendid){
    return new Promise( function (resolve, reject) {

      var sql = "select c2.lastdatetimelogin FROM chatappuser c1, chatappuser c2, friend_relate f WHERE c1.userid='"
      + userid + "' AND c2.userid ='"+ friendid +"' AND c1.userid=f.userid AND c2.userid=f.friend";
      // console.log(sql);
      con.query(sql, function (err, result, fields) {
        if (err) {throw err;reject()};
        resolve(result);
      });
    });
  },

  getFriendlist: async function(userid){
    return new Promise( function (resolve, reject) {

      var sql = "select c.userid, c.username, c.lastdatetimelogin ,c.login FROM chatappuser c, friend_relate WHERE friend_relate.userid ='"+ userid +"' AND c.userid=friend_relate.friend";
      con.query(sql, function (err, result, fields) {
        if (err) {throw err;reject()};
        if(result.length == 0){
          resolve(false);
        }else {
          resolve(result);
        }
      });
    });
  },

  getGroupchatLists: async function(userid){
    return new Promise( function (resolve, reject) {

      var sql = "select c.groupid, c.group_name FROM chat_group c, member_of_chat_group m WHERE c.groupid = m.groupid AND m.userid ='"+ userid +"' ";
      con.query(sql, function (err, result, fields) {
        if (err) {throw err;reject()};
        if(result.length == 0){
          resolve(false);
        }else {
          resolve(result);
        }
      });
    });
  },

  getGroupConversation: async function(userid, groupid){
    return new Promise( function (resolve, reject) {

      var sql = "select distinct a.unhide_usermindid, a.userid, a.message_data, a.datetime_unhide, a.username, a.login, u.datetime_read, u.readerid  FROM (select c.unhide_usermindid, c.userid, c.message_data, c.datetime_unhide, ca.username, ca.login "
      + " FROM unhide_usermind c, member_of_chat_group m, chatappuser ca, chat_group cg, say_to_group s "
      + " WHERE (c.userid = ca.userid AND c.userid = s.tellerid AND s.unhide_usermindid = c.unhide_usermindid  AND s.groupid = cg.groupid AND m.groupid = cg.groupid AND cg.groupid ='"
      + groupid +"' AND m.userid = '"+userid+"')"
      + " ORDER BY c.datetime_unhide  DESC, c.unhide_usermindid DESC) a "
      + " LEFT JOIN unread_group u ON  u.readerid='"+userid+"' AND (u.unhide_usermindid = a.unhide_usermindid OR u.unhide_usermindid is NULL) ORDER BY a.unhide_usermindid DESC LIMIT 50;"
      // var sql = "select c.unhide_usermindid, c.userid, c.message_data, c.datetime_unhide, ca.username, ca.login "
      // +" FROM unhide_usermind c, member_of_chat_group m, chatappuser ca, chat_group cg, say_to_group s "
      // + " WHERE (c.userid = ca.userid AND c.userid = s.tellerid AND s.unhide_usermindid = c.unhide_usermindid "
      // + " AND s.groupid = cg.groupid AND m.groupid = cg.groupid AND cg.groupid ='"
      // + groupid +"' AND m.userid = '"+userid+"') ORDER BY c.datetime_unhide  DESC, c.unhide_usermindid DESC LIMIT 30";
      // console.log(sql);
      con.query(sql, function (err, result, fields) {
        if (err) {throw err;reject()};
        resolve(result);
      });
    });
  },

  getFriendConversation: async function(userid, groupid){
    return new Promise( function (resolve, reject) {

      var sql = "select a.unhide_usermindid, a.userid, a.message_data, a.datetime_unhide, a.username, a.login, u.datetime_read, u.readerid  FROM (select c.unhide_usermindid, c.userid, c.message_data, c.datetime_unhide, ca.username, ca.login "
      + " FROM unhide_usermind c, chatappuser ca, say_to_friend s "
      + " WHERE (c.userid = ca.userid AND c.userid = s.tellerid AND s.unhide_usermindid = c.unhide_usermindid  AND s.groupid = cg.groupid AND m.groupid = cg.groupid AND cg.groupid ='"
      + groupid +"' AND m.userid = '"+userid+"')"
      + " ORDER BY c.datetime_unhide  DESC, c.unhide_usermindid DESC) a "
      + " LEFT JOIN unread_group u ON  u.readerid='"+userid+"' AND (u.unhide_usermindid = a.unhide_usermindid OR u.unhide_usermindid is NULL) ORDER BY a.unhide_usermindid DESC LIMIT 50;"
      // var sql = "select c.unhide_usermindid, c.userid, c.message_data, c.datetime_unhide, ca.username, ca.login "
      // +" FROM unhide_usermind c, member_of_chat_group m, chatappuser ca, chat_group cg, say_to_group s "
      // + " WHERE (c.userid = ca.userid AND c.userid = s.tellerid AND s.unhide_usermindid = c.unhide_usermindid "
      // + " AND s.groupid = cg.groupid AND m.groupid = cg.groupid AND cg.groupid ='"
      // + groupid +"' AND m.userid = '"+userid+"') ORDER BY c.datetime_unhide  DESC, c.unhide_usermindid DESC LIMIT 30";
      // console.log(sql);
      con.query(sql, function (err, result, fields) {
        if (err) {throw err;reject()};
        resolve(result);
      });
    });
  },
  getgroupchats_UnreadMessagedata: async function(userid, groupid){
    return new Promise( function (resolve, reject) {
      //
      var sql = "select c.unhide_usermindid, c.userid, c.message_data, c.datetime_unhide, ca.username, ca.login"
      + " FROM unhide_usermind c, unread_group u, chatappuser ca "
      + " WHERE c.userid = ca.userid AND u.unhide_usermindid = c.unhide_usermindid AND u.datetime_read is NULL AND u.groupid ='" + groupid
      + "' AND u.readerid = '"+userid
      + /* ORDER BY ASC vi fronend se append*/"' ORDER BY c.datetime_unhide ASC, c.unhide_usermindid ASC  LIMIT 100";
      // console.log(sql);
      con.query(sql, function (err, result, fields) {
        if (err) {throw err;reject()};
        // console.log(result);
        resolve(result);
      });
    });
  },

  getGroupnotify: async function(userid, groupid){
    return new Promise( function (resolve, reject) {
      //
      var sql = "select COUNT(u.groupid) AS 'totalnoticecount', u.groupid FROM unhide_usermind c, unread_group u, chatappuser ca "
      + " WHERE c.userid = ca.userid AND u.unhide_usermindid = c.unhide_usermindid AND u.datetime_read is NULL AND u.readerid = '"+userid+"' GROUP BY u.groupid";
      // console.log(sql);
      con.query(sql, function (err, result, fields) {
        if (err) {throw err;reject()};
        // console.log(result);
        resolve(result);
      });
    });
  },

  getGroupInfomation: async function(userid,groupid){
    return new Promise( function (resolve, reject) {

      var sql = "select cg.groupid, cg.group_name, cg.creator, ca.userid, ca.username, ca.lastdatetimelogin ,ca.login FROM chat_group cg, member_of_chat_group m, chatappuser ca "
      + " WHERE cg.groupid = m.groupid AND  m.userid = ca.userid AND cg.groupid ='"+ groupid +"'";
      con.query(sql, function (err, result, fields) {
        if (err) {throw err;reject()};
        // console.log("getGroupInfomation: ", sql, result);
        resolve(result);
      });
    });
  },

getFriendInfomation: async function(userid, friendid){
  return new Promise( function (resolve, reject) {

    var sql = "select caf.userid, caf.username, caf.lastdatetimelogin FROM chatappuser ca, chatappuser caf, friend_relate f "
    + " WHERE ca.userid = f.userid AND  f.friend = caf.userid AND ca.userid ='"+ userid +"' AND caf.userid = '"+friendid+"'";
    con.query(sql, function (err, result, fields) {
      if (err) {throw err;reject()};
      // console.log("getGroupInfomation: ", sql, result);
      resolve(result);
    });
  });
},
  unhide_yourmind: async function(userid, message_data, datetime_unhide ){
    return new Promise( function (resolve, reject) {

      // console.log(datetime_send);
      var sql = "INSERT INTO  unhide_usermind (userid, message_data, datetime_unhide) value"
      +" ( '"+userid+"', '"+message_data+"', '"+datetime_unhide+"' );";
      con.query(sql, function (err, result, fields) {
        if (err) {throw err;reject(false)};
        resolve(result);
      });
    });
  },

  say_to_group: async function(userid, unhide_usermindid, groupid, datetime_tell ){
    return new Promise( function (resolve, reject) {

      // console.log(datetime_send);
      var sql = "INSERT INTO  say_to_group (tellerid, unhide_usermindid, groupid, datetime_tell) value"
      +" ( '"+userid+"', '"+unhide_usermindid+"', '"+groupid+"', '"+datetime_tell+"');";
      con.query(sql, function (err, result, fields) {
        if (err) {throw err;reject(false)};
        resolve(result);
      });
    });
  },

  insert_unread_group: async function(readerid, unhide_usermindid, groupid ){
    return new Promise( function (resolve, reject) {

      // console.log(datetime_send);
      var sql = "INSERT INTO  unread_group (readerid, unhide_usermindid, groupid) value"
      +" ( '"+readerid+"', '"+unhide_usermindid+"', '"+groupid+"');";
      con.query(sql, function (err, result, fields) {
        if (err) {throw err;reject(false)};
        resolve(true);
      });
    });
  },

  update_unread_group: async function(readerid, unhide_usermindid, datetime_read){
    return new Promise( function (resolve, reject) {

      // console.log(datetime_send);
      var sql = "UPDATE  unread_group set datetime_read = '"
      +datetime_read+ "' WHERE readerid= '" +readerid+ "' AND unhide_usermindid='"+ unhide_usermindid +"'";
      console.log(sql);
      con.query(sql, function (err, result, fields) {
        if (err) {throw err;reject(result)};
        resolve(result);
      });
    });
  },

  get_group_member: async function(userid, groupid){
    return new Promise( function (resolve, reject) {

      // console.log(datetime_send);
      var sql ="select ca.userid, ca.username, ca.login FROM  member_of_chat_group m, chatappuser ca "
      + " WHERE m.userid = ca.userid AND m.groupid ='"+ groupid +"' AND m.userid != '"+userid +"'";
      con.query(sql, function (err, result, fields) {
        if (err) {throw err;reject(false)};
        console.log(result);
        resolve(result);
      });
    });
  },

}

/**
* You first need to create a formatting function to pad numbers to two digits…
**/
function twoDigits(d) {
  if(0 <= d && d < 10) return "0" + d.toString();
  if(-10 < d && d < 0) return "-0" + (-1*d).toString();
  return d.toString();
}

/**
* …and then create the method to output the date string as desired.
* Some people hate using prototypes this way, but if you are going
* to apply this to more than one Date object, having it as a prototype
* makes sense.
**/
Date.prototype.toMysqlFormat = function() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
};
