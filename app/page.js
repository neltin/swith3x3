import { getTabla } from "../lib/queryFuntion";

export default async function Page({ params: { slug } }) {
  const campeones = await getTabla();
  //console.log(campeones);
  return (
    <div>
      {campeones.map(campeon => (
        <div key={campeon.id}>Equipo: {campeon.nombre}</div>
      ))}
    </div>
  );
}
