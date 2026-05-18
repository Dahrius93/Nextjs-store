# Prisma v7 — Differenze rispetto alla guida del corso

Questo file documenta le modifiche necessarie per far funzionare Prisma **v7** con Supabase e Next.js, rispetto alle istruzioni originali del corso scritte per Prisma v6.

---

## Il problema

La guida nel README segue il setup classico di Prisma (v5/v6). Installando `prisma@latest` si ottiene la **versione 7**, che ha introdotto breaking changes nel modo in cui il client si connette al database.

Errore che si manifesta:

```
Error: `PrismaClient` needs to be constructed with a non-empty, valid `PrismaClientOptions`
```

---

## Cosa cambia in Prisma v7

### 1. `npx prisma init` genera `prisma.config.ts`

In v7, l'inizializzazione crea un file `prisma.config.ts` nella root del progetto, che diventa il punto centrale di configurazione per la **CLI** (migrate, db push, studio):

```ts
// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

### 2. `url` e `directUrl` vengono rimossi da `schema.prisma`

Nel README il datasource era:

```prisma
// Prisma v5/v6 — NON funziona in v7
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

In Prisma v7 queste proprietà **non sono più supportate** nello schema. Il datasource diventa:

```prisma
// Prisma v7
datasource db {
  provider = "postgresql"
}
```

### 3. `PrismaClient` richiede un adapter nel costruttore

In v6, `new PrismaClient()` senza argomenti leggeva automaticamente `DATABASE_URL` dall'ambiente. In v7 questo non funziona più: il client **deve ricevere esplicitamente un adapter** per sapere come connettersi.

```ts
// Prisma v5/v6 — NON funziona in v7
const prismaClientSingleton = () => {
  return new PrismaClient();
};
```

---

## Cosa è stato necessario modificare

### Pacchetti da installare

```bash
npm install @prisma/adapter-pg pg
npm install --save-dev @types/pg
```

- `pg`: driver nativo PostgreSQL per Node.js
- `@prisma/adapter-pg`: adapter ufficiale Prisma per connettere `PrismaClient` tramite `pg`

### `utils/db.ts` aggiornato

```ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prismaClientSingleton = () => {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

Il pattern singleton rimane identico — cambia solo come viene creato il client.

### `.env` — solo `DATABASE_URL` è necessaria

```bash
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"
```

`DIRECT_URL` non è più necessaria in modalità sviluppo con Prisma v7, perché la connessione passa direttamente dall'adapter `pg`.

---

## Riepilogo comandi — cosa rimane uguale

```bash
# Sincronizza lo schema con il database (senza migration)
npx prisma db push

# Visualizza i dati nel browser
npx prisma studio

# Crea una migration formale
npx prisma migrate dev --name init

# Rigenera il client dopo modifiche allo schema
npx prisma generate
```

---

## Architettura della connessione

```
Prisma v6:
  schema.prisma (url) → PrismaClient() → Database

Prisma v7:
  .env (DATABASE_URL)
       ↓
  prisma.config.ts → CLI Prisma (migrate, db push, studio)
  
  .env (DATABASE_URL)
       ↓
  PrismaPg adapter → PrismaClient({ adapter }) → Database
```

In v7 i due percorsi (CLI e runtime) sono separati e indipendenti.
