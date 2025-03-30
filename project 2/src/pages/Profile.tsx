import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Pencil, Check } from 'lucide-react';
import { LazyImage } from '../components/LazyImage';

export function Profile() {
  const { user } = useAuth();
  const [interests, setInterests] = useState(['Categoría', 'Categoría', 'Categoría', 'Categoría_extend']);

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-6">Editar datos</h1>

      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="relative">
          <LazyImage
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto"
          />
          <button className="absolute bottom-0 right-1/2 translate-x-8 translate-y-2 p-2 bg-pink-100 rounded-full">
            <Pencil className="w-4 h-4 text-pink-500" />
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Nombre</label>
            <div className="relative">
              <input
                type="text"
                value="Lucía Gómez López"
                className="w-full p-3 border rounded-lg pr-10"
              />
              <Check className="absolute right-3 top-3 w-5 h-5 text-green-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Usuario</label>
            <div className="relative">
              <input
                type="text"
                value="@LuciaGLopez"
                className="w-full p-3 border rounded-lg pr-10"
              />
              <Check className="absolute right-3 top-3 w-5 h-5 text-green-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Biografía</label>
            <textarea
              placeholder="Máximo 250 caracteres"
              className="w-full p-3 border rounded-lg h-24"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Intereses</label>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                  <span className="text-sm">{interest}</span>
                  <button className="ml-2 text-gray-500">&times;</button>
                </div>
              ))}
              <button className="p-2 bg-pink-100 rounded-full">
                <span className="text-pink-500 text-xl">+</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Fecha de nacimiento</label>
            <input
              type="text"
              placeholder="dd/mm/aaaa"
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Documento de identidad</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Número del documento"
                className="w-full p-3 border rounded-lg pr-10"
              />
              <Pencil className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Sexo</label>
            <div className="relative">
              <input
                type="text"
                value="Femenino"
                className="w-full p-3 border rounded-lg pr-10"
              />
              <Check className="absolute right-3 top-3 w-5 h-5 text-green-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Ciudad de residencia</label>
            <input
              type="text"
              placeholder="Elige tu ciudad"
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Teléfono</label>
            <input
              type="tel"
              placeholder="Ingresa tu teléfono"
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Correo electrónico</label>
            <div className="relative">
              <input
                type="email"
                value="luciajugadora@gmail.com"
                className="w-full p-3 border rounded-lg pr-10"
              />
              <Check className="absolute right-3 top-3 w-5 h-5 text-green-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Contraseña</label>
            <div className="relative">
              <input
                type="password"
                value="xxxxxxxxxxxxx"
                className="w-full p-3 border rounded-lg pr-10"
              />
              <Check className="absolute right-3 top-3 w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}