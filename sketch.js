/*
Data and machine learning for artistic practice

V1RTUAL OC34N - a pix2pix model to create virtual seaslugs from your sketch. This project has sound

INSTRUCTION:
'+' for increasing brush size
'-' for decreasing brush size
ENTER to apply pix2pix, there is no limitation on how many times you want to apply pix2pix. Think of duplicating a layer in photoshop
'c' to clear canvas 

When you're happy with the result, right click to save image.
*/

let SIZE = 256 ,
    pix2pix,
    isProcessing = true;

let song, sparkle;

let strokeSize;

function setup() {
    createCanvas(SIZE*2, SIZE);
    strokeSize = 1;
    
    // load my trained model
    pix2pix = ml5.pix2pix("/models/seaslug_v2_AtoB.pict", modelLoaded);

    // music
    song = loadSound("/src/underwater.mp3", soundLoaded);
    sparkle = loadSound("/src/sparkle.mp3", soundLoaded);
    
    // draw background
    background(0);
}

function soundLoaded(){
    song.play();
    
}


// Draw on the canvas when mouse is pressed
function draw() {
    //distingush between drawing and result area, kinda cheating here
    stroke(255,255,0);
    rect(256,0,1,256);
    
    // really simple line drawing
    if (mouseIsPressed) {
        strokeWeight(strokeSize);
        stroke(255);
        line(mouseX, mouseY, pmouseX, pmouseY);
    }
}

function keyPressed() {
  if (keyCode === RETURN && !isProcessing) {
      // press return to start transfer
      runPix2Pix();
  }else if (keyCode === 67) {
      // press c to clear
      background(0);
      //press + to make the brush bigger
  } else if (keyCode === 187){
      strokeSize++;
      console.log("+");
      if (strokeSize > 5) strokeSize = 5;
  } else if(keyCode === 189 ){
      // press - to make the brush smaller
      strokeSize--;
      console.log("-");
      if(strokeSize<1) strokeSize = 1;
  }
}

function mouseIsPressed(){
    userStartAudio();
}


function modelLoaded() {
    console.log('model loaded');
    isProcessing = false;
}

function runPix2Pix() {
    // Update status message
    isProcessing = true;
    console.log("applying pix2pix");

    // pix2pix requires a canvas DOM element, we can get p5.js canvas and pass this
    // Select canvas DOM element, this is the p5.js canvas
    const canvasElement = select("canvas").elt;

    // Apply pix2pix transformation
    pix2pix.transfer(canvasElement).then((result) => {
        isProcessing = false;
        let rec_img = createImg(result.src, "a generated image using pix2pix").hide(); // hide the DOM element
        scale(0.5,0.5);
        image(rec_img, 512, 0); // draw the image on the canvas
        sparkle.play();
        rec_img.remove(); // this removes the DOM element, as we don't need it anymore
    });
}