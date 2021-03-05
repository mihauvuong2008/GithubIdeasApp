
var createTile = false;

function createTitle(){
  createTile = true;
  modal.style.display = "none";
}
function clearText(){
  var modal = document.getElementById("titleBox").value = "";
};

function onpenTitleBox(){
  document.getElementById("titleBox").value = "Document title here...";
  modal.style.display = "block";
};

// Get the modal src = w3schools.com
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal src = w3schools.com
var span = document.getElementsByClassName("close")[0];


// When the user clicks on <span> (x), close the modal src = w3schools.com
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it src = w3schools.com
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
