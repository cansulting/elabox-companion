import React, { useState, useEffect } from "react"
import API from "../../../api/backend"
// import NoUpdatesModal from "./modals/updates/no"
// import NewUpdatesModal from "./modals/updates/yes"
export default function Ota({children}) {
  const [status, setStatus] = useState("idle")
  const [currentVersionDetails, setCurrentVersionDetails] = useState("")
  const [latestVersionDetails, setLatestVersionDetails] = useState("")
  const [updatesCount,setUpdatesCount]=useState(0)
  useEffect(() => {
    const getDetails = async () => {
      const currentVersionDetails = await API.getVersionDetails("current")
      const latestVersionDetails = await API.getVersionDetails("latest")
      setCurrentVersionDetails(currentVersionDetails)
      setLatestVersionDetails(latestVersionDetails)
    }
    if (status === "idle") {
      getDetails()
    }
  }, [status])
  const handleCheckUpdates = async (dontShowNoModal=false) => {
    try {
      setStatus("checking")
      const checkUpdatesResponse = await API.checkUpdates()
      const thereIsNewUpdates = checkUpdatesResponse.new_update
      if (thereIsNewUpdates) {
        setUpdatesCount(checkUpdatesResponse.count)
        setStatus("new-download")
      } else {
        if(dontShowNoModal){
          resetStatus()          
          return;
        }
        setStatus("no-updates")
      }
    } catch (error) {
      resetStatus()
    }
  }
  const resetStatus = () => {
    setStatus("idle")
  }
  const handleUpdates = async () => {
    try {
      setStatus("updating")
      const isUpdateCompleted = await API.processUpdate()
      if (isUpdateCompleted) {
        setStatus("updated")
      } else {
        setStatus("not-updated")
      }
    } catch (error) {
      setStatus("not-updated")
    }
  }
  const handleDownloadPackage=async ()=>{
    try{
      setStatus("downloading")
      const isDownloaded = await API.processDownloadPackage()     
      if(isDownloaded){
        setStatus("new-updates")        
      } 
    }
    catch(error){
      resetStatus()
    }
  }
  const isLoading = !currentVersionDetails && !latestVersionDetails
  const isUpdated = status === "updated"
  const isUpdating = status === "updating"
  const noUpdates = status === "no-updates"
  const hasNewUpdates = status === "new-updates"
  const notUpdated = status === "not-updated"
  const checkingUpdates = status === "checking"
  const hasNewDownload=status==="new-download"
  const isDownloading=status==="downloading"
  // const showNewUpdatesModal =
  //   hasNewUpdates || isUpdating || isUpdated || notUpdated || hasNewDownload || isDownloading
  // const showNoUpdatesModal = noUpdates
  if (isLoading) {
    return <p>Loading...</p>
  }
  return (
    <div>
      {/* <NoUpdatesModal show={showNoUpdatesModal} resetStatus={resetStatus} /> */}
      {/* <NewUpdatesModal
        show={showNewUpdatesModal}
        isUpdating={isUpdating}
        isUpdated={isUpdated}
        notUpdated={notUpdated}
        hasNewUpdates={hasNewUpdates}
        hasNewDownload={hasNewDownload}    
        isDownloading={isDownloading}    
        processUpdate={handleUpdates}
        processDownloadPackage={handleDownloadPackage}
        resetStatus={resetStatus}
        latestVersionDetails={latestVersionDetails}
      /> */}
      <div>
        {children({
          handleCheckUpdates,
          disabledButton:checkingUpdates || hasNewUpdates || noUpdates,
          hasNewUpdates,
          updatesCount,
          currentVersionDetails,
          latestVersionDetails                
        })}
      </div>
    </div>
  )
}
