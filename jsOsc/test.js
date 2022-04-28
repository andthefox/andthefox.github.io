import {OscillatorI} from './modules/oscillator.js';

{
    const waveforms = [
        "sine",
        "square",
        "sawtooth",
        "triangle"
    ];

    var audioCtx = null;
    var masterGain;
    var midiNote;

    //knobs:
    //i: 0-2, 0-2, 0-1, 0-2.
    //i = knob/100*i_max

    let midi = new Midi();//midi init

    let osc1;
    let osc2;
    let osc3;

    let checkI;

    document.querySelector("#connect").addEventListener('click', () => {
        if(audioCtx == null) {
            //initialization
            osc1 = new OscillatorI('sine', 1, 1, 0.5, 1, true);//osc init
            osc2 = new OscillatorI('square', 1, 1, 0.5, 1, false);//osc init
            osc3 = new OscillatorI('triangle', 1, 1, 0.5, 1, false);//osc init
            //main context
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            //master gain
            masterGain = audioCtx.createGain();
            masterGain.gain.value = 0.7;
            //connecting
            masterGain.connect(audioCtx.destination);
            //ctx ~> this.osc -> this.gainNode -> || effects -> master gain || -> ctx.destination
            osc1.connect(audioCtx, masterGain); osc2.connect(audioCtx, masterGain); osc3.connect(audioCtx, masterGain);

            //display values for debug
            checkI = setInterval(() => {
                document.querySelector("#data").innerHTML = osc1.gainNode.gain.value.toFixed(2) + '|' + osc2.gainNode.gain.value.toFixed(2) + '|' + osc3.gainNode.gain.value.toFixed(2) + '|'+ audioCtx.currentTime.toFixed(1);
                //console.log(osc1.gainNode.gain.value.toFixed(2));
                //if (~~audioCtx.currentTime == 1) console.log(osc1.gainNode.gain.value.toFixed(2));
            }, 100);
        }
        else {
            //osc1.disconnect(masterGain); osc2.disconnect(masterGain); osc3.disconnect(masterGain);
            osc1 = null;
            osc2 = null;
            osc3 = null;
            masterGain.disconnect(audioCtx.destination);
            masterGain = null;
            audioCtx = null;
            clearInterval(checkI);
            document.querySelector("#data").innerHTML = '';
        }
    });

    //INTERFACE

    //TOGGLE
    function toggleOsc(e){
        let id = e.target.value;
        let ch = e.target.checked;
        if(audioCtx == null) return;
        switch(id){
            case '1':
                osc1.enabled = ch;
                break;
            case '2':
                osc2.enabled = ch;
                break;
            case '3':
                osc3.enabled = ch;
                break;
            default:
                console.log(id)
                break;
        }
    }

    let osc_tog = document.getElementsByClassName('osc_toggle');
    for (let element of osc_tog) {
        element.addEventListener('input', toggleOsc, false);
    }

    //VOLUME
    function oscVolume(e){
        let id = e.target.parentElement.getAttribute("id");
        let ch = e.target.value/100;
        if(audioCtx == null) return;
        switch(id){
            case 'osc1':
                osc1.soloVolume = ch;
                break;
            case 'osc2':
                osc2.soloVolume = ch;
                break;
            case 'osc3':
                osc3.soloVolume = ch;
                break;
            default:
                console.log(id)
                break;
        }
        console.log(id, ch)
    }
    
    let osc_vol = document.getElementsByClassName('osc_vol');
    for (let element of osc_vol) {
        element.addEventListener('input', oscVolume, false);
    }

    //WAVE
    function oscWave(e){
        let id = e.target.parentElement.getAttribute("id");
        let ch = e.target.value;
        
        let val = waveforms.indexOf(ch) + 1;
        if (val >= waveforms.length) val = 0;
        ch = waveforms[val];
        
        if(audioCtx == null) return;
        switch(id){
            case 'osc1':
                osc1.envelope.waveform = ch;
                osc1.osc.type = ch;
                break;
            case 'osc2':
                osc2.envelope.waveform = ch;
                osc2.osc.type = ch;
                break;
            case 'osc3':
                osc3.envelope.waveform = ch;
                osc3.osc.type = ch;
                break;
            default:
                console.log(id, ch)
                break;
        }
        e.target.value = ch;
        console.log(id, ch);
    }
    
    let osc_wf = document.getElementsByClassName('waveform');
    for (let element of osc_wf) {
        element.addEventListener('click', oscWave, false);
    }

    //ATTACK
    function oscAttack(e){
        let id = e.target.parentElement.parentElement.getAttribute("id");
        let ch = e.target.value;
        console.log(id, ch)
        if(audioCtx == null) return;
        switch(id){
            case 'osc1':
                osc1.envelope.attack = ch;
                break;
            case 'osc2':
                osc2.envelope.attack = ch;
                break;
            case 'osc3':
                osc3.envelope.attack = ch;
                break;
            default:
                console.log(id, ch)
                break;
        }
    }
    let osc_att = document.getElementsByClassName('osc_attack');
    for (let element of osc_att) {
        element.addEventListener('input', oscAttack, false);
    }

    //RELEASE
    function oscRelease(e){
        let id = e.target.parentElement.parentElement.getAttribute("id");
        let ch = e.target.value;
        console.log(id, ch)
        if(audioCtx == null) return;
        switch(id){
            case 'osc1':
                osc1.envelope.release = ch;
                break;
            case 'osc2':
                osc2.envelope.release = ch;
                break;
            case 'osc3':
                osc3.envelope.release = ch;
                break;
            default:
                console.log(id, ch)
                break;
        }
    }
    let osc_rel = document.getElementsByClassName('osc_release');
    for (let element of osc_rel) {
        element.addEventListener('input', oscRelease, false);
    }

    //KEYBOARD
    const keyValues = {
        //C3
        'KeyZ': 48,
        'KeyS': 49,
        'KeyX': 50,
        'KeyD': 51,
        'KeyC': 52,
        'KeyV': 53,
        'KeyG': 54,
        'KeyB': 55,
        'KeyH': 56,
        'KeyN': 57,
        'KeyJ': 58,
        'KeyM': 59,
        'Comma': 60,
        'keyL': 61,
        'Period': 62,
        'Semicolon': 63,
        'Slash': 64,

        //C4
        'KeyQ': 60,
        'Digit2': 61,
        'KeyW': 62,
        'Digit3': 63,
        'KeyE': 64,
        'KeyR': 65,
        'Digit5': 66,
        'KeyT': 67,
        'Digit6': 68,
        'KeyY': 69,
        'Digit7': 70,
        'KeyU': 71,
        'KeyI': 72,
        'Digit9': 73,
        'KeyO': 74,
        'Digit0': 75,
        'KeyP': 76,
        'BracketLeft': 77,
        'BracketRight': 78
    };

    addEvent(document, "keydown", function (e) {
        e = e || window.event;
        let key = e.code;
        let pitch = keyValues[key];
        console.log('keydown', key, pitch);

        if (e.repeat === false && pitch != undefined)
        {
            let velocity = 64;
            midNoteOn(pitch, velocity);
        }
    });

    addEvent(document, "keyup", function (e) {
        console.log('keyup');
        e = e || window.event;
        let key = e.code;
        let pitch = keyValues[key];
        midiNoteOff(pitch);
    });
    
    function addEvent(element, eventName, callback) {
        if (element.addEventListener) {
            element.addEventListener(eventName, callback, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + eventName, callback);
        } else {
            element["on" + eventName] = callback;
        }
    }

    //MIDI

    function Midi(){
        startMIDIInput();
    }

    Midi.prototype.noteToFreq = function(note) {
        let a = 440; //frequency of A
        return (a / 32) * (2 ** ((note - 9) / 12));
    }
    
    Midi.prototype.velocityToPercent = function(velocity) {
        return velocity / 127;
    }

    function midNoteOn(pitch, velocity) {
        //midiNoteOff(pitch);
        //var envelope = this.player.queueWaveTable(this.audioContext, this.audioContext.destination, this.tone, 0, pitch, 123456789, velocity / 100);
        midiNote = pitch;
        if (audioCtx != null)
        {
            osc1.playing = osc2.playing = osc3.playing = true;
            osc1.startSound(midi.noteToFreq(pitch + osc1.detune), midi.velocityToPercent(velocity)* osc1.enabled * osc1.soloVolume);
            osc2.startSound(midi.noteToFreq(pitch + osc2.detune), midi.velocityToPercent(velocity) * osc2.enabled * osc2.soloVolume);
            osc3.startSound(midi.noteToFreq(pitch + osc3.detune), midi.velocityToPercent(velocity) * osc3.enabled * osc3.soloVolume);
        }
        //midiNotes.push(note);
    }
    
    function midiNoteOff(pitch) {
        //midiNote = null;
        if (audioCtx != null)
        {
            if(pitch === midiNote)
            {
                osc1.playing = osc2.playing = osc3.playing = false;
                osc1.stopSound();
                osc2.stopSound();
                osc3.stopSound();
            }
        }
        /*midiNotes.forEach(function(value, index){
            if (value.pitch == pitch) {
                //if (midiNotes[i].envelope) {
                //  midiNotes[i].envelope.cancel();
                //}
                midiNotes.splice(index, 1);
                return;
            }
        });*/
    }
    
    function midiOnMIDImessage(event) {
        let data = event.data;
        //var cmd = data[0] >> 4;
        //var channel = data[0] & 0xf;
        let type = data[0] & 0xf0;
        let pitch = data[1];
        let velocity = data[2];
        //console.log(data);
        switch (type) {
            case 144:
            midNoteOn(pitch, velocity);
            break;
            case 128:
            midiNoteOff(pitch);
            break;
            default:
            break;
        }
    }
    
    function midiOnStateChange(event) {
        //console.log('midiOnStateChange', event);
        console.log(event.port.manufacturer + ' ' + event.port.name + ' ' + event.port.state);
    }
    
    function requestMIDIAccessSuccess(midi) {
        var inputs = midi.inputs.values();
        for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
            console.log('midi input', input);
            input.value.onmidimessage = midiOnMIDImessage;
        }
        midi.onstatechange = midiOnStateChange;
    }
    
    function requestMIDIAccessFailure(e) {
        console.log('requestMIDIAccessFailure', e);
    }
    
    function startMIDIInput() {
        if (navigator.requestMIDIAccess) {
            console.log('navigator.requestMIDIAccess ok');
            navigator.requestMIDIAccess().then(requestMIDIAccessSuccess, requestMIDIAccessFailure);
        } else {
            console.log('navigator.requestMIDIAccess undefined');
        }
    }
}