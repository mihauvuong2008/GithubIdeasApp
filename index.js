var express = require("express");

var formidable = require('formidable');// for upload file. npm install formidable
var mv = require('mv');// for upload file. npm install mv
var fs = require('fs');
var multer = require('multer');
const bodyParser = require("body-parser");
var mysqlDBTool = require('./mysqlDBTool');



var app = express();


// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

app.use(express.static("public"));


app.set("view engine", "ejs");
app.set("views", "./views");

app.listen(3000);

app.get("/", function(request, response)  {
  response.render("homePage");
});

app.get("/test", function(request, response)  {
  MysqlDB.log("hi");
  response.render("testPage");
});

app.get("/dreamweaverTest", (req,res)=>{
  res.render("interfaceTest")
})

app.get("/welcome", (req,res)=>{
  res.render("welcome")
});

app.get("/firstDBApp", (req,res)=>{
  res.render("firstDBApp")
});

app.get("/document",async (req,res)=>{

  var pagemode = [{ mode: 'mode1', value: 'documentPage' }];
  var var1 = 1;
  // console.log("mode: ", pagemode[0].mode);
  var doc_data = await mysqlDBTool.loadall_docdatatable();
  // console.log("docdata: ", doc_data);
  res.render("document", {
    myvar: var1,
    mode: pagemode,
    docdata: doc_data
  });
});


app.get("/editDoc" ,async (req,res)=>{

  var iddoc = {id: req.query.id };
  var doc = await mysqlDBTool.load_docdata(iddoc.id );
  if(doc.length>0){
    res.render("documentPageCkEditor", {
      id_doc: iddoc,
      docdata: doc[0]
    });
  } else {
    res.render("documentPageCkEditor");
  }
});


app.get("/deleteDoc", async (req,res)=>{

  await mysqlDBTool.remove_doc(req.query.id);
  var doc_data = await mysqlDBTool.loadall_docdatatable();
  // console.log("docdata: ", doc_data);
  res.render("document", {
    docdata: doc_data
  });
});


app.get("/ckEditorPage", (req,res)=>{
  res.render("documentPageCkEditor")
});

app.get("/initDatabase", (req,res)=>{
  mysqlDBTool.create_docdatatable();
  var   pagemode = [{ mode: 'mode1', value: 'documentPage' }];
  res.render("document", {
        mode: pagemode
    });
});


app.get("/postImage_uploader", (req,res)=>{
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
});


// googleBookAPI

app.get("/googleBookFinder", (req,res)=>{
  res.render("googleBookFinder");
});

app.get("/chatapp", (req,res)=>{
  res.render("chatapp");
});




app.post("/loginchecker2",  (req,res)=>{
  // console.log("req: ????");
  var form = new formidable.IncomingForm();
  var check = false;
  form.parse(req,async function (err, fields, files) {
    if(fields!==undefined){
      console.log("fields: ", fields);
    }
    console.log("files: ", files);
    var username = fields.username;
    var password = fields.password;
    check = await mysqlDBTool.checklogin(username, password);
    console.log(check);

    if (check) {
      res.json({ status: "ok" }) ;
    }else {
      res.json({ status: "login false 2" }) ;
    }
    //res.write('File uploaded and moved!');
    res.status(200).end();
  });
});








// upload image: myCkeditorUploadAdapter
app.post("/fileupload", (req,res)=>{
  // console.log("req: ????");
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    // if(fields!==undefined){
    //   console.log("fields: ", fields);
    // }
    // console.log("files: ", files);

    var oldpath = files.filetoupload.path;
    // vi tri o dia server
    console.log("__dirname", __dirname);
    var currLocalDisk = __dirname;
    var newpath = currLocalDisk+ '\\public\\uploads\\Images\\' + files.filetoupload.name;
    mv(oldpath , newpath, function(err) {
      if (err) throw err;
      var MyWebSiteAddress = "http://localhost:3000/";
      var publicResource = "uploads/Images/";
      res.json({ url: MyWebSiteAddress + publicResource + files.filetoupload.name }) ;
      //res.write('File uploaded and moved!');
      res.status(200).end();
    });
  });
});



app.post("/ckeditor_upload", (req,res)=>{
    // console.log("req: ????");
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      if(fields!==undefined){
        console.log("fields: ", fields);
      }
      console.log("files: ", files);
      var idData = fields.keytoupload;
      var titleData = fields.titletoupload;
      var htmlData = fields.texttoupload;
      saveDowntoMsqlDB(idData, titleData, htmlData);
    });
    res.json({ status: "ok" }) ;
    //res.write('File uploaded and moved!');
    res.status(200).end();
});

saveDowntoMsqlDB  =(idData, titleData, htmlData)=>{
  // console.log("titleData: ", titleData);
  //   console.log("htmlData: ", htmlData);
  var key = parseInt(idData);
  if(key>=0){
    mysqlDBTool.update_docdata( key,titleData, htmlData);
  }else{
    mysqlDBTool.insert_docdata(titleData, htmlData);
  }

}

// xac thuc nguoi dung: sau khi goi init, approuter se yeu cau xac thuc
const initAPIs = require("./authenticate-user/authenuserAPI");
// Cho phép các api của ứng dụng xử lý dữ liệu từ body của request
app.use(express.json());
// Khởi tạo các routes cho ứng dụng
initAPIs(app);




// get data client post to server:
//const bodyParser = require("body-parser");
/** bodyParser.urlencoded(options)
* Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
* and exposes the resulting object (containing the keys and values) on req.body
*/

app.use(bodyParser.urlencoded({
  extended: true
}));
/**bodyParser.json(options)
* Parses the text as JSON and exposes the resulting object on req.body.
*/
app.use(bodyParser.json());
app.post('/', function(request, response){
  console.log(request.body.user.name)
  response.render("homePage");
});
