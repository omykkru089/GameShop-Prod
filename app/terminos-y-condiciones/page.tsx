'use client'
import { useState } from "react";
import { Header } from "../ui/header";
import { Footer } from "../ui/footer";

export default function TerminosPage() {
  const [search, setSearch] = useState(""); // <--- Añade este estado
  return (
    <>
    <Header search={search} setSearch={setSearch}/>
    <div className="flex flex-col justify-start h-screen px-4 py-8 w-full bg-[#0D0D0D] text-[#9a9a9a]">
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Términos y Condiciones</h1>
      <p className="text-base leading-relaxed">
        Al utilizar este sitio web, aceptas cumplir con estos términos y condiciones. 
        Nos reservamos el derecho de modificar estas condiciones en cualquier momento sin previo aviso.
      </p>
    </div>
    </div>
    <Footer/>
    </>
  );
}