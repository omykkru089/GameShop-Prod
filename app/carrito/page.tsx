"use client";

import { useCart } from "../../context/cart-context";
import { Header } from "../ui/header";
import { useNotification } from "../ui/notification";
import { useEffect, useMemo, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa"; // Instala react-icons si no lo tienes
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
export default function CarritoPage() {
  const { items, updateQuantity, removeFromCart, fetchCart } = useCart();
  const { showNotification } = useNotification();
  const { data: session } = useSession(); // Si usas next-auth
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  const handleCheckout = async () => {
  // Guarda solo los datos relevantes y usa juegoId
  localStorage.setItem("carritoItems", JSON.stringify(
    items.map(item => ({
      juegoId: item.juegoId || item.id, // usa juegoId si existe, si no usa id
      nombre: item.nombre,
      cantidad: item.cantidad,
      precio: item.precio,
      dispositivo: item.dispositivo,
    }))
  ));
localStorage.setItem("userId", String(session?.user?.id ?? 1));
  // Envía solo juegoId y cantidad al backend
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pagos/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: items.map(item => ({
        id: item.juegoId || item.id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad
      })),
      userId: session?.user?.id || 1
    }),
  });

  const data = await res.json();
console.log(data); // <-- ¿Qué sale aquí?
if (!data.sessionId) {
  alert("Error al crear la sesión de pago. Intenta de nuevo.");
  return;
}
  const stripe = await stripePromise;
  await stripe?.redirectToCheckout({ sessionId: data.sessionId });
};

  const handleRemove = async (id: number) => {
    try {
      await removeFromCart(id);
    } catch (error) {
      console.error(error);
      showNotification("No se pudo eliminar el producto del carrito", "error");
    }
  };

  const handleUpdateQuantity = async (id: number, cantidad: number) => {
    try {
      await updateQuantity(id, cantidad);
    } catch (error) {
      console.error(error);
      showNotification("No se pudo actualizar la cantidad del producto", "error");
    }
  };

  // Calcular el precio total del carrito
  const totalPrice = useMemo(() => {
    return items.reduce((total, item) => total + item.precio * item.cantidad, 0);
  }, [items]);

  return (
    <>
      <Header search={search} setSearch={setSearch}/>
      <div className="container mx-auto px-2 py-4">
        <h1 className="text-2xl font-bold mb-4">Tu carrito</h1>

        {/* Desktop/Tablet */}
        <table className="table-auto w-full border-collapse border border-gray-300 hidden min-[761px]:table">
          <thead>
            <tr>
              <th className="border border-gray-300 px-2 py-1">Nombre</th>
              <th className="border border-gray-300 px-2 py-1">Dispositivo</th>
              <th className="border border-gray-300 px-2 py-1">Precio</th>
              <th className="border border-gray-300 px-2 py-1">Cantidad</th>
              <th className="border border-gray-300 px-2 py-1">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="border border-gray-300 px-2 py-1">{item.nombre || "Nombre no disponible"}</td>
                <td className="border border-gray-300 px-2 py-1">{item.dispositivo || "Dispositivo no disponible"}</td>
                <td className="border border-gray-300 px-2 py-1">{item.precio ? `${item.precio}€` : "Precio no disponible"}</td>
                <td className="border border-gray-200 px-2 py-1 flex items-center justify-center gap-2">
                  <button
                    className="bg-gray-300 text-black px-2 py-1 rounded"
                    onClick={() => handleUpdateQuantity(item.id, item.cantidad - 1)}
                    disabled={item.cantidad <= 1}
                  >
                    -
                  </button>
                  <span>{item.cantidad}</span>
                  <button
                    className="bg-gray-300 text-black px-2 py-1 rounded"
                    onClick={() => handleUpdateQuantity(item.id, item.cantidad + 1)}
                  >
                    +
                  </button>
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleRemove(item.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Móvil */}
        <div className="flex flex-col gap-4 min-[761px]:hidden">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded shadow p-3 flex flex-col gap-2 text-black">
              <div className="flex justify-between items-center">
                <span className="font-bold">{item.nombre || "Nombre no disponible"}</span>
                <div className="flex gap-2">
                  <button
                    className="text-red-500"
                    onClick={() => handleRemove(item.id)}
                    aria-label="Eliminar"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Dispositivo:</span>
                <span className="text-sm">{item.dispositivo || "No disponible"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Precio:</span>
                <span className="text-sm">{item.precio ? `${item.precio}€` : "No disponible"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Cantidad:</span>
                <div className="flex items-center gap-2">
                  <button
                    className="bg-gray-300 text-black px-2 py-1 rounded"
                    onClick={() => handleUpdateQuantity(item.id, item.cantidad - 1)}
                    disabled={item.cantidad <= 1}
                  >
                    -
                  </button>
                  <span>{item.cantidad}</span>
                  <button
                    className="bg-gray-300 text-black px-2 py-1 rounded"
                    onClick={() => handleUpdateQuantity(item.id, item.cantidad + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-left text-black flex justify-between items-center">
        <p className="text-xl font-bold">Total: {totalPrice.toFixed(2)}€</p>
        <button onClick={handleCheckout}>Pagar</button>
      </div>
      </div>
    </>
  );
}