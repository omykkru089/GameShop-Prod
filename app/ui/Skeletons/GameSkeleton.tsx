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
    {/* Imagen principal (izquierda) */}
    <rect x="0" y="20" rx="25" ry="25" width="400" height="240" />

    {/* Título */}
    <rect x="405" y="20" rx="10" ry="10" width="250" height="70" />

    {/* Precio */}
    <rect x="405" y="100" rx="10" ry="10" width="250" height="70" />

    {/* Tienda */}
    <rect x="405" y="180" rx="10" ry="10" width="250" height="70" />

    {/* Botón de carrito (abajo, centrado) */}
    <rect x="0" y="270" rx="20" ry="20" width="700" height="40" />
  </ContentLoader>
);

export default MyLoader;
