import React, { useState, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import { Button } from "reactstrap";
import backend from "../../../api/backend";


const FileUploader = props => {  
  const hiddenFileInput = React.useRef(null);

  const handleClick = event => {
    hiddenFileInput.current.click();
  };  

  const handleChange = event => {
    const fileUploaded = event.target.files[0];
    if (fileUploaded.name.endsWith("dat")){
      props.onImportedClick(true)
    } else{
      alert("Invalid keystore file type")
    }

  };  
  
  
  return (
    <>
      <h2>{props.status}</h2>

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