'use client';
import { signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Login() {
    const [mensaje, setMensaje] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
 
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result.ok) {
        setMensaje("Esta logueado");
    } else {
        console.log(result);

      alert('Login failed');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input name="email" type="email" />
        <label>Password</label>
        <input name="password" type="password" />
        <button type="submit">Login</button>
      </form>
      <div>
        {mensaje ? <p>{mensaje}</p> : ""}
      </div>
    </div>

  );
}