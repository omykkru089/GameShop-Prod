import React from "react";
import dynamic from "next/dynamic";
const ContentLoader = dynamic(() => import("react-content-loader"), { ssr: false });

const MyLoader = () => (
  <ContentLoader 
    speed={2}
    width={570}
    height={345}
    viewBox="0 0 570 345"
    backgroundColor="#333"
    foregroundColor="#999"
    uniqueKey="game-skeleton-loader"
  >
    <rect x="0" y="0" rx="25" ry="25" width="407" height="243" /> 
    <rect x="0" y="253" rx="15" ry="15" width="200" height="53" /> 
    <rect x="210" y="253" rx="15" ry="15" width="200" height="53" /> 
    <rect x="420" y="0" rx="15" ry="15" width="150" height="60" /> 
    <rect x="420" y="67" rx="15" ry="15" width="150" height="70" /> 
    <rect x="420" y="145" rx="15" ry="15" width="150" height="160" />
  </ContentLoader>
);

export default MyLoader;