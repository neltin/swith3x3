'use client';
import { useEffect, useState } from 'react';
import { register } from '../../../lib/queryFuntion';

export default function Login() {
  const [mensaje, setMensaje] = useState(false);
  
  const handleSubmit = async (e) => {
        e.preventDefault();
        const firstName = e.target.first_name.value;
        const lastName = e.target.last_name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;

        const result = await register( firstName, lastName,  email, password );

        if (result.ok) {
            setMensaje("Esta Registrado");
            //router.push("/users/confirmaction");
        } else {
            console.log("result: ", result);

            setMensaje(result.error);
        }
    };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label>First name: </label>
        <input name="first_name" type="text" />
        <label>Last name: </label>
        <input name="last_name" type="text" />
        <label>Email: </label>
        <input name="email" type="email" />
        <label>Password: </label>
        <input name="password" type="password" />
        <button type="submit">Registro</button>
      </form>
      <div>
        {mensaje ? <p>{mensaje}</p> : ""}
      </div>
    </div>
  );
}