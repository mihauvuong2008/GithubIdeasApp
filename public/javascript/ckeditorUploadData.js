
function sendData( data /*ckeditor data*/ ) {
  const XHR = new XMLHttpRequest(),
  FD  = new FormData();

  // Push our data into our FormData object
  FD.append( "texttoupload", data ,  /*thich thi "dien ten hinh vao day.jpg"*/);
  console.log("texttoupload front en here:  ", data);
  // Define what happens on successful data submission
  XHR.addEventListener( 'load', function( event ) {
    alert( 'Yeah! Data sent and response loaded.' );
  } );

  // Define what happens in case of error
  XHR.addEventListener(' error', function( event ) {
    alert( 'Oops! Something went wrong.' );
  } );

  // Set up our request
  XHR.overrideMimeType("multipart/form-data");
  XHR.open( 'POST', '/ckeditor_upload', true );

  // Send our FormData object; HTTP headers are set automatically
  XHR.send( FD );
}









//======================== remake upload data================================



// Starts the upload process.
function upload(key, title, data) {
  new Promise( ( resolve, reject ) => {
    this._initRequest();
    this._initListeners( resolve, reject );
    this._sendRequest( key, title, data );
  } );
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
  xhr.open( 'POST', '/ckeditor_upload', true );
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

    console.log("response.url: ", response);
    if ( !response || response.error ) {
      return reject( response && response.error ? response.error.message : genericErrorText );
    }
    // If the upload is successful, resolve the upload promise with an object containing
    // at least the "default" URL, pointing to the image on the server.
    // This URL will be used to display the image in the content. Learn more in the
    // UploadAdapter#upload documentation.
    resolve( {
      default: response.url
    } );
  //  alert("upload: "+ response.status);
    console.log("upload: "+ response.status);
  } );

  // Upload progress when it is supported. The file loader has the #uploadTotal and #uploaded
  // properties which are used e.g. to display the upload progress bar in the editor
  // user interface.
  if ( xhr.upload ) {
    xhr.upload.addEventListener( 'progress', evt => {
      if ( evt.lengthComputable ) {
        var percentComplete = (evt.loaded / evt.total) * 100;
      }
      console.log("evt percent: ", percentComplete);
    });
  }
}

// Prepares the data and sends the request.
function _sendRequest(key, title, data) {
  // Prepare the form data.
  const formdata = new FormData();
  formdata.append( 'keytoupload', key );
  formdata.append( 'titletoupload', title );
  formdata.append( 'texttoupload', data );

  // Important note: This is the right place to implement security mechanisms
  // like authentication and CSRF protection. For instance, you can use
  // XMLHttpRequest.setRequestHeader() to set the request headers containing
  // the CSRF token generated earlier by your application.

  // Send the request.
  this.xhr.send( formdata );
  console.log("data front end here: ", formdata);
}
