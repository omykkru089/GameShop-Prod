import React from "react"
import dynamic from "next/dynamic";
const ContentLoader = dynamic(() => import("react-content-loader"), { ssr: false });

const MyLoader = () => (
  <ContentLoader 
    speed={1}
    width={200}
    height={100}
    viewBox="0 0 200 100"
    backgroundColor="#333"
    foregroundColor="#999"
    uniqueKey="auth-loader" // <--- Añade esto
  >
    <rect x="40" y="30" rx="3" ry="3" width="40" height="40" /> 
    <circle cx="120" cy="50" r="25" /> 
    
  </ContentLoader>
)

export default MyLoader