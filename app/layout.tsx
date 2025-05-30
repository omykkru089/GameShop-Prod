import { CartProvider } from '@/context/cart-context';
import './ui/global.css'
import SessionAuthProvider from '@/context/SessionAuthProvider';
import { NotificationProvider } from './ui/notification';
import React from 'react';
import { Metadata } from 'next';
import { SearchProvider } from "@/context/search-context";


export const metadata: Metadata = {
  title: "GameShop | Tú tienda de videojuegos",
  description: "Tienda online de juegos" 
}

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <SessionAuthProvider>
          <NotificationProvider>
            <SearchProvider>
              <CartProvider>{children}</CartProvider>
            </SearchProvider>
          </NotificationProvider>
        </SessionAuthProvider>
      </body>
    </html>
  );
}
