'use client'
import { Header } from "../ui/header";
import { Footer } from "../ui/footer";
import { useState } from 'react';

export default function ContactoPage() {
  const [form, setForm] = useState({ email: '', telefono: '', mensaje: '' });
  const [enviado, setEnviado] = useState(false);
  const [search, setSearch] = useState(""); // <--- Añade este estado

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Reemplaza esta URL por tu endpoint real
      await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setEnviado(true);
      setForm({ email: '', telefono: '', mensaje: '' });
    } catch (error) {
      console.error('Error al enviar el formulario', error);
    }
  };
    return (
      <>
      <Header search={search} setSearch={setSearch}/>
      <div className="flex flex-col justify-start h-screen px-4 py-8 w-full bg-[#0D0D0D] text-[#9a9a9a]">
      <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Formulario de Contacto</h1>

      {enviado && (
        <p className="mb-4 text-green-600 font-semibold">
          ¡Tu mensaje ha sido enviado con éxito!
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block font-medium text-sm mb-1">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2"
          />
        </div>

        <div>
          <label htmlFor="telefono" className="block font-medium text-sm mb-1">Número de teléfono</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2"
          />
        </div>

        <div>
          <label htmlFor="mensaje" className="block font-medium text-sm mb-1">Descripción del problema</label>
          <textarea
            id="mensaje"
            name="mensaje"
            required
            rows={5}
            value={form.mensaje}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Enviar
        </button>
      </form>
    </div>
        </div>
        <Footer/>
        </>
    
  );
}
