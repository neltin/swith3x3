"use client";
import { useSession } from "next-auth/react";


export default function UserInfo() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Cargando...</p>;
  if (!session) return <p>No has iniciado sesión.</p>;



  // Puedes agregar más campos según lo que tengas en session.user
  return (
    <div>
      <h2>Información del usuario</h2>
      <ul>
        <li><strong>Email:</strong> {session.user.email}</li>
        <li><strong>Nombre:</strong> {session.user.name || "No disponible"}</li>
        {/* Si agregaste el id en el callback de NextAuth */}
        <li><strong>ID:</strong> {session.id || "No disponible"}</li>
        {/* Puedes mostrar más datos si los tienes */}
      </ul>
    </div>
  );
}