'use client'
import React from "react"
import dynamic from "next/dynamic";
const ContentLoader = dynamic(() => import("react-content-loader"), { ssr: false });
const MyLoader = () => (
<ContentLoader 
  speed={1}
  width={120}
  height={40}
  viewBox="0 0 120 40"
  backgroundColor="#333"
  foregroundColor="#999"
  uniqueKey="logo-skeleton"
>
  <rect x="0" y="00" rx="8" ry="8" width="100" height="80" />
</ContentLoader>
);
export default MyLoader
