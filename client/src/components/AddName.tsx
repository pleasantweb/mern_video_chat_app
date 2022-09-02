import React, { useState } from "react"

type propType ={
   
    setName:React.Dispatch<React.SetStateAction<string>>
}

const AddName = (props:propType) => {
    const {setName} = props
    const [username,setUserName] = useState("")
    const onsubmit=(e:React.FormEvent<HTMLFormElement>)=>{
     e.preventDefault()
     setName(username)
    }
  return (
    <section className='addName'>
        <div className="addNameform">
        <form action="" onSubmit={onsubmit}>
            <h2>Enter your name to continue</h2>
            <input autoFocus type="text" placeholder='Enter your name...' value={username} onChange={e=>setUserName(e.target.value)} />
            <input type="submit" value="Save" />
        </form>
        </div>
        
    </section>
  )
}

export default AddName