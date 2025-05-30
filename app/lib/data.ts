


export async function fetchJuego() {
    await new Promise((resolve) => setTimeout(resolve, 1500));
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/juegos`, {
            cache:"no-store",
            method: "GET",
            headers:{
                "Content-Type": "application/json",
            }
        });
        if (!res.ok) {
            throw new Error("Error al obtener los datos");
          }
        
          const data = await res.json();
          return data; // Asegúrate de devolver los datos
    } 
  
    export async function fetchPlataforma() {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/plataformas`, {
            cache:"no-store",
            method: "GET",
            headers:{
                "Content-Type": "application/json",
            }
        });
        if (!res.ok) {
            throw new Error("Error al obtener los datos");
          }
        
          const data = await res.json();
          return data; // Asegúrate de devolver los datos
    } 
  
    export async function fetchCategorias() {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categorias`, {
            cache:"no-store",
            method: "GET",
            headers:{
                "Content-Type": "application/json",
            }
        });
        if (!res.ok) {
            throw new Error("Error al obtener los datos");
          }
        
          const data = await res.json();
          return data; // Asegúrate de devolver los datos
    } 
  
    export async function fetchDesarrolladores() {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/desarrolladores`, {
            cache:"no-store",
            method: "GET",
            headers:{
                "Content-Type": "application/json",
            }
        });
        if (!res.ok) {
            throw new Error("Error al obtener los datos");
          }
        
          const data = await res.json();
          return data; // Asegúrate de devolver los datos
    } 
  
    export async function fetchEditoriales() {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/editoriales`, {
            cache:"no-store",
            method: "GET",
            headers:{
                "Content-Type": "application/json",
            }
        });
        if (!res.ok) {
            throw new Error("Error al obtener los datos");
          }
        
          const data = await res.json();
          return data; // Asegúrate de devolver los datos
    } 
  
    export async function fetchUsuarios() {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
            cache:"no-store",
            method: "GET",
            headers:{
                "Content-Type": "application/json",
            }
        });
        if (!res.ok) {
            throw new Error("Error al obtener los datos");
          }
        
          const data = await res.json();
          return data; // Asegúrate de devolver los datos
    } 