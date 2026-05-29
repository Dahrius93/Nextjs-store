import Link from "next/link";
import { Button } from "../ui/button";
import { LuLamp } from "react-icons/lu";

function Logo() {
  return (
    // asChild è una proprietà di ShadCn che fa in modo di passare
    // tutte le proprietà del pulsante al figlio (in questo caso un link)
    // in sostanza un link con la forma di un pulsante.

    // altrimenti, senza asChild, sarebbe un pulsante con all'interno un link
    // e non sarebbe valido per l'HTML
    <Button size="icon" asChild>
      <Link href="/">
        <LuLamp className="w-6 h-6" />
      </Link>
    </Button>
  );
}

export default Logo;
