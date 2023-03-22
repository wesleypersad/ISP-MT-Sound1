//
// this is the code for the DSP midterm 2022
//
let playButton;
let stopButton;
let pauseButton;
let sliderVolume;
let sliderVolumeVal; // master output
let skipStartButton;
let skipEndButton;
let loopOnOffButton;
let recordButton;

// define name and path of sound files
let fileName = './sounds/kiplingOut.wav';
let saveName = 'recording.wav';

// create variable for sound object
let mySound;

// variables for live sound and recording
let mic;
let recorder;
let soundFile;
// states are : 0 no soundfile, 1 recording to soundfile , 2 soundfile available 
let state = 0;

// variable for sound source i.e from mySound file or live mic
let soundSource;

// for the low pass filter, its sliders and inputs
let filter;
let filterType;
let filterFreq;
let filterFreqVal;
let filterRes;
let filterResVal;
let filterDrywet;
let filterDrywetVal;
let filterAmp;
let filterAmpVal;

// waveshape distortion, its sliders and inputs
let distort;
let distortDrywet;
let distortDrywetVal;
let distortAmp;
let distortAmpVal;
let distortAmount;
let distortAmountVal;
let distortOvrsam;

// for the dynamic compressor, its sliders and inputs
let comp;
let compAttack;
let compAttackVal;
let compKnee;
let compKneeVal;
let compRelease;
let compReleaseVal;
let compRatio;
let compRatioVal;
let compThold;
let compTholdVal;
let compDrywet;
let compDrywetVal;
let compAmp;
let compAmpVal;

// for the reverb objects, its sliders and inputs
let reverb;
let revTime;
let revTimeVal;
let revDecay;
let revDecayVal;
let revDrywet;
let revDrywetVal;
let revAmp;
let revAmpVal;
let revRevButton;
let revRevVal = false;

// gain for the master volume
let gain;

// create fft objects to analyse the output sound
let fftin;
let fftout;

function preload()
{   
    soundFormats('mp3','wav');

    // file used to playback & save recording
    soundFile   = new p5.SoundFile();

    // load the sound file from the song and set its volume to the maximum
    // disconnect so we'll only hear hear the output from overall system
    mySound = loadSound(fileName);
    mySound.setVolume(1.0);
    mySound.disconnect();

    // set up low pass filter to pass through from sound input and disconnect
    filter = new p5.Filter();
    filter.process(mySound);
    filter.drywet(0.0);
    filter.disconnect();

    // set up a distortion object to pass through from filter and disconnect
    distort = new p5.Distortion();
    distort.process(filter);
    distort.drywet(0.0);
    distort.disconnect();

    // set up the compressor to pass through from distorion and disconnect
    comp = new p5.Compressor();
    comp.process(distort);
    comp.drywet(0.0);
    comp.disconnect();

    // set up reverb to only pass through from compressor and disconnect
    reverb = new p5.Reverb();
    reverb.process(comp);
    reverb.drywet(0.0);
    reverb.disconnect();

    // set up the gain object for master volume and connect to output
    gain = new p5.Gain();
    gain.setInput(reverb);
    gain.connect();
}

function setup()
{
    createCanvas(1000, 580);
    background(180);

    // buttons
    playButton = createButton('play');
    playButton.position(10, 20);
    playButton.mousePressed(playSound);

    stopButton = createButton('stop');
    stopButton.position(70, 20);
    stopButton.mousePressed(stopSound);

    pauseButton = createButton('pause');
    pauseButton.position(130, 20);
    pauseButton.mousePressed(pauseSound);

    skipStartButton = createButton('skip to start');
    skipStartButton.position(190, 20);
    skipStartButton.mousePressed(skipStart);

    skipEndButton = createButton('skip to end');
    skipEndButton.position(290, 20);
    skipEndButton.mousePressed(skipEnd);

    loopOnOffButton = createButton('loop on');
    loopOnOffButton.position(390, 20);
    loopOnOffButton.mousePressed(loopOnOff);

    recordButton = createButton('record');
    recordButton.position(490, 20);
    recordButton.mousePressed(recordSound);

    // for sound recording and mic set up and enabling
    mic = new p5.AudioIn();
    mic.start();

    // create a sound recorder object and connect to mic
    recorder = new p5.SoundRecorder();
    recorder.setInput(mic);

    // create and display radio selection for sound source
    rect(10, 60, 380, 40);
    text('source:', 20, 80);
    text(fileName, 200, 80);

    soundSource = createRadio();
    soundSource.position(70, 70);
    soundSource.option('file');
    soundSource.option('mic');
    soundSource.value('file');

    // filter parameters
    rect(10, 130, 380, 170);
    text('filter:', 20, 150);
    filterType = createRadio();
    filterType.position(60, 135);
    filterType.option('lowpass');
    filterType.option('highpass');
    filterType.option('bandpass');
    filterType.value('lowpass');

    filterFreqVal = createInput();
    filterFreqVal.position(20, 180);
    filterFreq = createSlider(10, 22050, 22050, 0.0);
    filterFreq.position(20, 210);

    filterResVal = createInput();
    filterResVal.position(200, 180);
    filterRes = createSlider(0.001, 1000, 0.001, 0.0);
    filterRes.position(200, 210);

    filterDrywetVal = createInput();
    filterDrywetVal.position(20, 240);
    filterDrywet = createSlider(0.0, 1.0, 0.0, 0.1);
    filterDrywet.position(20, 270);

    filterAmpVal = createInput();
    filterAmpVal.position(200, 240);
    filterAmp = createSlider(0.0, 1.0, 1.0, 0.1);
    filterAmp.position(200, 270);

    // distortion parameters
    rect(400, 350, 380, 150);
    text('waveshaper distortion', 410, 370);
    distortAmountVal = createInput();
    distortAmountVal.position(410, 380);
    distortAmount = createSlider(0.0, 1.0, 0.0, 0.1);
    distortAmount.position(410, 410);

    distortOvrsam = createRadio();
    distortOvrsam.position(590, 380);
    distortOvrsam.option('none');
    distortOvrsam.option('2x');
    distortOvrsam.option('4x');
    distortOvrsam.value('none');

    distortDrywetVal = createInput();
    distortDrywetVal.position(410, 440);
    distortDrywet = createSlider(0.0, 1.0, 0.0, 0.1);
    distortDrywet.position(410, 470);

    distortAmpVal = createInput();
    distortAmpVal.position(590, 440);
    distortAmp = createSlider(0.0, 1.0, 1.0, 0.1);
    distortAmp.position(590, 470);

    // dynamic compressor parameters
    rect(400, 130, 550, 210);
    text('dynamic compressor', 410, 150);
    compAttackVal = createInput();
    compAttackVal.position(410, 160);
    compAttack = createSlider(0, 1, 0.003, 0.0);
    compAttack.position(410, 190);

    compKneeVal = createInput();
    compKneeVal.position(590, 160);
    compKnee = createSlider(0, 40, 30, 0.5);
    compKnee.position(590, 190);

    compReleaseVal = createInput();
    compReleaseVal.position(770, 160);
    compRelease = createSlider(0, 1, 0.25, 0.0);
    compRelease.position(770, 190);

    compRatioVal = createInput();
    compRatioVal.position(410, 220);
    compRatio = createSlider(0, 20, 12, 0.0);
    compRatio.position(410, 250);

    compTholdVal = createInput();
    compTholdVal.position(590, 220);
    compThold = createSlider(-100, 0, -24, 1);
    compThold.position(590, 250);

    compDrywetVal = createInput();
    compDrywetVal.position(410, 280);
    compDrywet = createSlider(0.0, 1.0, 0.0, 0.1);
    compDrywet.position(410, 310);

    compAmpVal = createInput();
    compAmpVal.position(590, 280);
    compAmp = createSlider(0.0, 1.0, 1.0, 0.1);
    compAmp.position(590, 310);

    // reverb parameters, reverb time(seconds) & decay rate (%)
    rect(10, 350, 380, 190);
    text('reverb', 20, 370);
    revTimeVal = createInput();
    revTimeVal.position(200, 380);
    revTime = createSlider(0, 10, 5);
    revTime.position(200, 410);

    revDecayVal = createInput();
    revDecayVal.position(20, 380);
    revDecay = createSlider(0, 100, 2);
    revDecay.position(20, 410);

    revRevButton = createButton('reverb backwards');
    revRevButton.position(20, 440);
    revRevButton.mousePressed(toggleRev);

    revDrywetVal = createInput();
    revDrywetVal.position(20, 480);
    revDrywet = createSlider(0.0, 1.0, 0.0, 0.1);
    revDrywet.position(20, 510);

    revAmpVal = createInput();
    revAmpVal.position(200, 480);    
    revAmp = createSlider(0.0, 1.0, 1.0, 0.1);
    revAmp.position(200, 510);

    // set the master volume
    rect(750, 20, 200, 70);
    sliderVolume = createSlider(0, 1, 1.0, 0.01);
    sliderVolume.position(760, 60);
    sliderVolumeVal = createInput();
    sliderVolumeVal.position(760, 30);

    // define the fft objects
    fftin = new p5.FFT(0.2);
    fftin.setInput(mySound);
    fftout = new p5.FFT(0.2);
    fftout.setInput(gain);
}

function draw()
{   
    // check for changes in the soundsource
    setSoundSource();

    // continually display and set output value from slider
    gain.amp(sliderVolume.value());
    sliderVolumeVal.value('master volume: ' + sliderVolume.value());

    // update filter parameters values for display & sound in object
    filterDrywetVal.value('drywet (0-1)        : ' + filterDrywet.value());
    filterAmpVal.value('amp (0-1)           : ' + filterAmp.value());
    filterFreqVal.value('freq (10-22050 Hz) : ' + filterFreq.value());
    filterResVal.value('res (.001-1000 Hz) : ' + filterRes.value());
    filter.setType(filterType.value());
    filter.freq(filterFreq.value());
    filter.drywet(filterDrywet.value());
    filter.amp(filterAmp.value());
    filter.res(filterRes.value());

    //update reverb parameters for display & in sound object
    revTimeVal.value('reverb time (sec) : ' + revTime.value());
    revDecayVal.value('decay Rate (%)   : ' + revDecay.value());
    revDrywetVal.value('drywet (0-1)        : ' + revDrywet.value());
    revAmpVal.value('amp (0-1)           :' + revAmp.value());
    // there is a memory leak issue with reverb
    //reverb.set(revTime.value(), revDecay.value(), revRevVal);
    reverb.drywet(revDrywet.value());
    reverb.amp(revAmp.value());

    // update distortion parmeters for display & in sound object
    distortAmountVal.value('amount (0-1)        : ' + distort.getAmount());
    distortDrywetVal.value('drywet (0-1)        : ' + distortDrywet.value());
    distortAmpVal.value('amp (0-1)           : ' + distortAmp.value());
    distort.set(amount=distortAmount.value(), oversample=distortOvrsam.value());
    distort.drywet(distortDrywet.value());
    distort.amp(distortAmp.value());

    // update dynamic compressor for display & in sound object
    compAttackVal.value('attack (0-1)        : ' + compAttack.value());
    compKneeVal.value('knee (0-40)        : ' + compKnee.value());
    compReleaseVal.value('release (0-1)        : ' + compRelease.value());
    compRatioVal.value('ratio (0-20)        : ' + compRatio.value());
    compTholdVal.value('threshold (-100-0)        : ' + compThold.value());
    compDrywetVal.value('drywet (0-1)        : ' + compDrywet.value());
    compAmpVal.value('amp (0-1)           : ' + compAmp.value());
    comp.set(compAttack.value(), compKnee.value(), compRatio.value(), compThold.value(), compRelease.value());
    comp.drywet(compDrywet.value());
    comp.amp(compAmp.value());

    // continuously analyse the sound
    // evaluate and plot the input spectrum
    let spectrum = fftin.analyze();
    plotSpectrum(spectrum, width*4/5, height*3/5, 'spectrum in');

    // evaluate and plot the output analysis
    spectrum = fftout.analyze();
    plotSpectrum(spectrum, width*4/5, height*4/5, 'spectrum out');

    // check sound file is no longer playing but not paused
    if (!mySound.isPlaying() && !mySound.isPaused()) {
        playButton.html('play');
    }
}

function setSoundSource() {
    // set filter source and fft input as required
    if (soundSource.value() == 'mic') {
        mySound.stop();
        mySound.disconnect();
        filter.process(mic);
        fftin.setInput(mic);
    } else {
        mic.disconnect();
        filter.process(mySound);
        fftin.setInput(mySound);
    }
}

function plotSpectrum(spectrum, xpos, ypos, title) {
    // this function will plot the amplitudes in a FFT spectrum
    // with a given title at a specified location on the screen
    push();
    translate(xpos, ypos);
    scale(0.18, 0.18);
    noStroke();
    fill(60);
    rect(0, 0, width, height);
    fill(255);
    textSize(80);
    text(title, 500, 100);
    fill(255, 0, 255);
    for (let i = 0; i< spectrum.length; i++){
        let x = map(i, 0, spectrum.length, 0, width);
        let h = -height + map(spectrum[i], 0, 255, height, 0);
        rect(x, height, width / spectrum.length, h )
    }
    pop();
}

function toggleRev() {
    revRevVal = !revRevVal;
    if (revRevVal) {
        revRevButton.html('reverb forwards');
    } else {
        revRevButton.html('reverb backwards');
    }
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

function recordSound() {
    // ensure audio is enabled
    userStartAudio();

    // record sound from the microphone
    console.log("Record Button Pressed");

    // make sure user enable the mic
    if (state === 0 && mic.enabled) {
        // record to soundfile and change button
        recorder.record(soundFile);
        recordButton.html('Recording - Press to Stop');
        state++;

    } else if (state === 1) {
       // stop the recorder and send results to soundfile
        recorder.stop();
        recordButton.html('Saving File - Press to Play');
        state++;

    } else if (state === 2) {
        // play result and save file
        soundFile.play();
        recordButton.html('Playing & Saving - Press to Record');
        soundFile.save(saveName);
        // set state back so sound can be re-recorded and saved
        state = 0;
    }
}