# Proba-IT-2024-CopyPasta

## Resurse utilizate
- ### Baza de date: MySql
- ### Backend: Prisma + Express + NodeMailer + TypeScript
- ### Frontend: React + Tailwind + TypeScript
## Mod utiliazare
- Backend-ul trebuie pornit din folderul Backend folosind
```bash
npx ts-node api.ts
```
- Pe partea de frontend trebuie compilat Tailwind:
```bash
npx tailwindcss -i ./src/index.css -o ./src/output.css --watch
```
S-ar putea cateodata sa fie nevoie de resalvarea fisierelor care contin tailwind
- Trebuie pornit si serverul de React:
```bash
rm -rf node_modules/.vite
npm run dev
```

## Scopul meu
Scopul meu in acest proiect a fost sa ofer cat mai multe functionalitati clientului. In acest sens am facut anumite modificari designului atunci cand am considerat ca ar imbunatati functionalitatea site-ului
## Lucruri noi
In acest proiect am folosit resurse pe care a trebuit sa le invat precum:
- NodeMailer
- React
- Prisma
## Ce as mai fi facut
Desi am reusit sa leg Frontend-ul si Backend-ul, nu am avut timp sa prezint clientului erorile din backend in Frontend\
De asemenea, as mai fi lucrat la responsiveness
## Challange-uri
Majoritatea challange-urilor pe care le-am intalnit pe langa folosirea unor frameworkuri noi au fost:
- Salvarea imaginilor:\
In final am decis sa salvez imaginile local, folosind ***'multer'***, dar am considerat si salvarea in baza de date in format base64\
Multer se ocupa de majoritatea complexitatii, dar am avut probleme cu routingul si imaginile default
- Cookie-uri:\
Am avut o mare problema cu cookie-urile deoarece fiind backendul si frontendul pe ipuri diferite, majoritatea browserelor blocheaza cookieuri create pentru un alt ip.\
Aici am folosit resursa express-cors si un middleware care sa trimita headere in acest sens
