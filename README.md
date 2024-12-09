# Proba-IT-2024-CopyPasta
## Resurse utilizate
- **Baza de date:** MySQL
- **Backend:** Prisma, Express, NodeMailer, TypeScript
- **Frontend:** React, Tailwind CSS, TypeScript
  
## Mod de utilizare
- Versiune Node 18.20.5
- Toate resursele node trebuie instalate
- Backend-ul trebuie pornit din folderul *Backend* folosind comanda:
  ```bash
  npx ts-node api.ts
  ```
- Pentru frontend, este necesară compilarea Tailwind CSS:
  ```bash
  npx tailwindcss -i ./src/index.css -o ./src/output.css --watch
  ```
  În unele cazuri, poate fi necesar să resalvați fișierele care conțin cod Tailwind CSS.

- Pornirea serverului React:
  ```bash
  rm -rf node_modules/.vite
  npm run dev
  ```

## Scopul proiectului
Scopul meu în acest proiect a fost să ofer cât mai multe funcționalități clientului. În acest sens, am realizat modificări ale designului atunci când am considerat că acestea ar îmbunătăți funcționalitatea site-ului.

## Lucruri noi învățate
Pe parcursul proiectului, am învățat să folosesc următoarele resurse:
- NodeMailer
- React
- Prisma

## Ce aș mai fi dorit să implementez
- Deși am reușit să conectez Frontend-ul cu Backend-ul, nu am avut timp să afișez erorile din Backend în Frontend.
- Aș fi dorit, de asemenea, să lucrez mai mult la *responsiveness*.

## Provocări întâlnite
Majoritatea provocărilor au fost legate de utilizarea unor framework-uri noi și de probleme tehnice precum:

1. **Salvarea imaginilor**
   - În final, am decis să salvez imaginile local, utilizând ***multer***. De asemenea, am luat în considerare și salvarea acestora în baza de date în format base64.
   - ***Multer*** a simplificat gestionarea imaginilor, însă am întâmpinat probleme legate de rutare și de imaginile *default*.

2. **Cookie-uri**
   - Am întâmpinat dificultăți majore cu gestionarea cookie-urilor, deoarece, fiind Backend-ul și Frontend-ul pe adrese IP diferite, majoritatea browserelor blochează cookie-urile setate pentru un alt IP.
   - Am utilizat pachetul ***express-cors*** și un *middleware* pentru a adăuga header-uri necesare în acest sens.
