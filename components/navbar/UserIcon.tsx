import { LuUser } from "react-icons/lu";
import { currentUser /*auth*/ } from "@clerk/nextjs/server";
import { profile } from "console";

// Componente server-side che mostra l'avatar o icona dell'utente
async function UserIcon() {
  // userId si usa nel caso in cui volessimo fare un fetch
  // in base all'id dell'utente
  // const {userId} = auth();

  // Ottiene l'oggetto completo dell'utente autenticato da Clerk
  const user = await currentUser();

  // Estrae l'URL della foto profilo dall'utente (imageUrl è una proprietà di Clerk)
  const profileImage = user?.imageUrl;

  // Se esiste un'immagine, la mostra come avatar
  if (profileImage) {
    return (
      <img src={profileImage} className="w-6 h-6 rounded-full object-cover" />
    );
  }
  // Altrimenti mostra l'icona di default
  return <LuUser className="w-6 h-6 bg-primary rounded-full text-white" />;
}

export default UserIcon;
