import React from "react"
import useAuth from "./UseAuth"
export const withAuth = (Component) => {
    return (props)=> {
      const auth = useAuth();
      return <Component {...props} auth={auth} />;
    }
  }