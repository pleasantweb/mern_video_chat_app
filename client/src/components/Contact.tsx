import React, { useState } from "react";

type propType = {
  name:string
  callStatus: "off" | "on" | "calling"| "receiving";
  userId: string;
  setCallStatus: React.Dispatch<React.SetStateAction<"off" | "on" | "calling" | "receiving">>;
  
  callUser:(id: string) => void,
  answerCall: () => void,
  leaveCall:()=>void,
  callerName:string
};

const Contact = (props: propType) => {
  const { name,callStatus, userId, setCallStatus,callUser,answerCall,callerName,leaveCall } = props;

  const [idToCall, setIdToCall] = useState("");


  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCallStatus("calling")
    callUser(idToCall)
  };
  return (
    <section className="contact">
      <h1 className="username">{name}</h1>
      <button
        className="copybtn"
        onClick={() => navigator.clipboard.writeText(userId)}
      >
        Copy Calling ID
      </button>
      <div className="callProcess">
        {callStatus === 'receiving' ? (
          <div>
            <h1>Recieving Call</h1>
            <p>{callerName} is calling...</p>
            <button className="receiveCall" onClick={answerCall}>Answer</button>
          </div>
        ) : callStatus === "off" ? (
          <form action="" onSubmit={onSubmit}>
            <h4>Enter User ID to Call</h4>
            <input
              placeholder="Enter User id..."
              type="text"
              value={idToCall}
              onChange={(e) => setIdToCall(e.target.value)}
            />
            <input type="submit" value="Call" />
          </form>
        ) : callStatus === "calling" ? (
          <h1 className="calling">Calling...</h1>
        ) : (
          <button className="endCall" onClick={leaveCall}>End Call</button>
        )}
      </div>
    </section>
  );
};

export default Contact;
