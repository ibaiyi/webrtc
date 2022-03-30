var socket = io();

var clientPeerId = "";

//init localVideo
var config = {
    host: location.hostname,
    port: 9000,
    path: '/dccserver',
    secure: false
};


// let userList = [];
var peer;
socket.on("connect", () => {
    clientPeerId = socket.id
    console.log(`本地连接初始化完成，连接id:${socket.id}`);
    peer = new Peer(clientPeerId, config);
    peer.on('open', function(id) {
        console.log('My peer ID is: ' + id);
    });
});

socket.on('getPatientList', (msg) => {
    console.log('当前患者列表: ' + msg);


});
// socket.emit('getPatients', 'txt');

var btnCheckin = document.getElementById('btnCheckin');
btnCheckin.addEventListener('click', () => {
    console.log('医生上线');
    socket.emit('doctorCheckIn', {
        doctorId: clientPeerId,
        doctorName: '张三'
    });
});

function test() {
    var localVideo = document.getElementById('localVideo');
    var remoteVideo = document.getElementById('remoteVideo');

    var peerId = document.getElementById('patientId').value;
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    getUserMedia({ video: true, audio: true }, function(stream) {
        localVideo.srcObject = stream;
        var conn = peer.connect(peerId);
        var call = peer.call(peerId, stream);
        call.on('stream', function(remoteStream) {
            // Show stream in some video/canvas element.
            remoteVideo.srcObject = remoteStream;
        });
    }, function(err) {
        console.log('Failed to get local stream', err);
    });
}