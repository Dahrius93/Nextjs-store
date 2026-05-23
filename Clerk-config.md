# Setup Clerk Authentication — Next.js (App Router)

**Progetto:** Nextjs-Store (Udemy)
**Data:** 23 Maggio 2026
**Clerk SDK:** `@clerk/nextjs@5.7.6`

---

## Contesto

Il corso Udemy segue il vecchio approccio manuale per installare Clerk (install SDK → copia chiavi API → crea middleware a mano). Clerk ha introdotto una **CLI dedicata** che automatizza l'intero processo. Di seguito i passi aggiornati e le correzioni applicate.

---

## Passi di installazione

### 1. Installare la Clerk CLI

```bash
npm install -g clerk
```

### 2. Autenticarsi

```bash
clerk auth login
```

Si apre il browser per il login (es. via GitHub).

### 3. Inizializzare Clerk nel progetto

```bash
clerk init
```

La CLI rileva automaticamente il framework (Next.js) e il package manager dal lockfile. Esegue:

- Installazione di `@clerk/nextjs`
- Creazione del file `middleware.ts`
- Configurazione delle variabili d'ambiente nel file `.env`
- Aggiunta del provider nel layout

> **Nota sul ClerkProvider:** il corso Udemy indica di wrappare manualmente il layout con `<ClerkProvider>`. Con la CLI questo passaggio è già fatto automaticamente. Inoltre nelle versioni più recenti il componente non si chiama più `ClerkProvider` — la CLI inserisce direttamente il provider corretto nel `layout.tsx`, quindi non serve toccare nulla.

> **Nota sulle agent skills:** la CLI chiede se installare le _agent skills_ (file markdown con best practices per assistenti AI). Sono opzionali e non influiscono sul funzionamento.

### 4. Aggiungere il matcher per il proxy Clerk

Dopo `clerk init`, aprire `middleware.ts` e aggiungere `'/__clerk/(.*)'` nell'array `config.matcher`:

```typescript
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)", // ← aggiungere questa riga
  ],
};
```

### 5. Verificare il setup

```bash
clerk doctor
```

### 6. Avviare il progetto

```bash
npm run dev
```

---

## Bug fix: `auth.protect is not a function`

### Problema

La CLI genera il middleware con la sintassi di **Clerk v6+**, ma il progetto usa `@clerk/nextjs@5.7.6`. Il middleware generato era:

```typescript
// Sintassi v6 — NON funziona con v5.x
export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});
```

L'errore restituito:

```
TypeError: auth.protect is not a function
```

### Causa

In **v5**, `auth` è una **funzione** che va invocata con `()` per ottenere l'oggetto con `.protect()`. In **v6**, `auth` è già l'oggetto direttamente. Inoltre in v5 il callback non è `async`.

### Soluzione

Sostituire il middleware con la sintassi corretta per v5 (callback sincrono, `auth()` come funzione):

```typescript
export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth().protect();
  }
});
```

> Vedi la sezione **Configurazione delle rotte pubbliche** per il middleware finale completo con tutte le rotte.

**Differenze chiave v5 vs v6:**

| Aspetto                       | v5 (`5.x`)                    | v6 (`6.x`)                 |
| ----------------------------- | ----------------------------- | -------------------------- |
| Callback                      | sincrono                      | `async`                    |
| `auth`                        | funzione → `auth().protect()` | oggetto → `auth.protect()` |
| `auth()` in Server Components | sincrono                      | `await auth()`             |

---

## Configurazione delle rotte pubbliche

### Problema

Di default, `clerk init` genera il middleware con solo `/sign-in` e `/sign-up` come rotte pubbliche. Questo significa che tutte le altre pagine (homepage, prodotti, about, ecc.) richiedono autenticazione e l'utente viene bloccato prima ancora di poter navigare.

Inoltre, è fondamentale che anche le rotte di sign-in e sign-up restino pubbliche: se vengono protette, il redirect stesso verso la pagina di login viene bloccato dal middleware, creando un loop.

### Soluzione

Aggiungere tutte le rotte che devono essere accessibili senza autenticazione nell'array di `createRouteMatcher`:

```typescript
const isPublicRoute = createRouteMatcher([
  "/", // homepage
  "/products(.*)", // catalogo prodotti
  "/about", // pagina about
  "/sign-in(.*)", // login (necessario per evitare loop sul redirect)
  "/sign-up(.*)", // registrazione
]);
```

### Middleware finale completo

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/products(.*)",
  "/about",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
```

---

## Componenti di autenticazione nel layout

Per aggiungere i controlli di sign-in/sign-up nella navbar:

```tsx
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

<>
  <Show when="signed-out">
    <SignInButton />
    <SignUpButton />
  </Show>
  <Show when="signed-in">
    <UserButton />
  </Show>
</>;
```

---

## Riferimenti

**Nota su `.env` vs `.env.local`:** il corso Udemy fa creare manualmente `.env.local` con le chiavi API. La CLI invece scrive le variabili in `.env`. Per Next.js funzionano entrambi (`.env.local` ha priorità). Non serve rinominare il file, ma assicurarsi che sia nel `.gitignore`.

- [Clerk CLI Docs](https://clerk.com/docs/cli)
- [Next.js Quickstart](https://clerk.com/docs/nextjs/getting-started/quickstart)
- [Clerk Dashboard](https://dashboard.clerk.com/)
