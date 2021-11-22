function addThis () {
  let content = document.getElementById("content").value;
  let contentType = document.getElementById("content_type").value;
  let returnValue =  makeHTML(content, contentType);
  document.getElementById("myPage").value += returnValue;
  document.getElementById("content").value = "";
}

function makeHTML(content,type){
   let toReturn = "";
   switch (type) {
     case "ingredients":
       toReturn = "<h1>Ingredients:</h1><br><p>" + content + "</p>";
       break;
     case "img":
       toReturn = "<img src='" + content + "'>";
       break;
     case "bordered":
       toReturn = "<div class='bordered'>" + content + "</div>";
       break;
     default:
       toReturn = content;
   }
   return toReturn;
 };