'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { categoria, desarrollador, editorial, plataforma, users } from '../lib/definitions';
import { fetchUsuarios } from '../lib/data';
import Modal from './components/Modal';
import bcrypt from 'bcryptjs'; // Importar bcrypt
import { FaTrash, FaEdit, FaPlus, FaFileImport } from "react-icons/fa";
import Papa from "papaparse";
import type { ParseResult } from 'papaparse';

const Page = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<users | null>(null);
  const [activeTab, setActiveTab] = useState('juegos');
  const [data, setData] = useState<TableItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);
  const [categorias, setCategorias] = useState<categoria[]>([]);
  const [plataformas, setPlataformas] = useState<plataforma[]>([]);
  const [editoriales, setEditoriales] = useState<editorial[]>([]);
  const [desarrolladores, setDesarrolladores] = useState<desarrollador[]>([]);
  const [allGamesForClaves, setAllGamesForClaves] = useState<GameForDropdown[]>([]); // For clavesjuegos dropdown

  // Define GameForDropdown interface (can be moved to definitions.ts if used elsewhere)
  interface GameForDropdown {
    id: number;
    nombre: string;
    plataforma?: { id: number; nombre: string };
    dispositivo?: string; // Añadido para el dropdown de clavesjuegos
  }


  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!session?.user?.token) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`, {
          headers: { Authorization: `Bearer ${session.user.token}` },
        });
        if (!res.ok) { setUser(null); return; }
        const currentUser = await res.json();
        setUser(currentUser || null);
      } catch (err) { setUser(null); console.error("Error fetching user:", err); }
    };
    if (session) { fetchUser(); }
  }, [session]);
  // Notificación simple (puedes mejorarla con un modal o toast)
function showNotification(msg: string, type: "success" | "error") {
  alert(`${type === "success" ? "✔️" : "❌"} ${msg}`);
}

  // Definir un tipo para los datos
  type TableItem = {
    id: number;
    nombre?: string;
    [key: string]: any; // Permitir otras propiedades dinámicas
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: async (results: any) => {
      try {

        // Detecta si la tab activa es 'juegos' y transforma los campos necesarios
    let dataToSend = results.data;
    if (activeTab === 'users') {
  // Cifra la contraseña de cada usuario antes de enviar
  dataToSend = await Promise.all(
    dataToSend.map(async (row: any) => {
      const newRow = { ...row };
      if (newRow.password) {
        newRow.password = await bcrypt.hash(newRow.password, 10);
      }
      return newRow;
    })
  );
}
if (activeTab === 'clavesjuegos') {
            // Asegurarse que juegoId es un número y otros campos tienen el formato correcto
            dataToSend = dataToSend.map((row: any) => {
              const newRow = { ...row };
              if (newRow.juego_id) newRow.juego_id = Number(newRow.juego_id);
              // Aquí podrías validar 'estado' si es necesario
              return newRow;
            });
          }
    if (activeTab === 'juegos') {
      const arrayFields = [
        'descripcion',
        'idiomas',
        'imagen_de_portada',
        'video',
        'requisitos_del_sistema',
        'link',
      ];
      dataToSend = dataToSend.map((row: any) => {
  const newRow = { ...row };
  arrayFields.forEach((field) => {
    if (typeof newRow[field] === 'string') {
      if (newRow[field].includes(',')) {
        newRow[field] = newRow[field].split(',').map((item: string) => item.trim());
      } else if (newRow[field].trim() === '') {
        newRow[field] = [];
      } else {
        newRow[field] = [newRow[field].trim()];
      }
    } else if (!Array.isArray(newRow[field])) {
      newRow[field] = [];
    }
  });
  return newRow;
});
    }
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${activeTab}/bulk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.token}`,
      },
      body: JSON.stringify(dataToSend),
    });
        if (!res.ok) throw new Error("Error al importar registros");
        showNotification("Registros importados correctamente", "success");
        // Recarga los datos
        const updatedData = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${activeTab}`, {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        });
        const result = await updatedData.json();
        setData(result);
      } catch (error) {
        showNotification("Error al importar registros", "error");
      }
    },
    error: () => {
      showNotification("Error al leer el archivo CSV", "error");
    },
  });
};

  // Cargar datos de las tablas relacionadas
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [categoriasRes, plataformasRes, editorialesRes, desarrolladoresRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categorias`).then((res) => res.json()),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/plataformas`).then((res) => res.json()),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/editoriales`).then((res) => res.json()),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/desarrolladores`).then((res) => res.json()),
        ]);

        setCategorias(categoriasRes as categoria[]);
        setPlataformas(plataformasRes as plataforma[]);
        setEditoriales(editorialesRes as editorial[]);
        setDesarrolladores(desarrolladoresRes as desarrollador[]);
      } catch (error) {
        console.error('Error al cargar las opciones:', error);
      }
    };

    fetchOptions();

    const fetchGameOptionsForClaves = async () => {
      try {
        if (!session?.user?.token) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/juegos`, {
          headers: { Authorization: `Bearer ${session.user.token}` },
        });        
        if (!res.ok) throw new Error(`Failed to fetch games for claves dropdown: ${res.status}`);
        const gamesData: any[] = await res.json();
        if (Array.isArray(gamesData)) {
          setAllGamesForClaves(gamesData as GameForDropdown[]);
        } else {
          setAllGamesForClaves([]); // Asegurarse de que sea un array si la respuesta no lo es
        }
      } catch (error) {
        console.error('Error fetching games for claves:', error);
        setAllGamesForClaves([]);
      }
    };
    fetchGameOptionsForClaves();
  }, [session]); // Añadir session como dependencia

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = await fetchUsuarios(); // Esta llamada podría estar causando el 403 si el usuario no es ADMIN
  //       const currentUser = data.find((u: users) => u.email === session?.user?.email);
  //       setUser(currentUser || null); // Esto es redundante si el useEffect de arriba (fetchUser) ya lo hace
  //     } catch (err) {
  //       console.log("Error en useEffect que llama a fetchUsuarios:", err);
  //     }
  //   };

  //   if (session) {
  //     fetchData();
  //   }
  // }, [session]);

  // Cargar datos según la pestaña activa
  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint =
          activeTab === 'carrito'
            ? 'carrito/admin'
            : activeTab === 'pedidos'
            ? 'pedidos/admin'
            : activeTab;

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${endpoint}`, {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        });

        const result = await res.json();
        setData(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };
    fetchData();
  }, [activeTab, session]);

  // Filtrar datos por término de búsqueda
  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const placeholders: Record<string, Record<string, string>> = {
    juegos: {
      nombre: "Ejemplo: Juego de Prueba",
      descripcion: 'Ejemplo: Este es un juego de prueba para verificar la funcionalidad.',
      categoria: "Ejemplo: Acción",
      plataforma: "Ejemplo: PC",
      editorial: "Ejemplo: Ubisoft",
      desarrollador: "Ejemplo: Naughty Dog",
      precio: "Ejemplo: 19.99",
      fecha_de_lanzamiento: "Ejemplo: Año/Mes/Día",
      clasificacion_por_edad: 'Ejemplo: +21',
      idiomas: 'Ejemplo: Español, Inglés',
      imagen_de_portada: 'Ejemplo: https://example.com/imagen.jpg',
      video: 'Ejemplo: https://example.com/video.mp4',
      requisitos_del_sistema: 'Ejemplo: Windows 10, 8GB RAM,GTX 1050',
      popularidad: "Ejemplo: 9/10",
      link: 'Ejemplo: comprar-(nombre-juego)-(plataforma)',
      dispositivo: "Ejemplo: PC",
    },
    categorias: {
      nombre: "Ejemplo: Acción",
      descripcion: "Ejemplo: Juegos que implican acción rápida y reflejos.",
    },
    plataformas: {
      nombre: "Ejemplo: Steam",
      descripcion: "Ejemplo: Plataforma para juegos de computadora.",
      fundador: "Ejemplo: Valve",
      anio_de_lanzamiento: "Ejemplo: 2001",
      tipos_de_medios_compatibles: "Ejemplo: descargas digitales",
      dispositivos: "Ejemplo: PC, Nintendo",
    },
    desarrolladores: {
      nombre: "Ejemplo: Mojang",
      descripcion: "Ejemplo: Desarrollador de juegos AAA.",
      pais_origen: "Ejemplo: Suecia",
      anio_fundacion: "Ejemplo: 1984",
      sitio_web: "Ejemplo: https://www.minecraft.net/en-us/article/meet-mojang-stud",
    },
    editoriales: {
      nombre: "Ejemplo: Ubisoft",
      descripcion: "Ejemplo: Editorial de juegos AAA.",
      pais_origen: "Ejemplo: Francia",
      anio_fundacion: "Ejemplo: 1986",
      sitio_web: "Ejemplo: https://ubisoft.com",
    },
    users: {
      nombre: "Ejemplo: Juan Pérez",
      email: "Ejemplo: juan.perez@example.com",
      password: "Ejemplo: contraseña123",
      role: "Ejemplo: user",
    },
    clavesjuegos: {
      clave: "XXXXX-XXXXX-XXXXX-XXXXX",
      juego_id: "ID del Juego (número)", // Campo para el ID numérico del juego
      estado: "libre / pendiente / comprado / devuelto",
    },
  };

  // Manejar la selección de un registro
  const handleSelect = (item: any) => {
    setSelectedItem(item === selectedItem ? null : item);
  };

  // Manejar la eliminación de un registro
  const handleDelete = async (id: number) => {
    try {
      if (!activeTab || !session?.user?.token) {
        throw new Error('No se ha seleccionado una tabla activa o el usuario no está autenticado');
      }
      const endpoint = activeTab === 'carrito' ? `carrito/admin/${id}` : `${activeTab}/${id}`;
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.token}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al eliminar el registro');
      }
      setData((prevData) => prevData.filter((item) => item.id !== id));
      setSelectedItem(null);
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
         if (error instanceof Error) {
     console.log(error.message);
   }
    }
  };

  const handleAdd = async (newItem: any) => {
    try {
      if (!activeTab || !session?.user?.token) {
        showNotification("No se ha seleccionado una tabla activa o el usuario no está autenticado.", "error");
        return;
      }
      const requiredFields = Object.keys(placeholders[activeTab] || {});
      
      const itemToAdd = { ...newItem };
      let dataToSend: any;

      if (activeTab === 'clavesjuegos') {
        // Validación específica para clavesjuegos
        if (!itemToAdd.clave || String(itemToAdd.clave).trim() === '') {
          showNotification("El campo 'clave' es obligatorio.", "error");
          return;
        }
        if (itemToAdd.juego_id === undefined || itemToAdd.juego_id === null || String(itemToAdd.juego_id).trim() === '') {
          showNotification("Debe seleccionar un juego para la clave.", "error");
          return;
        }
        const payload: any = {
          clave: itemToAdd.clave,
          estado: itemToAdd.estado || 'libre', // Si estado no viene, se pone 'libre' por defecto
          juego_id: Number(itemToAdd.juego_id) // itemToAdd.juego_id ya debería ser un número por handleChange
        };
        dataToSend = payload;
      } else {
        // Procesamiento para otras pestañas
        if (activeTab === 'users' && itemToAdd.password) {
          itemToAdd.password = await bcrypt.hash(itemToAdd.password, 10);
        }

        // Validación genérica para otras pestañas (si aplica)
        for (const field of requiredFields) {
          if (!itemToAdd[field] && field !== 'juego_id') { // No validar juego_id aquí ya que es específico de clavesjuegos
            showNotification(`El campo "${field}" es obligatorio para ${activeTab}.`, "error");
            return;
          }
        }
        if (activeTab === 'juegos') {
          const arrayFields = [
            'descripcion', 'idiomas', 'imagen_de_portada', 'video',
            'requisitos_del_sistema', 'link',
          ];
          arrayFields.forEach((field) => {
            if (itemToAdd[field] && typeof itemToAdd[field] === 'string') {
              itemToAdd[field] = itemToAdd[field].split(',').map((s: string) => s.trim());
            }
          });
          // Asegurar que los campos de ID de relación son strings si existen
          ['categoria', 'plataforma', 'editorial', 'desarrollador'].forEach(field => {
            // El backend para juegos espera estos IDs como números.
            // El formulario ya los guarda como números debido a handleChange.
            // Si por alguna razón llegaran como strings, los convertimos.
            if (itemToAdd[field] !== undefined && itemToAdd[field] !== null && typeof itemToAdd[field] === 'string' && !isNaN(Number(itemToAdd[field]))) {
                itemToAdd[field] = Number(itemToAdd[field]);
            }
          });
        }
        const { id, ...rest } = itemToAdd; // Excluir 'id' para la creación
        dataToSend = rest;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${activeTab}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({ message: 'Error al agregar el registro.' }));
        throw new Error(errorBody.message || 'Error al agregar el registro');
      }

      const updatedDataResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${activeTab}`, {
        headers: { Authorization: `Bearer ${session.user.token}` },
      });
      const result = await updatedDataResponse.json();
      setData(Array.isArray(result) ? result : []);
      setIsAdding(false);
      showNotification("Registro agregado correctamente.", "success");

    } catch (error) {
      console.error('Error al agregar el registro:', error);
      if (error instanceof Error) {
        showNotification(`Error: ${error.message}`, "error");
      } else {
        showNotification("Ocurrió un error desconocido al agregar.", "error");
      }
    }
  };

  const handleEdit = async (itemToUpdate: any) => {
    try {
      if (!activeTab || !session?.user?.token) {
        showNotification("No se ha seleccionado una tabla activa o el usuario no está autenticado.", "error");
        return;
      }

      let endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${activeTab}/${itemToUpdate.id}`;
      let bodyToUpdate: any;
      const { id, ...dataFromForm } = itemToUpdate; // Datos del formulario sin el ID

      if (activeTab === 'clavesjuegos') {
        const payload: any = {};
        // Comparar con editData (los datos originales antes de la edición)
        if (dataFromForm.clave !== undefined && dataFromForm.clave !== editData.clave) {
          payload.clave = dataFromForm.clave;
        }
        if (dataFromForm.estado !== undefined && dataFromForm.estado !== editData.estado) {
          payload.estado = dataFromForm.estado;
        }
        
        const newJuegoId = dataFromForm.juego_id ? Number(dataFromForm.juego_id) : undefined;
        const originalJuegoId = editData.juego ? Number(editData.juego.id) : (editData.juego_id ? Number(editData.juego_id) : undefined);

        if (newJuegoId !== undefined && newJuegoId !== originalJuegoId) {
          payload.juego_id = newJuegoId; 
        } else if (newJuegoId === undefined && originalJuegoId !== undefined && dataFromForm.juego_id === '') { 
          // payload.juego_id = null; // O manejar según el backend espere para desasociar
          // Por ahora, si se deselecciona, no se envía, a menos que el backend lo requiera explícitamente como null.
        }
        
        if (Object.keys(payload).length === 0) {
          showNotification("No hay cambios para guardar.", "success"); // Usar success o info
          setIsEditing(false);
          setEditData(null);
          return;
        }
        bodyToUpdate = JSON.stringify(payload);
        endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/clavesjuegos/${id}`;
      } else if (activeTab === 'carrito') {
        endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/carrito/admin/${id}`;
        bodyToUpdate = JSON.stringify({ cantidad: dataFromForm.cantidad });
      } else { 
        let processedData = { ...dataFromForm };

       if (activeTab === "juegos") {
  // Convierte los campos relacionados a string (id) siempre
  ["categoria", "plataforma", "editorial", "desarrollador"].forEach((field) => {
    if (itemToUpdate[field]?.id !== undefined) {
      itemToUpdate[field] = String(itemToUpdate[field].id);
    } else if (typeof itemToUpdate[field] === "number") {
      itemToUpdate[field] = String(itemToUpdate[field]);
    } else if (typeof itemToUpdate[field] === "string") {
      itemToUpdate[field] = itemToUpdate[field];
    } else {
      itemToUpdate[field] = "";
    }
  });

  // Si tienes arrays que pueden venir como string, conviértelos igual que en handleAdd
  const arrayFields = [
    "descripcion",
    "idiomas",
    "imagen_de_portada",
    "video",
    "requisitos_del_sistema",
    "link",
  ];
  arrayFields.forEach((field) => {
    if (itemToUpdate[field] && typeof itemToUpdate[field] === "string") {
      itemToUpdate[field] = itemToUpdate[field]
        .split(",")
        .map((s: string) => s.trim());
    }
  });
}

        if (activeTab === 'users' && processedData.password) {
          if (typeof processedData.password === 'string' && !processedData.password.startsWith('$2a$') && !processedData.password.startsWith('$2b$')) {
            processedData.password = await bcrypt.hash(processedData.password, 10);
          } else if (processedData.password.startsWith('$2a$') || processedData.password.startsWith('$2b$')) {
            // Si es un hash (probablemente el original cargado), no se envía para evitar re-hashear o enviar innecesariamente.
            // Esto asume que el formulario no muestra el hash. Si el campo password está vacío, no se envía.
            delete processedData.password;
          }
        } else if (activeTab === 'users' && !processedData.password) {
           delete processedData.password; 
        }
        bodyToUpdate = JSON.stringify(processedData);
      }

      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.token}`,
        },
        body: bodyToUpdate,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `Error al actualizar el registro en ${activeTab}` }));
        console.error("Error response from backend:", errorData);
        throw new Error(errorData.message || `Error al actualizar el registro en ${activeTab}`);
      }

      const currentTabEndpoint = activeTab === 'carrito' || activeTab === 'pedidos' ? `${activeTab}/admin` : activeTab;
      const updatedDataResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${currentTabEndpoint}`, {
        headers: { Authorization: `Bearer ${session.user.token}` },
      });
      const result = await updatedDataResponse.json();
      setData(Array.isArray(result) ? result : []);
      setIsEditing(false);
      setEditData(null);
      showNotification("Registro actualizado correctamente.", "success");

    } catch (error) {
      console.error(`❌ Error al actualizar el registro en ${activeTab}:`, error);
      if (error instanceof Error) {
          showNotification(`Error: ${error.message}`, "error");
      } else {
          showNotification("Ocurrió un error desconocido al actualizar.", "error");
      }
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  const Formulario = ({
    onSubmit,
    initialData,
    activeTab,
    allGames, 
    categorias, plataformas, editoriales, desarrolladores, 
  }: {
    onSubmit: (data: any) => void;
    initialData?: any;
    activeTab: string;
    allGames?: GameForDropdown[];
    categorias?: categoria[];
    plataformas?: plataforma[];
    editoriales?: editorial[];
    desarrolladores?: desarrollador[];
  }) => {
    const [formData, setFormData] = useState<any>({});
    // State for the game search input within the clavesjuegos form
    const [juegoSearchTerm, setJuegoSearchTerm] = useState(''); // For clavesjuegos game search

    useEffect(() => {
      let newFormData: any = {};
      if (initialData) {
        newFormData = { ...initialData }; 
        if (activeTab === 'clavesjuegos') {
          newFormData = {
            // Start with specific fields for clavesjuegos to avoid carrying over unexpected props
            id: initialData.id,
            clave: initialData.clave || '',
            estado: initialData.estado || '',
            // Set juego_id carefully based on your provided logic
            juego_id: (initialData.juego && typeof initialData.juego === 'object' 
                        ? initialData.juego.id 
                        : initialData.juego_id) || '',
          };
          // Ensure the 'juego' object itself is not in formData if it came from initialData
          if (newFormData.juego) delete newFormData.juego;
        } else if (activeTab === 'juegos') {
          ['categoria', 'plataforma', 'editorial', 'desarrollador'].forEach(field => {
            if (initialData[field] && typeof initialData[field] === 'object' && initialData[field].id !== undefined) {
              newFormData[field] = initialData[field].id;
            } else {
              // Si initialData[field] es un número (ID directo), usarlo. Sino, string vacío.
              newFormData[field] = typeof initialData[field] === 'number' ? initialData[field] : (initialData[field] || '');
            }
          });
        }
      } else { 
        if (placeholders[activeTab]) {
          Object.keys(placeholders[activeTab]).forEach(key => {
            newFormData[key] = ''; 
          });
        }
        if (activeTab === 'clavesjuegos') {
            newFormData.clave = newFormData.clave || ''; 
            newFormData.juego_id = newFormData.juego_id || ''; 
            newFormData.estado = newFormData.estado || ''; 
        }
      }
      setFormData(newFormData);
      setJuegoSearchTerm(''); 
    }, [initialData, activeTab]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      if ((activeTab === 'juegos' && ['categoria', 'plataforma', 'editorial', 'desarrollador'].includes(name)) ||
          (activeTab === 'clavesjuegos' && name === 'juego_id')) {
        setFormData({ ...formData, [name]: value ? Number(value) : '' });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    // Memoized and filtered list of games for the clavesjuegos dropdown
    // This hook recalculates the filtered list whenever allGames or juegoSearchTerm changes
    const filteredJuegosParaDropdown = React.useMemo(() => {
      if (!allGames || !Array.isArray(allGames)) return [];
      const searchTermLower = juegoSearchTerm.toLowerCase();
      if (!searchTermLower) return allGames.slice(0, 100); // Show initial list (limited)

      return allGames.filter(game => {
        const nombre = game.nombre?.toLowerCase() || '';
        const plataformaNombre = game.plataforma?.nombre?.toLowerCase() || '';
        const dispositivoNombre = game.dispositivo?.toLowerCase() || '';
        return nombre.includes(searchTermLower) || plataformaNombre.includes(searchTermLower) || dispositivoNombre.includes(searchTermLower);
      });
      
    }, [allGames, juegoSearchTerm]);

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {activeTab === 'clavesjuegos' ? (
          <>
            <div>
              <label htmlFor="clave" className="block text-sm font-medium text-gray-700">Clave</label>
              <input type="text" name="clave" id="clave" value={formData.clave || ''} onChange={handleChange} className="border p-2 w-full" placeholder={placeholders.clavesjuegos?.clave} />
            </div>
            <div>
              <label htmlFor="juegoSearch" className="block text-sm font-medium text-gray-700">Buscar Juego</label>
              <input type="text" name="juegoSearch" id="juegoSearch" value={juegoSearchTerm} onChange={(e) => setJuegoSearchTerm(e.target.value)} className="border p-2 w-full mb-2" placeholder="Buscar por nombre o plataforma..." />
            </div>
            <div>
              <label htmlFor="juego_id" className="block text-sm font-medium text-gray-700">Juego</label>
              <select name="juego_id" id="juego_id" value={formData.juego_id || ''} onChange={handleChange} className="border p-2 w-full">
                <option value="">Seleccionar Juego</option>
                {filteredJuegosParaDropdown.map((game: GameForDropdown) => (
                  <option key={game.id} value={game.id}>
                    {game.nombre} - {game.plataforma?.nombre || 'N/P'} - {game.dispositivo || 'N/D'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado</label>
              <select name="estado" id="estado" value={formData.estado || ''} onChange={handleChange} className="border p-2 w-full">
                <option value="">Seleccionar Estado</option>
                <option value="libre">Libre</option>
                <option value="comprado">Comprado</option>
                <option value="devuelto">Devuelto</option>
                <option value="pendiente">Pendiente</option>
              </select>
            </div>
          </>
        ) : activeTab === 'carrito' ? (
          <div>
            <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700">
              Cantidad
            </label>
            <input
              id="cantidad"
              name="cantidad"
              type="number"
              value={formData.cantidad || ''}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
        ) : ( 
          Object.keys(placeholders[activeTab] || {}).map((key) => (
            <div key={key}>
              <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              {activeTab === 'juegos' && ['categoria', 'plataforma', 'editorial', 'desarrollador'].includes(key) ? (
                <select
                  id={key}
                  name={key}
                  value={formData[key] || ''} 
                  onChange={handleChange}
                  className="border p-2 w-full"
                >
                  <option value="">Seleccionar {key}</option>
                  {(key === 'categoria' ? categorias : key === 'plataforma' ? plataformas : key === 'editorial' ? editoriales : desarrolladores)?.map(
                    (option: any) => ( // Use 'any' or a more specific type if available for these options
                      <option key={option.id} value={option.id}>
                        {option.nombre}
                      </option>
                  ))}
                </select>
              ) : (
                <input
                  id={key}
                  name={key}
                  value={formData[key] || ''}
                  onChange={handleChange}
                  placeholder={placeholders[activeTab]?.[key] || ''}
                  className="border p-2 w-full"
                />
              )}
            </div>
          ))
        )}

        <div className="flex space-x-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Guardar
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setIsAdding(false);
              setEditData(null);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
    );
  };

  return (
    <>
      {user ? (
        <>
          <header className='h-[50px] w-full flex z-20 bg-gray-950 fixed'>
            <Link href="/"><Image src="/GameShop.png" alt="icono de la web" width={400} height={400} className='w-[100px] h-[80px] relative top-[-15px]' /></Link>
            <h1 className='text-white absolute right-[32px] top-[11px]'>{user.nombre || "Como me llamo?"}</h1>
          </header>
          <div className="flex h-screen">
            {/* Nav lateral responsive con animación */}
            <nav className="
              h-full bg-[#ECE4F9] pt-[10px] grid
              w-[60px] desktop:w-[150px]
              tablet:pt-2
              fixed z-10
              min-h-screen
              [transition:.3s]
            ">
              <ul className="space-y-4 mt-12 relative grid place-content-between h-[90%] w-full">
                <li>
                  <Link href="/sobre-mi">
                    <div className="flex items-center justify-center tablet:justify-start p-2 w-full hover:bg-[#A167D8] hover:text-white rounded whitespace-nowrap [transition:.3s]">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                        className="w-8 h-8 desktop:w-5 desktop:h-5 mr-0 tablet:mr-1 desktop:mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                      <span className="hidden desktop:inline">Sobre Mi</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={async () => { await signOut(); window.location.href = '/'; }}
                    className="flex items-center justify-center tablet:justify-start w-full text-start p-2 hover:bg-[#A167D8] hover:text-white rounded whitespace-nowrap [transition:.3s]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor"
                      className="w-8 h-8 desktop:w-5 desktop:h-5 mr-0 tablet:mr-1 desktop:mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                    </svg>
                    <span className="hidden  desktop:inline">Cerrar Sesión</span>
                  </button>
                </li>
              </ul>
            </nav>
            <main
              className="
                w-full tablet:w-[calc(100%-100px)] desktop:w-[calc(100%-150px)]
                ml-[60px] tablet:ml-[100px] desktop:ml-[150px]
                mt-[5rem] px-2 tablet:px-4
                flex flex-col items-center
                [transition:.3s]
              "
            >
              <div className="w-full max-w-[1200px] p-2 tablet:p-4">
                {/* Header Panel y botón añadir */}
                <header className="flex justify-between items-center mb-4">
  <h1 className="text-2xl tablet:text-xl desktop:text-2xl font-bold [transition:.3s]">Panel de Administración</h1>
  <div className="flex gap-2">
    {/* Botón Importar CSV adaptativo */}
    <button
      className="
        bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded tablet:px-3 tablet:py-1 tablet:text-sm
        hidden min-[761px]:flex items-center gap-2 [transition:.3s]
      "
      onClick={() => document.getElementById("csv-input")?.click()}
    >
      <FaFileImport className="tablet:text-base desktop:text-lg" />
      <span className="hidden tablet:inline">Importar CSV</span>
    </button>
    {/* Botón Importar CSV móvil */}
    <button
      className="bg-purple-700 hover:bg-purple-800 text-white p-2 rounded flex min-[761px]:hidden items-center [transition:.3s]"
      onClick={() => document.getElementById("csv-input")?.click()}
      aria-label="Importar CSV"
    >
      <FaFileImport size={18} />
    </button>
    <input
      id="csv-input"
      type="file"
      accept=".csv"
      style={{ display: "none" }}
      onChange={handleImportCSV}
    />
    {/* Botón añadir adaptativo */}
    <button
      onClick={() => setIsAdding(true)}
      className="
        bg-blue-500 text-white px-4 py-2 rounded tablet:px-3 tablet:py-1 tablet:text-sm
        hidden min-[761px]:flex items-center gap-2 [transition:.3s]
      "
    >
      <FaPlus className="tablet:text-base desktop:text-lg" />
      <span className="hidden tablet:inline">Añadir {activeTab.slice(0, -1)}</span>
    </button>
    {/* Botón añadir móvil */}
    <button
      onClick={() => setIsAdding(true)}
      className="bg-blue-500 text-white p-2 rounded flex min-[761px]:hidden items-center [transition:.3s]"
      aria-label="Añadir"
    >
      <FaPlus size={18} />
    </button>
  </div>
</header>

                {/* Buscador */}
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border p-2 mb-4 w-full text-sm tablet:text-xs [transition:.3s]"
                />

                {/* Tabs */}
                <nav className="flex flex-wrap gap-2 mb-4">
                  {['juegos', 'categorias', 'editoriales', 'desarrolladores', 'plataformas','clavesjuegos', 'carrito', 'users'].map(
                    (tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
                          p-2 rounded whitespace-nowrap
                          ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200'}
                          text-sm tablet:text-xs [transition:.3s]
                        `}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    )
                  )}
                </nav>

                {/* Desktop/Tablet */}
                <div className="overflow-x-auto rounded-lg shadow mb-4 [transition:.3s]">
                  <table className="table-auto w-full border-collapse border border-gray-300 hidden min-[761px]:table [transition:.3s]">
                    <thead>
                      <tr>
                        {data.length > 0 &&
                          Object.keys(data[0]).map((key) => (
                            <th key={key} className="border border-gray-300 px-2 py-1 text-base tablet:text-sm [transition:.3s]">
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </th>
                          ))}
                        <th className="border border-gray-300 px-2 py-1 text-base tablet:text-sm [transition:.3s]">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item) => (
    <tr
      key={item.id}
      className={`[transition:.3s] cursor-pointer ${selectedItem === item ? 'bg-purple-200' : 'bg-gray-100'}`}
      onClick={() => setSelectedItem(item)}
    >
      {Object.entries(item).map(([key, value], index) => (
        <td key={index} className="border border-gray-300 px-2 py-1 text-base tablet:text-sm [transition:.3s]">
          {activeTab === 'carrito' && key === 'juego' && typeof value === 'object' && value !== null ? (
            // Mostrar solo los campos interesantes del juego
            <div>
              <div><b>ID:</b> {value.id}</div>
              <div><b>Nombre:</b> {value.nombre}</div>
              <div><b>Dispositivo:</b> {value.dispositivo}</div>
              <div><b>Plataforma:</b> {value.plataforma?.nombre}</div>
              <div><b>Precio:</b> {value.precio} €</div>
              {/* Puedes añadir aquí más campos si lo ves útil */}
            </div>
          ) : (
            typeof value === 'object' && value !== null
              ? JSON.stringify(value)
              : value
          )}
        </td>
      ))}
                          <td className="border border-gray-300 px-2 py-1">
                            <div className="flex gap-2">
                              {/* Tablet/Desktop: iconos en tablet, texto en desktop */}
                              <button
                                className="desktop:hidden tablet:inline bg-yellow-500 text-white px-3 py-1 rounded hidden items-center justify-center [transition:.3s]"
                                onClick={e => { e.stopPropagation(); setEditData(item); setIsEditing(true); }}
                                aria-label="Editar"
                              >
                                <FaEdit className="desktop:hidden tablet:inline" />
                              </button>
                              <button
                                className="bg-yellow-500 text-white px-3 py-1 rounded hidden desktop:inline tablet:hidden [transition:.3s]"
                                onClick={e => { e.stopPropagation(); setEditData(item); setIsEditing(true); }}
                              >
                                Editar
                              </button>
                              <button
                                className="desktop:hidden tablet:inline bg-red-500 text-white px-3 py-1 rounded hidden items-center justify-center [transition:.3s]"
                                onClick={e => { e.stopPropagation(); handleDelete(item.id); }}
                                aria-label="Eliminar"
                              >
                                <FaTrash className="desktop:hidden tablet:inline" />
                              </button>
                              <button
                                className="bg-red-500 text-white px-3 py-1 rounded hidden desktop:inline tablet:hidden [transition:.3s]"
                                onClick={e => { e.stopPropagation(); handleDelete(item.id); }}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Móvil */}
                <div className="flex flex-col gap-4 min-[761px]:hidden">
                  {filteredData.map((item) => (
                    <div key={item.id} className="bg-white rounded shadow p-3 flex flex-col gap-2 text-black [transition:.3s]">
                      <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
                        <span className="font-bold">{item.nombre || "Nombre no disponible"}</span>
                        <div className="flex gap-2">
                          <button
                            className="text-yellow-500"
                            onClick={() => { setEditData(item); setIsEditing(true); }}
                            aria-label="Editar"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            className="text-red-500"
                            onClick={() => handleDelete(item.id)}
                            aria-label="Eliminar"
                          >
                            <FaTrash size={18} />
                          </button>
                        </div>
                      </div>
                      {/* Campos adicionales */}
                      {Object.entries(item).filter(([key]) => key !== 'nombre').map(([key, value]) => (
  <div key={key} className="flex justify-between bg-[#d8d8d832] rounded p-2">
    <span className="text-sm">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
    <span className="text-sm break-all">
      {activeTab === 'carrito' && key === 'juego' && typeof value === 'object' && value !== null ? (
        <div>
          <div><b>ID:</b> {value.id}</div>
          <div><b>Nombre:</b> {value.nombre}</div>
          <div><b>Dispositivo:</b> {value.dispositivo}</div>
          <div><b>Plataforma:</b> {value.plataforma?.nombre}</div>
          <div><b>Precio:</b> {value.precio} €</div>
        </div>
      ) : (
        typeof value === 'object' && value !== null
          ? JSON.stringify(value)
          : value
      )}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Modales */}
{isAdding && (
  <Modal onClose={() => setIsAdding(false)}>
    <div className="max-h-[80vh] overflow-y-auto p-2">
      <Formulario
        onSubmit={(data) => {
          handleAdd(data); // Pasar solo un argumento
          setIsAdding(false);
        }}
        activeTab={activeTab}
        allGames={allGamesForClaves}
        categorias={categorias} plataformas={plataformas} editoriales={editoriales} desarrolladores={desarrolladores}
      />
    </div>
  </Modal>
)}

{isEditing && (
  <Modal onClose={() => setIsEditing(false)}>
    <div className="max-h-[80vh] overflow-y-auto p-2">
      <Formulario
        initialData={editData}
        onSubmit={(data) => {
          handleEdit({ ...editData, ...data }); // Pasar solo un argumento
          setIsEditing(false);
        }}
        activeTab={activeTab}
        allGames={allGamesForClaves}
        categorias={categorias} plataformas={plataformas} editoriales={editoriales} desarrolladores={desarrolladores}
      />
    </div>
  </Modal>
)}
              </div>
            </main>
          </div>
        </>
      ) : (
        <p>No se encontró el usuario</p>
      )}
    </>
  );
};

export default Page;