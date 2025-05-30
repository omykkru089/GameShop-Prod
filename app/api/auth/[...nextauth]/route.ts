import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
         
          credentials: {
            email: { label: "Email", type: "text", placeholder: "example@example.com" },
            password: { label: "Password", type: "password" },
          },
          async authorize(credentials, req) {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
                {
                  method: "POST",
                  body: JSON.stringify({
                    email: credentials?.email,
                    password: credentials?.password,
                  }),
                  headers: { "Content-Type": "application/json" },
                }
              );
              const user = await res.json();
              console.log(user);
      
              if (user.error) throw user;
      
              return user;
          }
        })
      ],
    session: { strategy: "jwt" },
    callbacks: {
      // jwt() se ejecuta cada vez que se crea o actualiza un token JWT. Aqui se puede agregar propiedades personalizadas al token.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.token = user.token;
      }
        return {...token, ...user};
        
    },
    // session() se utiliza para agregar la informacion del token a la sesion del usuario. lo que hace que esté disponible en el cliente.
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as number;
        session.user.email = token.email as string;
        session.user.role = token.role as string ;
        session.user.token = token.token as string;
      }
        return session;
    },
    },
})

export { handler as GET, handler as POST }