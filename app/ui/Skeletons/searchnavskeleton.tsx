'use client'
import React from "react"
import dynamic from "next/dynamic";
const ContentLoader = dynamic(() => import("react-content-loader"), { ssr: false });

const MyLoader = () => (
<ContentLoader 
  speed={1}
  width={360}
  height={45}
  viewBox="0 0 360 45"
  backgroundColor="#333"
  foregroundColor="#999"
  uniqueKey="search-nav-skeleton"
>
  {/* Lupa */}
  <rect x="0" y="0" rx="8" ry="8" width="40" height="40" />

  {/* Selector de plataformas */}
  <rect x="50" y="0" rx="10" ry="10" width="310" height="40" />
</ContentLoader>
);
export default MyLoader