const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })
  if (!response.ok) {
    throw new Error(`Error en la petición: ${response.statusText}`)
  }
  return response.json()
}

export async function getGames() {
  return fetchApi("/juegos")
}

export async function addToCarrito(pedidoId: number, juegoId: number, cantidad: number) {
  return fetchApi("/carrito", {
    method: "POST",
    body: JSON.stringify({ pedidoId, juegoId, cantidad }),
  })
}

export async function getCarrito() {
  return fetchApi("/carrito/${pedidoId}");
}

export async function removeFromCarrito(id: number) {
  return fetchApi(`/carrito/${id}`, { method: "DELETE" })
}

export async function clearCarrito(pedidoId: number) {
  return fetchApi(`/carrito/clear/${pedidoId}`, { method: "DELETE" })
}

export async function createPedido(userId: number, fechaCreacion: Date, estado: string) {
  return fetchApi("/pedido", {
    method: "POST",
    body: JSON.stringify({ userId, fechaCreacion, estado }),
  })
}

export async function getPedidoByUser(userId: number) {
  return fetchApi(`/pedidos/${userId}`);
}

export async function getCarritoByPedido(userId: number) {
  return fetchApi(`/carrito/pedido/${userId}`)
}

export async function login(email: string, password: string) {
  return fetchApi("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

