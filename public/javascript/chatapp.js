
function getFriendConversation (friendID, token){
  return new Promise(function(resolve, reject) {
    var query = "/friendchats_messagedata?friendID="+friendID;
    var xmlHttp = new XMLHttpRequest();
    // myRequest.headers.get('Content-Type')
    xmlHttp.open( "GET", query, false ); // false for synchronous request
    xmlHttp.setRequestHeader("x-access-token", token);
    xmlHttp.send( "" );
    resolve(xmlHttp.responseText);
  });
}


function  getFriendInfomation(friendID, token){
  return new Promise(function(resolve, reject) {
    var query = "/friendchats_info?friendID="+friendID;
    var xmlHttp = new XMLHttpRequest();
    // myRequest.headers.get('Content-Type')
    xmlHttp.open( "GET", query, false ); // false for synchronous request
    xmlHttp.setRequestHeader("x-access-token", token);
    xmlHttp.send( "" );
    resolve(xmlHttp.responseText);
  });;
}


async function getfriendstillonline(userid, token){
  return new Promise(function(resolve, reject) {
    var query = "/friendstillonline?userid="+userid;
    var xmlHttp = new XMLHttpRequest();
    // myRequest.headers.get('Content-Type')
    xmlHttp.open( "GET", query, false ); // false for synchronous request
    xmlHttp.setRequestHeader("x-access-token", token);
    xmlHttp.send("");
    // console.log("group online here: ", xmlHttp.responseText);
    resolve(xmlHttp.responseText);
  });
}

async function istillonline(token){
  // new Promise(function(resolve, reject) {
  var query = "/istillonline";
  var xmlHttp = new XMLHttpRequest();
  // myRequest.headers.get('Content-Type')
  xmlHttp.open( "GET", query, false ); // false for synchronous request
  xmlHttp.setRequestHeader("x-access-token", token);
  xmlHttp.send("");
  // console.log("group notify here: ", xmlHttp.responseText);
  return(xmlHttp.responseText);
  // });
}

async function setitem_readedMessage_Group(item, datetime_read, token){
  var data = {"readerid": "token", "unhide_usermindid": item.unhide_usermindid, "datetime_read": datetime_read}
  var res = await postitemReadedmessageGroup(data , token);
  // console.log("res.default: ", res.default);
  if (res.default) {
    item.success = true;
    item.resID = res.default.insertId;
    item.datetime_read = datetime_read;
  }else {
    item.success = false;
  }
}

async function getGroupNotify(token){
  // new Promise(function(resolve, reject) {
  var query = "/groupnotify";
  var xmlHttp = new XMLHttpRequest();
  // myRequest.headers.get('Content-Type')
  xmlHttp.open( "GET", query, false ); // false for synchronous request
  xmlHttp.setRequestHeader("x-access-token", token);
  xmlHttp.send("");
  // console.log("group notify here: ", xmlHttp.responseText);
  return(xmlHttp.responseText);
  // });
}

function getGroupUnreadmessage(groupID, token){
  return new Promise(function(resolve, reject) {
    var query = "/groupchats_unreadmessage?groupID="+groupID;
    var xmlHttp = new XMLHttpRequest();
    // myRequest.headers.get('Content-Type')
    xmlHttp.open( "GET", query, false ); // false for synchronous request
    xmlHttp.setRequestHeader("x-access-token", token);
    xmlHttp.send("");
    resolve(xmlHttp.responseText);
  });
}

async function sendMessagetoGroup(groupid, item, token){
  var data = {"groupid": groupid, "message": item.message, "datetime_send": item.datetimesend}
  console.log("data:", data);
  var res = await postMessagetoGroup(data , token);
  // console.log("message send, res.default: ",res, data, res.default);
  if (res.default) {
    item.success = true;
    item.resID = res.default.insertId;
  }else {
    item.success = false;
  }
}


function postitemReadedmessageGroup(data, token){
  return new Promise(( resolve, reject ) => {
    const xhr = this.xhr = new XMLHttpRequest();
    xhr.open( 'POST', '/postitemReadedmessageGroup', true );
    xhr.responseType = 'json';
    const loader = this.loader;
    const genericErrorText = "Couldn't upload data";
    // add listeners
    xhr.addEventListener( 'error', () => reject( genericErrorText ) );
    xhr.addEventListener( 'abort', () => reject() );
    xhr.addEventListener( 'load', () => {
      const response = xhr.response;
      // This example assumes the XHR server's "response" object will come with
      // an "error" which has its own "message" that can be passed to reject()
      // in the upload promise.
      // console.log("response.status: ", response);
      if ( !response || response.error ) {
        return reject( response && response.error ? response.error.message : genericErrorText );
      }
      // If the upload is successful, resolve the upload promise with an object containing
      // at least the "default" URL, pointing to the image on the server.
      // This URL will be used to display the image in the content. Learn more in the
      // UploadAdapter#upload documentation.
      resolve( {
        default: response
      } );
      //  alert("upload: "+ response.status);
    } );

    // Upload progress when it is supported. The file loader has the #uploadTotal and #uploaded
    // properties which are used e.g. to display the upload progress bar in the editor
    // user interface.
    if ( xhr.upload ) {
      xhr.upload.addEventListener( 'progress', evt => {
        if ( evt.lengthComputable ) {
          var percentComplete = (evt.loaded / evt.total) * 100;
        }
        // console.log("evt percent: ", percentComplete);
      });
    }
    const formdata = new FormData();
    formdata.append( 'readerid', data.readerid );
    formdata.append( 'unhide_usermindid', data.unhide_usermindid );
    formdata.append( 'datetime_read', data.datetime_read );
    // Send the request.
    this.xhr.setRequestHeader("x-access-token", token);
    this.xhr.send( formdata );
  });
}


function postMessagetoGroup(data, token){
  return new Promise(( resolve, reject ) => {
    const xhr = this.xhr = new XMLHttpRequest();
    xhr.open( 'POST', '/postmessagetogroup', true );
    xhr.responseType = 'json';
    const loader = this.loader;
    const genericErrorText = "Couldn't upload data";
    // add listeners
    xhr.addEventListener( 'error', () => reject( genericErrorText ) );
    xhr.addEventListener( 'abort', () => reject() );
    xhr.addEventListener( 'load', () => {
      const response = xhr.response;
      // This example assumes the XHR server's "response" object will come with
      // an "error" which has its own "message" that can be passed to reject()
      // in the upload promise.
      // console.log("response.status: ", response);
      if ( !response || response.error ) {
        return reject( response && response.error ? response.error.message : genericErrorText );
      }
      // If the upload is successful, resolve the upload promise with an object containing
      // at least the "default" URL, pointing to the image on the server.
      // This URL will be used to display the image in the content. Learn more in the
      // UploadAdapter#upload documentation.
      resolve( {
        default: response
      } );
      //  alert("upload: "+ response.status);
    } );

    // Upload progress when it is supported. The file loader has the #uploadTotal and #uploaded
    // properties which are used e.g. to display the upload progress bar in the editor
    // user interface.
    if ( xhr.upload ) {
      xhr.upload.addEventListener( 'progress', evt => {
        if ( evt.lengthComputable ) {
          var percentComplete = (evt.loaded / evt.total) * 100;
        }
        // console.log("evt percent: ", percentComplete);
      });
    }
    const formdata = new FormData();
    formdata.append( 'groupid', data.groupid );
    formdata.append( 'message', data.message );
    formdata.append( 'datetime_send', data.datetime_send );
    // Send the request.
    this.xhr.setRequestHeader("x-access-token", token);
    this.xhr.send( formdata );
  });
}

// Aborts the upload process.
function abort() {
  if ( this.xhr ) {
    this.xhr.abort();
  }
}


async function sendMessagetoFriend(item, token){
  var res = await postMessagetoFriend();
  if (res.default) {
    item.success = true;
  }else {
    item.success = false;
  }
}


function getFriendlist(token){
  return new Promise(function(resolve, reject) {
    var query = "/friends";
    var xmlHttp = new XMLHttpRequest();
    // myRequest.headers.get('Content-Type')
    xmlHttp.open( "GET", query, false ); // false for synchronous request
    xmlHttp.setRequestHeader("x-access-token", token);
    xmlHttp.send( "" );
    resolve(xmlHttp.responseText);

  });;
}

function getGroup_chat(token){
  return new Promise(function(resolve, reject) {
    var query = "/groupchats";
    var xmlHttp = new XMLHttpRequest();
    // myRequest.headers.get('Content-Type')
    xmlHttp.open( "GET", query, false ); // false for synchronous request
    xmlHttp.setRequestHeader("x-access-token", token);
    xmlHttp.send( "" );
    resolve(xmlHttp.responseText);

  });;
}

function getGroupConversation(groupID, token){
  return new Promise(function(resolve, reject) {
    var query = "/groupchats_messagedata?groupID="+groupID;
    var xmlHttp = new XMLHttpRequest();
    // myRequest.headers.get('Content-Type')
    xmlHttp.open( "GET", query, false ); // false for synchronous request
    xmlHttp.setRequestHeader("x-access-token", token);
    xmlHttp.send( "" );
    resolve(xmlHttp.responseText);
  });
}

function getGroupInfomation(groupID, token){
  return new Promise(function(resolve, reject) {
    var query = "/groupchats_info?groupID="+groupID;
    var xmlHttp = new XMLHttpRequest();
    // myRequest.headers.get('Content-Type')
    xmlHttp.open( "GET", query, false ); // false for synchronous request
    xmlHttp.setRequestHeader("x-access-token", token);
    xmlHttp.send( "" );
    resolve(xmlHttp.responseText);
  });;
}


function getCurrentUsersession(token){
  var query = "/getuserSession";
  var xmlHttp = new XMLHttpRequest();
  // myRequest.headers.get('Content-Type')
  xmlHttp.open( "GET", query, false ); // false for synchronous request
  xmlHttp.setRequestHeader("x-access-token", token);
  xmlHttp.send("");
  return xmlHttp.responseText;
}

function httploginchecker(data){
  return new Promise(( resolve, reject ) => {
    this._initRequest();
    this._initListeners( resolve, reject );
    this._sendRequest( data );
  });
}

// Aborts the upload process.
function abort() {
  if ( this.xhr ) {
    this.xhr.abort();
  }
}

// Initializes the XMLHttpRequest object using the URL passed to the constructor.
function _initRequest() {
  const xhr = this.xhr = new XMLHttpRequest();

  // Note that your request may look different. It is up to you and your editor
  // integration to choose the right communication channel. This example uses
  // a POST request with JSON as a data structure but your configuration
  // could be different.
  xhr.open( 'POST', '/loginchecker', true );
  xhr.responseType = 'json';
}

// Initializes XMLHttpRequest listeners.
function _initListeners( resolve, reject) {
  const xhr = this.xhr;
  const loader = this.loader;
  const genericErrorText = "Couldn't upload data";

  xhr.addEventListener( 'error', () => reject( genericErrorText ) );
  xhr.addEventListener( 'abort', () => reject() );
  xhr.addEventListener( 'load', () => {
    const response = xhr.response;

    // This example assumes the XHR server's "response" object will come with
    // an "error" which has its own "message" that can be passed to reject()
    // in the upload promise.
    //
    // Your integration may handle upload errors in a different way so make sure
    // it is done properly. The reject() function must be called when the upload fails.

    // console.log("response.status: ", response);
    if ( !response || response.error ) {
      return reject( response && response.error ? response.error.message : genericErrorText );
    }
    // If the upload is successful, resolve the upload promise with an object containing
    // at least the "default" URL, pointing to the image on the server.
    // This URL will be used to display the image in the content. Learn more in the
    // UploadAdapter#upload documentation.
    resolve( {
      default: response
    } );
    //  alert("upload: "+ response.status);
  } );

  // Upload progress when it is supported. The file loader has the #uploadTotal and #uploaded
  // properties which are used e.g. to display the upload progress bar in the editor
  // user interface.
  if ( xhr.upload ) {
    xhr.upload.addEventListener( 'progress', evt => {
      if ( evt.lengthComputable ) {
        var percentComplete = (evt.loaded / evt.total) * 100;
      }
      // console.log("evt percent: ", percentComplete);
    });
  }
}

// Prepares the data and sends the request.
function _sendRequest(data) {
  // Prepare the form data.
  const formdata = new FormData();
  formdata.append( 'username', data.username );
  formdata.append( 'password', data.password );

  // Important note: This is the right place to implement security mechanisms
  // like authentication and CSRF protection. For instance, you can use
  // XMLHttpRequest.setRequestHeader() to set the request headers containing
  // the CSRF token generated earlier by your application.

  // Send the request.
  this.xhr.send( formdata );
  // console.log("data front end here: ", formdata);
}
