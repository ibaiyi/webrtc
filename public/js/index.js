var socket = io();

var clientPeerId = "";

//init localVideo
var config = {
    host: location.hostname,
    port: 9000,
    path: '/dccserver',
    secure: false
};


var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// let userList = [];
var peer;
socket.on("connect", () => {
    clientPeerId = socket.id
    console.log(`本地连接初始化完成，连接id:${socket.id}`);
    peer = new Peer(clientPeerId, config);
    peer.on('open', function(id) {
        console.log('My peer ID is: ' + id);
    });
    peer.on('call', function(call) {

        navigator.mediaDevices.getUserMedia({
                audio: false,
                video: true
            })
            .then(function(stream) {
                localVideo.srcObject = stream;
                call.answer(stream); // Answer the call with an A/V stream.
                call.on('stream', function(remoteStream) {
                    // Show stream in some video/canvas element.
                    remoteVideo.srcObject = remoteStream;
                });
            })
            .catch(function(e) {
                alert('getUserMedia() error: ' + e.name);
            });


        // getUserMedia({ video: true, audio: true }, function(stream) {
        //     localVideo.srcObject = stream;
        //     call.answer(stream); // Answer the call with an A/V stream.
        //     call.on('stream', function(remoteStream) {
        //         // Show stream in some video/canvas element.
        //         remoteVideo.srcObject = remoteStream;
        //     });
        // }, function(err) {
        //     console.log('Failed to get local stream', err);
        // });
    });
});


socket.on('userConnected', (msg) => {
    console.log('接收到userConnected: ' + msg.userIds);
});
// socket.emit('getPatients', 'txt');
socket.on('getPatientList', (msg) => {
    console.log('当前患者列表: ' + msg);


});

var btnCheckin = document.getElementById('btnCheckin');
btnCheckin.addEventListener('click', () => {
    socket.emit('patientCheckIn', clientPeerId, (res) => {
        console.log(res);

    });
});

// navigator.mediaDevices.getUserMedia({
//         audio: false,
//         video: true
//     })
//     .then(gotStream)
//     .catch(function(e) {
//         alert('getUserMedia() error: ' + e.name);
//     });