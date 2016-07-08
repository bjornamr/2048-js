var width = 4
var height = 4
var score = 0

var colours = {
    65536:"",
    32768:"",
    16384:"",
    8192:"",
    4096:"",
    2048:"",
    1024:"",
    512:"",
    256:"",
    128:"",
    64:"",
    32:"",
    16:"",
    8:"",
    4:"",
    2:"",
    0:""
}



function existsMoreThan1(colour){
    var counter = 0
    for(var key in colours){
        if (colours[key] == colour){
            counter +=1
        }
    }
    return counter >2
}



function generateColors(){
  for(var key in colours){

      colours[key] = '#' + Math.floor(Math.random()*16777215).toString(16);
      while (existsMoreThan1(colours[key])){
          colours[key] = '#' + Math.floor(Math.random()*16777215).toString(16);
      }
  }
}

function startgame() {
   generateColors()
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {

            document.getElementById(i.toString() + "-" + j.toString()).innerHTML = 0
            document.getElementById(i.toString() + "-" + j.toString()).style.backgroundColor = colours[0]
        }
    }
    var arr = getArray()
    getRandom(arr)
    chooseEmptySpot();                                              // random generated place of empty tiles.
    chooseEmptySpot();
    score = 0;

}


function getArray(){
    var array =[]
    for(var i= 0; i<4; i++) {
        var list = []
        for(var j= 0; j<4; j++) {

            list.push(parseFloat(document.getElementById(i.toString() + "-" + j.toString()).innerHTML))


        }
        array.push(list)
    }


    return array
}



function getRandom(arr) {
    var i = Math.floor((Math.random() * (arr.length)));
    var j = Math.floor(Math.random()*arr[i].length)

    return arr[i][j]
}

function isEmpty(x, y, board) {
    return board[x][y] == 0;
}


function getEmptyTiles(gridValues) {  // getting all the empty tiles
     emptyTiles = [];
    for (var x = 0; x < gridValues.length; x++) {
        for (var y = 0; y < gridValues[x].length; y++) {
            if (isEmpty(x, y, gridValues)) emptyTiles.push(i2Dto1D(x, width, y));
        }
    }
    return emptyTiles;
}


function i2Dto1D(x, rowlength, y) {
    return (x * 4) + y; // Indexes from 2D to 1D
}
function i1Dto2D(index) {
    var indexes = [];
    indexes[0] = Math.floor(index / width); // X value
    indexes[1] = Math.floor(index % height); // Y value
  //  console.log(indexes[0],indexes[1])
    return indexes;
}

function setTile(x,y,number){
    document.getElementById((x).toString() + "-" + (y).toString()).style.background = colours[number]
    document.getElementById((x).toString() + "-" + (y).toString()).innerHTML = number
}

function chooseEmptySpot() { //
    var arr = getEmptyTiles(getArray()); // all the empty spots.
    if (arr.length != 0) {
        var randomIndex = Math.floor((Math.random() * (arr.length))) // index from emptyTiles
        var emptyindex = i1Dto2D(arr[randomIndex]);  // index is now X and Y //

        setTile(emptyindex[0], emptyindex[1], genTwosfours()); // setting tiles
    }
}

function genTwosfours(){
        return Math.random() < 0.9 ? 2 : 4;
}




document.onkeydown = function(event) {
    if (!event) {
    event = window.event;
    }
    var code = event.keyCode;
    if (event.charCode && code == 0) {
        code = event.charCode;
    }
    //console.log(code)
    switch(code) {
        case 37: // LEFT

            //document.body.innerHTML += "left";
            mergeTilesLeft() //
            chooseEmptySpot();
            break;
        case 38: // UP
            mergeTilesUp()
            chooseEmptySpot()
            //document.body.innerHTML += "up";
            break;
        case 39: // RIGHT
            mergeTilesRight()
            chooseEmptySpot();
            //document.body.innerHTML += "right";
            break;
        case 40: // DOWN

            mergeTilesDown()
            chooseEmptySpot()
            //document.body.innerHTML += "down";
            break;
        case 83:
            startgame()
            break;

    }

    event.preventDefault();
};


 function rotateRight(array){ // Rotates 90 degrees to the right
    var temp = new Array(array.length);
    var i, j;
    for(i = 0; i < temp.length; ++i){
        temp[i] = new Array(temp.length);
        for (j = 0; j < temp.length; ++j){
            temp[i][j] = array[temp.length - j - 1][i];
        }
    }
    return temp;
}

function mergeTilesLeft() {   // Removing zeros and merging left
 var newstate = getArray()
    for(var i= 0; i<4; i++) {
        //console.log("List",newstate[i])
        newstate[i] = mergeLeft(newstate[i])
        //console.log("Merged",newstate[i])
        for(var j= 0; j<4; j++) {
        setTile(i,j,newstate[i][j])
        }
    }

}

function mergeTilesRight() { // does the same for this array, just reversed.
    var newstate = getArray()
    for(var i= 0; i<4; i++) {
        //console.log("List",newstate[i])
        newstate[i] = mergeLeft(newstate[i].reverse()).reverse() // needs to reverse and reverse back to be able to setTile
        //console.log("Merged",newstate[i])
        for(var j= 0; j<4; j++) {
            setTile(i,j,newstate[i][j])
        }
    }

}

function mergeTilesUp() {
// To use the leftwards merge i rotate the 2d-array three times
// and in the end rotate to the right once more to get original position before printing.

    //console.log(getArray())
    var newstate = rotateRight(rotateRight(rotateRight(getArray())))
    //console.log(newstate)
    for(var i= 0; i<4; i++) {

        newstate[i] = mergeLeft(newstate[i])
        /*for(var j= 0; j<4; j++) {
            setTile(i,j,newstate[i][j])
        }*/
    }
    var newstate2 = rotateRight(newstate)
    for (var j = 0; j <4; j++){
        for (var k =0; k<4; k++){
            setTile(j,k,newstate2[j][k])
        }
    }
}

function mergeTilesDown() {
    // Only one rotation is needed to use rotateLeft here.
    // Then you need to rotate three times before printing.
    //console.log(getArray())
    var newstate = rotateRight(getArray())
    //console.log(newstate)
    for(var i= 0; i<4; i++) {

        newstate[i] = mergeLeft(newstate[i])
        /*for(var j= 0; j<4; j++) {
         setTile(i,j,newstate[i][j])
         }*/
    }
    var newstate2 = rotateRight(rotateRight(rotateRight(newstate)))
    for (var j = 0; j <4; j++){
        for (var k =0; k<4; k++){
            setTile(j,k,newstate2[j][k])
        }
    }
}

function removeZeros(listoflist){
    // This one is removing zeros
    //
    var newlist =[]
    for(var x =0; x<listoflist.length; x++){

        if (listoflist[x] !=0 ){
            newlist.push(listoflist[x])
        }
    }
    if (newlist.length < listoflist.length){

        var tempnum = newlist.length
        var num = listoflist.length - tempnum

        while ( num > 0 ){

            newlist.push(0)
            num-=1
        }

    }
    return newlist


}

function mergeLeft(list){
    var kk = removeZeros(list)
    for (var i =0; i<kk.length-1; i++){

        if (kk[i] == kk[i+1]){
            kk[i] *=2
            kk[i+1] =0
        }
    }
 return removeZeros(kk)
}