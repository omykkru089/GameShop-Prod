"use client";
import { useState } from "react";
import { Footer } from './ui/footer';
import { Header } from './ui/header';
import { Body } from './ui/body';

export default function Page() {
  const [search, setSearch] = useState("");
  return (
    
      <main>
        <Header search={search} setSearch={setSearch} />
        <Body search={search} />
        <Footer></Footer>
      </main>
       
  );
}
