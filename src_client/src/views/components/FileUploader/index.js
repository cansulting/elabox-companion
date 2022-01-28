import React, { useState, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import { Button } from "reactstrap";
import backend from "../../../api/backend";


const FileUploader = props => {  
  const hiddenFileInput = React.useRef(null);
  const [isImported, setImported] = useState(false);
  const [status, setStatus] = useState(null);

  if (isImported){
    return <Redirect to="/login" />
  } 

  
  const handleFile = event => {
    const form = document.getElementById("myForm");
    const formData = new FormData(form);
    backend.importKeystore(formData).then(response => {
        if (response.status === 200 ) {
            setImported(true)
        } else {
            console.log("Invalid keystore file.")
            setStatus("Invalid keystore file.")
        }

    })
      };


  const handleClick = event => {
    hiddenFileInput.current.click();
  };  

  const handleChange = event => {
    const fileUploaded = event.target.files[0];
    handleFile(fileUploaded);
  };  
  
  
  return (
    <>
      <h2>{status}</h2>

    <form id="myForm">

      <Button onClick={handleClick}>
        Import Existing Keystore
      </Button>
      <input
        type="file"
        name="keystore"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{display: 'none'}}
      />

    </form>


    </>
  );
}

export default FileUploader