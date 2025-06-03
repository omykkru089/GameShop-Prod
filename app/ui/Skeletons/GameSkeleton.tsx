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
    <rect x="420" y="30" rx="10" ry="10" width="250" height="50" />

    {/* Precio */}
    <rect x="420" y="90" rx="10" ry="10" width="250" height="50" />

    {/* Tienda */}
    <rect x="420" y="150" rx="10" ry="10" width="250" height="50" />

    {/* Botón de carrito (abajo, centrado) */}
    <rect x="0" y="225" rx="20" ry="20" width="700" height="50" />
  </ContentLoader>
);

export default MyLoader;
