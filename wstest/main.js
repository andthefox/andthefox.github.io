class WebSocketWorker {
    testJSON(text) {
        if (typeof text !== "string") {
            return false;
        }
        try {
            JSON.parse(text);
            return true;
        } catch (error) {
            return false;
        }
    }

    requestData(n, id = "") {
        this.waitingForData = true;
        let data = JSON.stringify({
            type: 'data_request',
            name: n,
            id: id
        });
        if (this.socket != undefined) this.socket.send(data);
        console.log('Data requested:', data)
    };
    ///
    sendData(data) {
        if (this.socket != undefined) this.socket.send(data);
        //console.log('Data sent:', data)
    };

    constructor(addr, port, secure = true) {
        ///
        this.socket = new WebSocket(`${secure ? 'wss' : 'ws'}://${addr}:${port}`);
        this.waitingForData = false;
        this.data = undefined;

        this.socket.onopen = function (e) {
            console.log("[open]");
        };
        var _this = this;
        this.socket.onmessage = function (e) {
            try {
                if (_this.testJSON(e.data)) {
                    //
                    let parsed = JSON.parse(e.data);
                    console.log('data is json');
                    console.log('data:', e.data);
                } else {
                    const audioelement = document.createElement("audio");
                    const url = window.URL.createObjectURL(new Blob([e.data], { type: "audio/webm;codecs=opus" }));
                    audioelement.src = url;
                    audioelement.play();
                    audioelement.addEventListener('ended', (_) => {
                        window.URL.revokeObjectURL(url);
                    });
                }
            }
            catch (err) {
                console.log(err)
            }
        };
        /// do on socket closing
        this.socket.onclose = function (e) {
            if (e.wasClean) {
                console.log(`[close]=${e.code},${e.reason}`);
            } else {
                console.log('[close]');
            }
        };
        /// do on error
        this.socket.onerror = function (error) {
            console.log(`[error] ${error.message}`);
        };
        ///
    };
}

var addr = 'localhost'; //'localhost';
const port = '8080';
const timeslice = 200;

var audiobuffer = [];

var socketworker;
/*SOCKETS*/


const btn = document.getElementById("start");
const address = document.getElementById("address");

btn.addEventListener('click', () => {
    addr = address.value;

    socketworker = new WebSocketWorker(addr, port, true);
    socketworker.socket.binaryType = "arraybuffer";

    navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(function onSuccess(stream) {
            const recorder = new MediaRecorder(stream);//

            recorder.ondataavailable = (e) => {
                if (socketworker.socket.readyState == 1) {
                    /*let rec_data = [];
                    rec_data.push(e.data);*/
                    socketworker.sendData(e.data);
                } else {
                    recorder.stop();
                }

            };
            recorder.start(/*timeslice*/);
            recorder.onerror = (e) => {
                throw e.error || new Error(e.name);
            };
            recorder.onstop = (e) => {
                //const audio = document.createElement("audio");
                //audio.src = window.URL.createObjectURL(new Blob(data));
            };

            setInterval((event) => {
                recorder.stop();
                recorder.start();
            }, timeslice);

        }).catch(function onError(error) {
            console.log(error.message);
        });

})
