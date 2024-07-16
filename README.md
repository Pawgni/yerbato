# Aplikacja E-commerce Yerbato z Chatbotem

## Spis treści

- [Wstęp](#wstęp)
- [Funkcje](#funkcje)
- [Technologie](#technologie)
- [Screenshots](#screenshots)
- [Instalacja i konfiguracja](#instalacja-i-konfiguracja)
- [Użytkowanie](#użytkowanie)
- [Wkład w projekt](#wkład-w-projekt)
- [Licencja](#licencja)
- [Kontakt](#kontakt)

## Wstęp

Yerbato to aplikacja e-commerce zaprojektowana, aby zapewnić doświadczenie zakupowe dla entuzjastów yerba mate. Zbudowana z wykorzystaniem stosu MERN (MongoDB, Express.js, React, Node.js) i zintegrowana z API OpenAI dla funkcjonalności chatbota, Yerbato oferuje funkcje zarówno dla użytkowników, jak i administratorów.

## Funkcje

- **Rejestracja i logowanie**
- **Odzyskiwanie hasła**
- **Panel użytkownika**
- **Panel administratora**
- **Zarządzanie produktami**
- **Strona główna**
- **Chatbot**
- **Szczegóły produktu**
- **Wyszukiwanie i filtrowanie**
- **Koszyk**
- **Zamówienia**

## Technologie

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Baza danych**: MongoDB
- **Chatbot**: API OpenAI
- **Autoryzacja**: JSON Web Tokens (JWT)
- **Stylizacja**: CSS, Bootstrap
  
## Screenshots

**Strona główna**
!(Screenshots/yerbator_wyswietl.png)

**Szczegóły**
!(Screenshots/szczegoly.png)

**Szukanie i filtrowanie**
!(Screenshots/szukanie_i_filtrowanie.png)

**Koszyk**
!(Screenshots/koszyk.png)

**Chat Odpowiedzi**
!(Screenshots/yerbatopoprawne.jpg)

**Chat Odpowiedzi**
!(Screenshots/yerbatobledne.jpg)

**Panel Administratora**
!(Screenshots/panelAdministratora.png)

**Panel Użytkownika**
!(Screenshots/uzytkownik_panel.png)

**Oceny i opinie**
!(Screenshots/oceny_i_opinie.png)

**Logowanie**
!(Screenshots/logowanie.png)

**Rejestracja**
!(Screenshots/Rejestracja.png)

**Lista produktów**
!(Screenshots/Produkty_listy.png)


## Instalacja i konfiguracja

### Wymagania wstępne

- Node.js
- npm lub yarn
- MongoDB

### Kroki

1. **Sklonuj repozytorium**:
    ```bash
    git clone https://github.com/Pawgni/yerbato.git
    cd yerbato
    ```

2. **Zainstaluj zależności**:
    ```bash
    npm install
    ```

3. **Ustaw zmienne środowiskowe**:
    Utwórz plik `.env` w katalogu głównym i dodaj:
    ```env
    MONGO_URI=twoj_mongodb_connection_string
    JWT_SECRET=twoj_jwt_secret
    ```

4. **Ustaw klucz API OpenAI**:
    - Otwórz `client/src/components/ChatAssistant.jsx`.
    - Zamień `your_openai_api_key_here` na swój rzeczywisty klucz API OpenAI.

5. **Uruchom aplikację**:
    ```bash
    npm run dev
    ```

Aplikacja uruchomi się na `http://localhost:3000`.

## Użytkowanie

### Rejestracja i logowanie

- Zarejestruj nowe konto lub zaloguj się przy użyciu istniejących danych.
- Użyj panelu użytkownika, aby zaktualizować swoje dane osobowe i przeglądać historię zamówień.

### Panel administratora

- Zaloguj się jako administrator, aby zarządzać użytkownikami, produktami, zamówieniami i opiniami.

### Zakupy i zamówienia

- Przeglądaj produkty na stronie głównej.
- Użyj funkcji wyszukiwania i filtrowania, aby znaleźć konkretne przedmioty.
- Dodawaj przedmioty do koszyka i przejdź do realizacji zamówienia.
- Przeglądaj historię zamówień i śledź status swoich zamówień.

### Chatbot

- Użyj zintegrowanego chatbota, aby uzyskać pomoc i zapytania dotyczące produktów i zamówień.

## Wkład w projekt

Zapraszamy do współpracy! Proszę postępować zgodnie z poniższymi krokami:

1. Sforkuj repozytorium.
2. Utwórz nową gałąź (`git checkout -b feature-branch`).
3. Wprowadź swoje zmiany.
4. Zatwierdź swoje zmiany (`git commit -m 'Add new feature'`).
5. Wypchnij na gałąź (`git push origin feature-branch`).
6. Otwórz Pull Request.

## Kontakt

W razie pytań lub potrzeby wsparcia, proszę kontaktować się pod adresem pawelgniew02@gmail.com

