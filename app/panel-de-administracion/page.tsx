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
  const [activeTab, setActiveTab] = useState('juegos'); // Tab activa
  const [data, setData] = useState<TableItem[]>([]); // Datos de la tabla activa
  const [selectedItem, setSelectedItem] = useState<any | null>(null); // Registro seleccionado
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda
  const [isAdding, setIsAdding] = useState(false); // Mostrar formulario de añadir
  const [isEditing, setIsEditing] = useState(false); // Mostrar formulario de edición
  const [editData, setEditData] = useState<any | null>(null); // Datos para editar
  const [categorias, setCategorias] = useState<categoria[]>([]);
  const [plataformas, setPlataformas] = useState<plataforma[]>([]);
  const [editoriales, setEditoriales] = useState<editorial[]>([]);
  const [desarrolladores, setDesarrolladores] = useState<desarrollador[]>([]);
  

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
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUsuarios();
        const currentUser = data.find((u: users) => u.email === session?.user?.email);
        setUser(currentUser || null);
      } catch (err) {
        console.log(err);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

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
      if (!activeTab) {
        throw new Error('No se ha seleccionado una tabla activa');
      }
      const requiredFields = Object.keys(placeholders[activeTab] || {});
      for (const field of requiredFields) {
        if (!newItem[field]) {
          throw new Error(`El campo "${field}" es obligatorio`);
        }
      }
      const formattedItem = { ...newItem };
      if (activeTab === 'users' && formattedItem.password) {
        formattedItem.password = await bcrypt.hash(formattedItem.password, 10);
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
        arrayFields.forEach((field) => {
          if (formattedItem[field] && typeof formattedItem[field] === 'string') {
            formattedItem[field] = formattedItem[field].split(',').map((item: string) => item.trim());
          }
        });
      }
      if (activeTab === 'users' && formattedItem.password) {
        formattedItem.password = await bcrypt.hash(formattedItem.password, 10);
      }
      const { id, ...dataToSend } = formattedItem;
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${activeTab}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`,
        },
        body: JSON.stringify(dataToSend),
      });
      if (!res.ok) {
        throw new Error('Error al agregar el registro');
      }
      const updatedData = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${activeTab}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });
      const result = await updatedData.json();
      setData(result);
      setIsAdding(false);
    } catch (error) {
      console.error('Error al agregar el registro:', error);
    }
  };

  const handleEdit = async (updatedItem: any) => {
    try {
      if (!activeTab) {
        throw new Error('No se ha seleccionado una tabla activa');
      }
      if (activeTab === 'carrito') {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/carrito/admin/${updatedItem.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.token}`,
          },
          body: JSON.stringify({ cantidad: updatedItem.cantidad }),
        });
        if (!res.ok) {
          throw new Error('Error al actualizar la cantidad');
        }
        const updatedData = await res.json();
        setData((prevData) =>
          prevData.map((item) => (item.id === updatedData.id ? updatedData : item))
        );
        setIsEditing(false);
        setEditData(null);
        return;
      }
      const arrayFields = activeTab === 'juegos' ? [
        'descripcion',
        'idiomas',
        'imagen_de_portada',
        'video',
        'requisitos_del_sistema',
        'link',
      ] : [];
      const formattedItem = { ...updatedItem };
      arrayFields.forEach((field) => {
        if (formattedItem[field] && typeof formattedItem[field] === 'string') {
          formattedItem[field] = formattedItem[field].split(',').map((item: string) => item.trim());
        }
      });
      if (activeTab === 'users' && formattedItem.password) {
        formattedItem.password = await bcrypt.hash(formattedItem.password, 10);
      }
      const { id, ...dataToSend } = formattedItem;
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${activeTab}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`,
        },
        body: JSON.stringify(dataToSend),
      });
      if (!res.ok) {
        throw new Error('Error al actualizar el registro');
      }
      const updatedData = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${activeTab}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });
      const result = await updatedData.json();
      setData(result);
      setIsEditing(false);
    } catch (error) {
      console.error('Error al actualizar el registro:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  const Formulario = ({ onSubmit, initialData }: { onSubmit: (data: any) => void; initialData?: any }) => {
    const [formData, setFormData] = useState(initialData || {});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  // Si el campo es uno de los selectores, convierte el valor a número
  if (
    activeTab === 'juegos' &&
    ['categoria', 'plataforma', 'editorial', 'desarrollador'].includes(name)
  ) {
    setFormData({ ...formData, [name]: Number(value) });
  } else {
    setFormData({ ...formData, [name]: value });
  }
};

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Renderizado específico para la tabla "carrito" */}
        {activeTab === 'carrito' ? (
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
          // Renderizado para otras tablas, incluyendo "juegos"
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
  {(key === 'categoria' ? categorias : key === 'plataforma' ? plataformas : key === 'editorial' ? editoriales : desarrolladores).map(
    (option) => (
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
                  {['juegos', 'categorias', 'editoriales', 'desarrolladores', 'plataformas', 'carrito', 'users'].map(
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
          handleAdd(data);
          setIsAdding(false);
        }}
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
          handleEdit({ ...editData, ...data });
          setIsEditing(false);
        }}
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