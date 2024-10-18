'use client';
import { useEffect, useState } from 'react';
import {tokenMail} from '../../../lib/sendMail';

export default function Login() {
    const [mensaje, setMensaje] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        //const password = e.target.password.value;
        try{
          const result = await tokenMail(email);
          console.log("Token: ", result);

          if (result.ok) {
              setMensaje("Token mail");
          } else {

            setMensaje('Token false 1');
          }
        }catch(error){

          setMensaje("Token false 2");

        }        
    };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input name="email" type="email" />
        <button type="submit">Token</button>
      </form>
      <div>
        {mensaje ? <p>{mensaje}</p> : ""}
      </div>
    </div>
  );
}