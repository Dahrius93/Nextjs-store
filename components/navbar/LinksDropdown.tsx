import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LuAlignLeft } from "react-icons/lu";
import Link from "next/link";
import { Button } from "../ui/button";
import { links } from "@/utils/links";
import UserIcon from "./UserIcon";
import SignOutLink from "./SignOutLink";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";

function LinksDropdown() {
  return (
    // DropdownMenu: componente shadcn/ui che crea il menu a discesa
    <DropdownMenu>
      {/* Trigger: elemento che scatena l'apertura del menu (hamburger + avatar utente) */}
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex gap-4 max-w-[100px]">
          {/* LuAlignLeft: icona hamburger menu */}
          <LuAlignLeft className="w-6 h-6" />
          {/* UserIcon: componente custom che mostra avatar o icona utente */}
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      {/* DropdownMenuContent: contenitore dei menu items */}
      <DropdownMenuContent className="w-48" align="start" sideOffset={10}>
        {/* SignedOut: mostra questo contenuto solo se l'utente NON è autenticato */}
        <SignedOut>
          {/* SignInButton: bottone login da Clerk (mode="modal" apre un modal) */}
          <DropdownMenuItem>
            <SignInButton mode="modal">
              <button className="w-full text-left">Login</button>
            </SignInButton>
          </DropdownMenuItem>
          {/* DropdownMenuSeparator: linea divisoria nel menu */}
          <DropdownMenuSeparator />
          {/* SignUpButton: bottone registrazione da Clerk */}
          <DropdownMenuItem>
            <SignUpButton mode="modal">
              <button className="w-full text-left">Register</button>
            </SignUpButton>
          </DropdownMenuItem>
        </SignedOut>
        {/* SignedIn: mostra questo contenuto solo se l'utente È autenticato */}
        <SignedIn>
          {/* Ciclo sui link disponibili per gli utenti loggati */}
          {links.map((link) => {
            return (
              <DropdownMenuItem key={link.href}>
                {/* Link: componente Next.js per navigazione client-side */}
                <Link href={link.href} className="capitalize w-full">
                  {link.label}
                </Link>
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          {/* SignOutLink: componente custom per il logout */}
          <DropdownMenuItem>
            <SignOutLink />
          </DropdownMenuItem>
        </SignedIn>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default LinksDropdown;
