function httpGet(term)
{
  var query = "https://www.googleapis.com/books/v1/volumes?q=search+"+term;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", query, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
