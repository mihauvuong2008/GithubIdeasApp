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
}

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
