'use client'
import { useState } from "react";
import { Header } from "../ui/header";
import { Footer } from "../ui/footer";
export default function PrivacidadPage() {
  const [search, setSearch] = useState(""); // <--- Añade este estado
    return (
      <>
      <Header search={search} setSearch={setSearch}/>
      <div className="flex flex-col justify-start h-screen px-4 py-8 w-full bg-[#0D0D0D] text-[#9a9a9a]">
      <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Política de Privacidad</h1>
      <p className="text-base leading-relaxed">
        Tu privacidad es importante para nosotros. Esta política explica cómo recopilamos, usamos y protegemos tu información personal al utilizar este sitio.
      </p>
    </div>
    </div>
    <Footer/>
    </>
  );
}
