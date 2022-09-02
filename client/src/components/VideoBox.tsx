import { useEffect, useRef } from "react";

type propType = {
  stream: MediaStream | undefined;
  setStream:React.Dispatch<React.SetStateAction<MediaStream | undefined>>
  callerVideo:React.RefObject<HTMLVideoElement>;
  callStatus:"off" | "on" | "calling" | "receiving"
  name:string,
  callerName:string
};

const VideoBox = (props: propType) => {
  const { stream,callerVideo,callStatus,setStream,name,callerName } = props;
  const myVideo = useRef<HTMLVideoElement>(null)

  useEffect(()=>{
    
    navigator.mediaDevices.getUserMedia({video:true,audio:true})
    .then(stream=>{
      setStream(stream)
      if(myVideo.current){
        myVideo.current.srcObject = stream
      }
    })
  
  },[setStream])

  return (
    <section className="videoBox">
      {stream ? (
        <div className="video">

        <video
          ref={myVideo}
          autoPlay
          playsInline
          className="screen yourScreen"
          style={{width:"330px"}}
        />

        <div className="name"><span></span> {name}</div>
        </div>
      ) : (
        <div className="noVideo"></div>
      )}
   { callStatus === 'on' ?(
    <div className="video">
       <video 
           className="screen callerScreen"
           ref={callerVideo}
           autoPlay
           style={{width:"330px"}}
          playsInline
           />
           <div className="name"><span></span> {callerName}</div>
           </div>
   ):(<div className="noVideo">
    <div className="plusSign">&#x2b;</div>
   </div>)}
     
    </section>
  );
};

export default VideoBox;
