import { useEffect, useRef, useState } from 'react';
import Contact from './components/Contact';
import Navbar from './components/Navbar';
import VideoBox from './components/VideoBox';
import { io } from 'socket.io-client';
import Peer, { SignalData } from 'simple-peer'
import './styles/App.scss';
import AddName from './components/AddName';
const SERVER_URL = process.env.REACT_APP_SERVER_URL || ""


const socket = io(SERVER_URL)

function App() {
  const [name,setName] = useState("")
  const [addName,setAddName] = useState(true)
  const [stream,setStream] = useState<MediaStream>()
  const [userId,setUserId] = useState("")

  const [callerId,setCallerId] = useState("")
  const [callerName,setCallerName] = useState("")
  const [callerSignal,setCallerSignal] = useState<string | SignalData>("")

  
  const [callStatus,setCallStatus] = useState<"off" | "on" | "calling" | "receiving">("off")
  
  
  const callerVideo = useRef<HTMLVideoElement>(null)
  const connectionRef = useRef<Peer.Instance>();

  useEffect(()=>{
    name === '' ? setAddName(true) : setAddName(false)
  },[name])

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

    
    socket.on('callAccepted',data=>{
      setCallStatus('on')
      setCallerName(data.receiverName) 
      peer.signal(data.signal)

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
      socket.emit('answerCall',{signal:signal,to:callerId,receiverName:name})
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
   <div className={addName ? "container black":"container"} >
    {!addName ? (<>
    
    <Navbar />
    <div className="callContainer">
       <VideoBox 
           stream={stream}
           setStream={setStream}
           callerVideo={callerVideo}
           callStatus={callStatus}
           name={name}
           callerName={callerName} />
           
       <Contact 
           name={name}
           callStatus={callStatus}
           userId={userId}
           setCallStatus={setCallStatus}
          
           callUser={callUser}
           answerCall = {answerCall}
           leaveCall = {leaveCall}
           callerName={callerName}
            />
    </div>
    </>):("")}
    {addName ? 
        <AddName setName={setName} />
        : ""}
   </div>
  );
}

export default App;
