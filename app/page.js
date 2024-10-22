import { getTabla } from "../lib/queryFuntion";

export default async function Page({ params: { slug } }) {
  const posiciones = await getTabla();


  
  //console.log(campeones);
  return (
    <div>
      <p>Posicion:</p>
      <br/>
      <ul>
      {posiciones.map(p => (
        <li key={p.id}>{p.position}</li>
      ))}
      </ul>
    </div>
  );
}
