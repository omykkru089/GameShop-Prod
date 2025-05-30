export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/carrito/:path*", "/pedidos/:path*"],
};