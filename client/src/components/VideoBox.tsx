type propType = {
  stream: MediaStream | undefined;
  myVideo: React.RefObject<HTMLVideoElement>;
  callerVideo:React.RefObject<HTMLVideoElement>;
  callStatus:"off" | "on" | "calling" | "receiving"
};

const VideoBox = (props: propType) => {
  const { stream, myVideo,callerVideo,callStatus } = props;

  return (
    <section className="videoBox">
      {stream ? (
        <video
          ref={myVideo}
          autoPlay
          playsInline
          className="screen yourScreen"
          // style={{width:"200px",height:"500px"}}
         
        />
      ) : (
        <div className="noVideo"></div>
      )}
   { callStatus === 'on' ?(
       <video 
           className="screen callerScreen"
           ref={callerVideo}
           autoPlay
          playsInline
           />
   ):(<div className="noVideo"></div>)}
     
    </section>
  );
};

export default VideoBox;
