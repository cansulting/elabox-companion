import {useEffect} from "react"
import io from "socket.io-client";
const PUBLIC_URI = window.location.hostname + ":3001";
window.socket = io(PUBLIC_URI);

function Socket({children}) {
    const socket = window.socket;
    useEffect(() => {
        if (!socket) return
        socket.on("connect", () => {
        console.log("connected")
        })
        socket.on("disconnect", () => {
        console.log("disconnected")
        })
    }, [socket]);
    return children;
}
export default Socket;