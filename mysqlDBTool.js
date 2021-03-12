var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "githubideanodejswebapp"
});


let mysqlConnecState = false;

module.exports = {
  connectMysqlDB: connectMysqlDB = function(){
    if(!mysqlConnecState){
      con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        mysqlConnecState = true;
      });
    }
  },
  check_docdatatable_exist: function(){
    if(!mysqlConnecState){
      connectMysqlDB();
    }
    var check_ckeditordata_exit = "SELECT * FROM information_schema.tables WHERE table_schema = 'githubideanodejswebapp' AND table_name = 'ckeditordata' LIMIT 1;"
    con.query(check_ckeditordata_exit, function (err, result) {
      if (err) throw err;
      return result.length;
    });
  },
  create_docdatatable: function(){
    if(!mysqlConnecState){
      connectMysqlDB();
    }
    console.log("create table ckeditor doc data:");
    var create_ckeditordata = "CREATE TABLE IF NOT EXISTS ckeditordata ( id_doc INT AUTO_INCREMENT NOT NULL PRIMARY KEY, doc_name VARCHAR(255) NOT NULL, content MEDIUMTEXT, link VARCHAR (511), creatdate DATETIME )";
    con.query(create_ckeditordata, function (err, result) {
      if (err) throw err;
      console.log("Table ckeditor doc data created!");
    });
  },

  insert_docdata: function(titleData, htmlData){
    if(!mysqlConnecState){
      connectMysqlDB();
    }
    console.log("insert_docdata:");
    var insert_ckeditordata = "INSERT INTO  ckeditordata ( doc_name, content , creatdate ) value ('"+titleData+"', '"+htmlData+"', '"+Date.prototype.toMysqlFormat() +"')";
    con.query(insert_ckeditordata, function (err, result) {
      if (err) throw err;
      console.log("insert_docdataed!");
    });
  },
  update_docdata: function(iddoc, titleData, htmlData){
    if(!mysqlConnecState){
      connectMysqlDB();
    }
    console.log("update_docdata:");
    var update_ckeditordata = "UPDATE ckeditordata set   doc_name ='" + titleData + "',  content ='" + htmlData + "'  where id_doc='"+ iddoc +"'";
    con.query(update_ckeditordata, function (err, result) {
      if (err) throw err;
      console.log("update_docdataed!");
    });
  },
  loadall_docdatatable: async function(){
    return new Promise( function (resolve, reject) {
      if(!mysqlConnecState){
        connectMysqlDB();
      }
      console.log("loadall_docdatatable:");
      con.query("SELECT * FROM ckeditordata", function (err, result, fields) {
        if (err) {throw err;reject()};
        resolve(result);
      });
    });
  },
  load_docdata: async function(iddoc){
    return new Promise( function (resolve, reject) {
      if(!mysqlConnecState){
        connectMysqlDB();
      }
      console.log("load_docdata:");
      con.query("SELECT * FROM ckeditordata where id_doc='"+ iddoc +"'", function (err, result, fields) {
        if (err) {throw err;reject()};
        resolve(result);
      });
    });
  },

  remove_doc: async function(iddoc){
    return new Promise( function (resolve, reject) {
      if(!mysqlConnecState){
        connectMysqlDB();
      }
      console.log("remove_doc:");
      var sql = "DELETE FROM ckeditordata WHERE id_doc ='"+ iddoc +"'";
      con.query(sql, function (err, result, fields) {
        if (err) {throw err;reject()};
        resolve(result);
      });
    });
  },

  checklogin: async function(username, password){
    return new Promise( function (resolve, reject) {
      if(!mysqlConnecState){
        connectMysqlDB();
      }
      console.log("remove_doc:");
      var sql = "select userid, username, password FROM chatappuser WHERE username ='"+ username +"'";
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

  getFriendlist: async function(userid){
    return new Promise( function (resolve, reject) {
      if(!mysqlConnecState){
        connectMysqlDB();
      }
      var sql = "select c.userid, c.username, c.login FROM chatappuser c, friend_relate WHERE friend_relate.userid ='"+ userid +"' AND c.userid=friend_relate.friend";
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
      if(!mysqlConnecState){
        connectMysqlDB();
      }
      var sql = "select c.id_group, c.group_name, c.datetime_create FROM chat_group c, member_of_chat_group m WHERE c.id_group = m.id_group AND m.userid ='"+ userid +"' ";
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
  getGroupConversation: async function(userid,groupid){
    return new Promise( function (resolve, reject) {
      if(!mysqlConnecState){
        connectMysqlDB();
      }

      var sql = "select c.id_message, c.sender, c.message_data, c.datetime_send, ca.username, ca.login FROM chat_group_message_data c, member_of_chat_group m, chatappuser ca, chat_group cg"
      + " WHERE c.sender = ca.userid AND  c.id_group = cg.id_group AND m.id_group = c.id_group AND c.id_group ='"+ groupid +"' AND m.userid = '"+userid+"' ORDER BY c.datetime_send DESC LIMIT 100";

      con.query(sql, function (err, result, fields) {
        if (err) {throw err;reject()};
        resolve(result);
      });
    });
  },
  getGroupInfomation: async function(userid,groupid){
    return new Promise( function (resolve, reject) {
      if(!mysqlConnecState){
        connectMysqlDB();
      }
      var sql = "select cg.id_group, cg.group_name, cg.creator, ca.userid, ca.username, ca.login FROM chat_group cg, member_of_chat_group m, chatappuser ca "
      + " WHERE cg.id_group = m.id_group AND  m.userid = ca.userid AND cg.id_group ='"+ groupid +"'";
      con.query(sql, function (err, result, fields) {
        if (err) {throw err;reject()};
        console.log("getGroupInfomation: ",result);
        resolve(result);
      });
    });
  },
  sendmessagetoGroup: async function(userid, groupid, message, datetime_send ){
    return new Promise( function (resolve, reject) {
      if(!mysqlConnecState){
        connectMysqlDB();
      }
      console.log(datetime_send);
      var sql = "INSERT INTO  chat_group_message_data (id_group, sender, message_data, datetime_send) value"
      +" ( '"+groupid+"', '"+userid+"', '"+message+"', '"+datetime_send+"');";
      con.query(sql, function (err, result, fields) {
        if (err) {throw err;reject(false)};
        resolve(true);
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
