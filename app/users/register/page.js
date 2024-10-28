'use client';
import { useEffect, useState } from 'react';
import { register } from '../../../lib/queryFuntion';
import { useRouter } from "next/navigation";
export default function Login() {
  const [message, setMessage] = useState(false);

  const router = useRouter();  

  const handleSubmit = async (e) => {
        e.preventDefault();
        const firstName = e.target.first_name.value;
        const lastName = e.target.last_name.value;
        const dni  = e.target.dni.value;
        const email = e.target.email.value;
        const password = e.target.password.value;

        const result = await register( firstName, lastName, dni ,  email, password );

        if (result.ok) {
            //setMensaje("Esta Registrado");
            router.push("/users/confirmaction");
        } else {
            console.log("result: ", result);

            setMessage(result.error);
        }
    };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First name: </label>
          <input name="first_name" type="text" />
          <label>Last name: </label>
          <input name="last_name" type="text" />
          <label>DNI: </label>
          <input name="dni" type="text" />
        </div>
        <br />
        <div>
          <label>Email: </label>
          <input name="email" type="email" />
          <label>Password: </label>
          <input name="password" type="password" />
        </div>
        <button type="submit">Registro</button>
      </form>
      <div>
        {message ? <p>{message}</p> : ""}
      </div>
    </div>
  );
}