//
// this is the code for the DSP midterm 2022
//

let fileName;
let mySound;
let playButton;
let stopButton;
let pauseButton;
let sliderVolume;
let sliderRate;
let sliderPan;
let radio;

// set array for paths of the 3 songs
let songs = [
    './sounds/476070__jjmarsan__hello-user-bright-cheery-intro-music.wav',
    './sounds/476072__jjmarsan__wax-track-industrial-idm-score-music.mp3',
    './sounds/487440__jjmarsan__tattle-vintage-synth-industrial-loop.wav'
];

// create array for sound objects
let mySounds = [];

// extra butons
let skipStartButton;
let skipEndButton;
let loopOnOffButton;

function preload() {
    soundFormats('mp3', 'wav');

    //load all songs from the paths
    songs.forEach(song => {
        mySounds.push(loadSound(song));
    });

    //Default to first song
    fileName = songs[0];
    mySound = mySounds[0];
}

function setup() {
    createCanvas(500, 450);
    background(180);

    // buttons
    playButton = createButton('play');
    playButton.position(20, 20);
    playButton.mousePressed(playSound);

    stopButton = createButton('stop');
    stopButton.position(80, 20);
    stopButton.mousePressed(stopSound);

    pauseButton = createButton('pause');
    pauseButton.position(140, 20);
    pauseButton.mousePressed(pauseSound);

    //mySound.playMode('restart');
    skipStartButton = createButton('skip to start');
    skipStartButton.position(200, 20);
    skipStartButton.mousePressed(skipStart);

    skipEndButton = createButton('skip to end');
    skipEndButton.position(300, 20);
    skipEndButton.mousePressed(skipEnd);

    loopOnOffButton = createButton('loop on');
    loopOnOffButton.position(400, 20);
    loopOnOffButton.mousePressed(loopOnOff);

    // sliders
    sliderVolume = createSlider(0, 2, 1, 0.01);
    sliderVolume.position(20, 125);
    //text(`volume (${sliderVolume.value()})`, 80, 20);
    sliderRate = createSlider(-2, 2, 1, 0.01);
    sliderRate.position(20, 170);
    //text(`rate(${sliderRate.value()})`, 80, 65);
    sliderPan = createSlider(-1, 1, 0, 0.01);
    sliderPan.position(20, 215);
    //text(`pan (${sliderPan.value()})`, 80, 110);

    // create and display radio selection
    radio = createRadio();
    radio.position(20, 300);
    text('select song :', 20, 290);
    radio.option('476070');
    text(songs[0], 50, 310);
    radio.option('476072');
    text(songs[1], 50, 350);
    radio.option('487440');
    text(songs[2], 50, 390);
    radio.style('width', '60px');
    radio.selected('476070');
}

function playSound() {
    if (!mySound.isPlaying()) {
        mySound.play();
        playButton.html('playing');
        stopButton.html('stop');
        pauseButton.html('pause');
    }
}

function stopSound() {
    if (mySound.isPlaying()) {
        mySound.stop();
        stopButton.html('stopped');
        playButton.html('play');
    }
}

function pauseSound() {
    if (mySound.isPlaying()) {
        mySound.pause();
        pauseButton.html('paused');
        playButton.html('play');
    }
}

function selectSong() {
    // set mySound depending from radio value
    let val = radio.value();

    if (val == '476070') {
        fileName = songs[0];
        mySound = mySounds[0];
    } else if (val == '476072') {
        fileName = songs[1];
        mySound = mySounds[1];
    } else if (val == '487440') {
        fileName = songs[2];
        mySound = mySounds[2];
    }
    //console.log(fileName);
}

function skipStart() {
    // jump to zero position
    mySound.jump(0);
}

function skipEnd() {
    // jump to a 2 sec before end
    let dur = mySound.duration();
    let t = dur - 2;
    mySound.jump(t);
}

function loopOnOff() {
    // toggle looping of the sound
    if (mySound._looping) {
        mySound._looping = false;
        loopOnOffButton.html('loop on');
    } else {
        mySound._looping = true;
        loopOnOffButton.html('loop off');
    }
}

function draw() {
    // repaint the values of the paramters
    text(`volume (${sliderVolume.value()})`, 80, 120);
    text(`rate (${sliderRate.value()})`, 80, 165);
    text(`pan (${sliderPan.value()})`, 80, 210);
    // continuously set the volume, rate and pan from the sliders
    mySound.setVolume(sliderVolume.value());
    mySound.rate(sliderRate.value());
    mySound.pan(sliderPan.value());
    selectSong();
}