
export type Juego = {
  id:number;
  nombre: string;
  descripcion: string;
  categoria: { id: number; nombre: string };
  plataforma: { id: number; nombre: string };
  precio: number;
  fecha_de_lanzamiento?: string;
  desarrollador: string;
  editorial: string;
  clasificacion_por_edad: string;
  idiomas : string;
  imagen_de_portada: string;
  requisitos_del_sistema: string;
  popularidad: string;
  link: string;
  carrito: string
  video: string;
  dispositivo: string;
  };
  

  export type plataforma = {
    id: number;
    nombre: string;
    descripcion: string;
    fundador: string;
    anio_de_lanzamiento: string;
    tipos_de_medios_compatibles: string;
    };
    
    export type categoria = {
    id: number;
    nombre: string;
    descripcion: string;
      };

    export type desarrollador = {
      id: number;
      nombre: string;
      descripcion: string;
      pais_origen: string;
      anio_fundacion: string;
      sitio_web: string;
      };
      
      export type editorial = {
    id: number;
    nombre: string;
    descripcion: string;
    pais_origen: string;
    anio_fundacion: string;
    sitio_web: string;
        };
        
  export type users = {    
    id: number;
    nombre: string;
    email: string;
    password: string;
    role: string;
  };

  export type userslogged = {    
    token: string
    email: string
    role: string
  };

  export type CartItem = {
    id: number
    pedido: {
      id: number
    }
    juego: {
      id: number
      nombre: string
      precio: number
      imagen_de_portada: string
    }
    cantidad: number
  }
  
export type pedido = {
  id: number
  user: {
    id: number
  }
  fecha_creacion: Date
  estado: string
}