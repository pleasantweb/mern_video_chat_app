import { useEffect, useRef, useState } from 'react';
import Contact from './components/Contact';
import Navbar from './components/Navbar';
import VideoBox from './components/VideoBox';
import { io } from 'socket.io-client';
import Peer, { SignalData } from 'simple-peer'
import './styles/App.scss';
const SERVER_URL = process.env.REACT_APP_SERVER_URL || ""


const socket = io(SERVER_URL)

function App() {
  const [name,setName] = useState("vish")
  const [stream,setStream] = useState<MediaStream>()
  const [userId,setUserId] = useState("")

  const [callerId,setCallerId] = useState("")
  const [callerName,setCallerName] = useState("")
  const [callerSignal,setCallerSignal] = useState<string | SignalData>("")

  
  const [callStatus,setCallStatus] = useState<"off" | "on" | "calling" | "receiving">("off")
  
  const myVideo = useRef<HTMLVideoElement>(null)
  const callerVideo = useRef<HTMLVideoElement>(null)
  const connectionRef = useRef<Peer.Instance>();


  useEffect(()=>{
    socket.on('me',(id)=>{
      setUserId(id)
    })
    socket.on('callUser',(data)=>{
       setCallStatus("receiving")
       setCallerId(data.from)
       setCallerName(data.name)
       setCallerSignal(data.signal)
    })

    socket.on('callEnded',()=>{
      setCallStatus('off')
      connectionRef.current?.destroy()
      cancelSockets()
      
    })

    return ()=>{
      socket.off('me')
      socket.off('callUser')
      socket.off('callEnded')
    }
  },[])

  useEffect(()=>{
    navigator.mediaDevices.getUserMedia({video:true,audio:true})
    .then(stream=>{
      setStream(stream)
      if(myVideo.current){
        myVideo.current.srcObject = stream
      }
    })
  },[])

  const cancelSockets = ()=>{
    socket.off('callAccepted')
      socket.off('endCall')
      socket.off('answerCall')
  }

  const callUser = (id:string)=>{

    const peer = new Peer({
      initiator:true,
      trickle:false,
      stream:stream
    })
    peer.on('signal',signal=>{
      socket.emit('callUser',{
        userToCall:id,
        signalData:signal,
        from:userId,
        name:name
      })
    })

    peer.on('stream',stream=>{
      const callerVd = callerVideo.current
      if(callerVd){
        callerVd.srcObject = stream
      }
    })

    
    socket.on('callAccepted',signal=>{
      setCallStatus('on')
       peer.signal(signal)
    })

     
    connectionRef.current = peer;
  }

  const answerCall = ()=>{
    setCallStatus('on')
    const peer = new Peer({
      initiator:false,
      trickle:false,
      stream:stream
    })
    peer.on('signal',signal=>{
      socket.emit('answerCall',{signal:signal,to:callerId})
    })
    
    peer.on("stream",stream=>{
      const callerVd = callerVideo.current
      if(callerVd){
        callerVd.srcObject = stream
      }
    })
    
    peer.signal(callerSignal)
    connectionRef.current = peer;
  }

  

  const leaveCall = () => {
    setCallStatus('off');
    socket.emit('endCall',callerId)
    
  };
 

  return (
   <div className="container">
    <Navbar />
    <div className="callContainer">
       <VideoBox 
           stream={stream}
           myVideo={myVideo}
           callerVideo={callerVideo}
           callStatus={callStatus} />
       <Contact 
           callStatus={callStatus}
           userId={userId}
           setCallStatus={setCallStatus}
          
           callUser={callUser}
           answerCall = {answerCall}
           leaveCall = {leaveCall}
           callerName={callerName}
            />
    </div>
        
   </div>
  );
}

export default App;
