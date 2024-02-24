let localStream;
let remoteStream;
let peerConnection;

const localVideo = document.querySelector(".localVideo");
const remoteVideo = document.querySelector(".remoteVideo");

const stunServers = {
    iceServers:[
        {
            urls:['stun:stun.l.google.com:19302','stun:stun2.l.google.com:19302']
        }
    ]
};

// initialize localStream
const init = async () => {
 localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  localVideo.srcObject = localStream;
  await createOffer();
};

let createOffer = async () => {

    // get public ip address(ice candidate) from stun server to create an offer
  peerConnection = new RTCPeerConnection(stunServers);
  console.log(peerConnection);

  // setting remoteStream
  remoteStream = new MediaStream();
  remoteStream.srcObject = remoteStream;
 
// add local audio video etc tracks to peerConnection
localStream.getTracks().forEach((track)=>{
    peerConnection.addTrack(track,localStream)
})
// console.log(localStream)

// add tracks of remote peer in remoteStream 
peerConnection.ontrack=(event)=>{
    console.log(event)
    event.streams[0].getTracks((track)=>{
        remoteStream.addTrack(track)
    })
}
// setLocalDescription method will make series of request to stun server
//  and it will return lots of ice candidates later best one will be chosen by ICE
peerConnection.onicecandidate=(e)=>{
    if(e.candidate){
        console.log("new candidate",e.candidate)
        // now we can send these candidates and offer to the peer via signalling server
    }
}

//   create offer and set to localDescription so that we also know about our ip address
  let offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer)
  console.log("offer",offer);

  
};

init();
