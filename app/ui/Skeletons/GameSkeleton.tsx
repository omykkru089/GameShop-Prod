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
    <rect x="20" y="20" rx="25" ry="25" width="400" height="240" />

    {/* Título */}
    <rect x="440" y="30" rx="10" ry="10" width="300" height="40" />

    {/* Precio */}
    <rect x="440" y="90" rx="10" ry="10" width="100" height="40" />

    {/* Tienda */}
    <rect x="440" y="150" rx="10" ry="10" width="200" height="40" />

    {/* Botón de carrito (abajo, centrado) */}
    <rect x="300" y="290" rx="20" ry="20" width="200" height="50" />
  </ContentLoader>
);

export default MyLoader;