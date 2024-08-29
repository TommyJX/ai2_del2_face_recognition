# AI Vision - Bild- och Känsloanalys i Realtid

Detta projekt är en del av min kunskapskontroll i AI 2, del 2. Projektet handlar om att skapa en realtidsklassificerare för ansiktsuttryck med hjälp av neurala nätverk. Förutom att följa instruktionerna för programmeringsuppgiften har jag utökat projektet genom att utveckla en frontend för att göra systemet mer användarvänligt och presentabelt.

## Funktioner

- **Realtidsanalys av ansiktsuttryck:** Med hjälp av en kamera kan systemet identifiera och klassificera ansiktsuttryck i realtid.
- **Bilduppladdning:** Användare kan ladda upp en bild för att få ansiktsuttrycket analyserat.
- **Visualisering:** Analyseresultaten visas direkt på bilden eller videoströmmen, med förutsägelser om ålder, kön och känslomässig status.

## Teknologier och Verktyg

### Backend
- **Flask:** En micro webbramverk för Python som används för att skapa API:t som frontend använder för att skicka bilder och få analyseresultaten.
- **TensorFlow & Keras:** Används för att skapa och träna de neurala nätverken.
- **OpenCV:** Används för bildbehandling och realtidsvideoströmning.
- **MediaPipe:** Används för ansiktsdetektering.
- **Gunicorn:** En WSGI HTTP-server som kör Flask-applikationen i produktionsmiljö.

### Frontend
- **React.js:** Används för att bygga en användarvänlig och dynamisk frontend.
- **CSS:** För att skapa en responsiv och attraktiv användargränssnitt.

## Installation och Användning

### Backend

1. **Klona projektet:**
   ```bash
   git clone https://github.com/TommyJX/ai2_del2_face_recognition.git
   cd Server/api
   ```

2. **Installera beroenden:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Kör applikationen lokalt:**
   ```bash
   gunicorn app:app
   ```

### Frontend

1. **Klona frontend-repositoryt (om det är separat):**
   ```bash
   git clone https://github.com/TommyJX/ai2_del2_face_recognition.git
   cd Client/
   ```

2. **Installera beroenden:**
   ```bash
   npm install
   ```

3. **Kör frontend-applikationen:**
   ```bash
   npm start
   ```

### Distribution

Applikationen är distribuerad via Render, både frontend och backend är live och kan nås via följande URL:er:

- **Frontend:** [https://ai-vision.onrender.com](https://ai-vision.onrender.com)
- **Backend:** [https://ai-vision-backend.onrender.com](https://ai-vision-backend.onrender.com)

## Projektets Struktur

- **Server/:** Innehåller all backend-kod.
- **Client/src/:** Innehåller all frontend-kod.

## Författare

- Namn: Tommy Wang

## Kursinformation
- Skola: NBI/Handelsakademin
- Kurskod: OPA23MA_AI 2 - del 2
- Kursadministratör: Antonio Prgomet