// vvv Oscillator prototype
export function OscillatorI(waveform, attack, decay, sustain, release, enabled) {
    this.ctx;
    this.osc;
    this.gainNode;
    this.waveform = waveform;
    this.playing = false;//button press indicator

    this.enabled = enabled;//mute or not
    this.soloVolume = 1;//volume of current osc
    this.detune = 0;

    this.envelope = {
        'attack': attack,
        'decay': decay,
        'sustain': sustain,
        'release': release,
        'monotransition': 0.01
    }
}

//Connect osc
OscillatorI.prototype.connect = function(ctx, destination){
    this.ctx = ctx;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = 0;

    this.osc = this.ctx.createOscillator();
    this.osc.type = this.waveform;
    this.osc.frequency.value = 0;

    this.osc.start();
    //reset
    this.osc.disconnect();
    this.gainNode.disconnect();

    this.osc.connect(this.gainNode); 
    this.gainNode.connect(destination);
}

//Start osc sound
OscillatorI.prototype.startSound = function(freq, velocity /*converted values*/){
    if (this.playing === true)
        this.osc.frequency.setTargetAtTime(freq, this.ctx.currentTime, this.envelope.monotransition);
    else
        this.osc.frequency.value = freq;
    //attack
    this.gainNode.gain.setTargetAtTime(velocity, this.ctx.currentTime, this.envelope.attack);
    /*
    let calcSust = velocity * this.envelope.sustain;
    //decay //still works not ok, needs reworking
    let t = setTimeout( () => {
        if (this.playing == true)
            this.gainNode.gain.setTargetAtTime(calcSust, this.ctx.currentTime, this.envelope.decay);
    }, ((this.envelope.attack.toFixed(3) * 1000)*5));//?
    */
}

//Stop osc sound
OscillatorI.prototype.stopSound = function(){
    this.gainNode.gain.setTargetAtTime(0, this.ctx.currentTime, this.envelope.release);
}
// ^^^ Oscillator Prototype
