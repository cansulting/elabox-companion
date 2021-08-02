import React, { useState, useEffect } from "react"
import API from "../../../api/backend"
export default function Ota({ children }) {
  const [status, setStatus] = useState("idle")
  const [currentVersionDetails, setCurrentVersionDetails] = useState("")
  const [latestVersionDetails, setLatestVersionDetails] = useState("")
  const [updatesCount, setUpdatesCount] = useState(0)
  const [progress, setProgress] = useState(0)
  const companion_socket = window.companion_socket
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
  useEffect(() => {
    if (!companion_socket) return
    companion_socket.on("process_percent", (data) => {
      setProgress(data)
    })
  }, [companion_socket])
  const handleCheckUpdates = async () => {
    try {
      setStatus("checking")
      const checkUpdatesResponse = await API.checkUpdates()
      const thereIsNewUpdates = checkUpdatesResponse.new_update
      if (thereIsNewUpdates) {
        setUpdatesCount(checkUpdatesResponse.count)
        setStatus("new-download")
      } else {
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
      API.processUpdate()
    } catch (error) {
      setStatus("not-updated")
    }
  }
  const handleDownloadPackage = async () => {
    try {
      setStatus("downloading")
      const isDownloaded = await API.processDownloadPackage()
      if (isDownloaded) {
        setStatus("new-updates")
      }
    } catch (error) {
      resetStatus()
    }
  }
  const isLoading = !currentVersionDetails && !latestVersionDetails
  const isUpdating = status === "updating"
  const noUpdates = status === "no-updates"
  const hasNewUpdates = status === "new-updates"
  const notUpdated = status === "not-updated"
  const checkingUpdates = status === "checking"
  const hasNewDownload = status === "new-download"
  const isDownloading = status === "downloading"
  const isProcessingData = isDownloading
  const disabledButton = isUpdating
  if (isLoading) {
    return <p>Loading...</p>
  }
  return (
    <div>
      <div>
        {children({
          disabledButton,
          isProcessingData,
          hasNewUpdates,
          isUpdating,
          notUpdated,
          hasNewDownload,
          checkingUpdates,
          isDownloading,
          updatesCount,
          currentVersionDetails,
          latestVersionDetails,
          progress,
          noUpdates,
          handleCheckUpdates,
          handleUpdates,
          handleDownloadPackage,
        })}
      </div>
    </div>
  )
}
