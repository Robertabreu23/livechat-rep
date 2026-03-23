# LiveChat

Aplicación de chat en tiempo real construida con **React**, **Socket.IO** y **Zustand**. Permite crear salas privadas, unirse a ellas con un ID, chatear en vivo y ver quién está escribiendo.

---

## Tecnologías utilizadas

| Capa | Tecnología |
|------|-----------|
| Frontend | React (Create React App) |
| Estado global | Zustand |
| Comunicación en tiempo real | Socket.IO Client |
| Backend | Node.js + Express + Socket.IO Server |

---

## Estructura del proyecto

```
livechat/
├── src/
│   ├── components/
│   │   ├── SplashScreen.jsx     # Pantalla de carga animada
│   │   ├── Login.jsx            # Registro de nombre de usuario
│   │   ├── Lobby.jsx            # Crear o unirse a una sala
│   │   ├── Sidebar.jsx          # Panel lateral con sala y usuarios
│   │   ├── ChatBox.jsx          # Área de mensajes
│   │   ├── MessageInput.jsx     # Input para enviar mensajes
│   │   └── TypingIndicator.jsx  # Indicador "está escribiendo..."
│   ├── socket/
│   │   └── socket.js            # Instancia singleton de Socket.IO
│   ├── store/
│   │   └── useChatStore.js      # Estado global con Zustand
│   └── App.js                   # Orquestador principal
│
└── server/
    └── src/
        ├── index.js             # Servidor Express + Socket.IO
        ├── config/
        │   └── socket.js        # Inicialización y registro de handlers
        └── handlers/
            ├── userHandlers.js      # Eventos de usuario
            ├── messageHandlers.js   # Eventos de mensajes y salas
            └── typingHandlers.js    # Eventos de escritura
```

---

## Cómo funciona la aplicación

### Flujo general

```
1. SplashScreen  →  animación de 2.6s al iniciar
2. Login         →  el usuario elige su nombre
3. Lobby         →  crea una sala nueva o se une con un ID
4. Chat          →  Sidebar + ChatBox + MessageInput + TypingIndicator
```

### Conexión con el servidor

El cliente **no se conecta automáticamente**. La conexión se abre en el momento exacto que el usuario hace submit en Login:

```js
// socket/socket.js
const socket = io("http://localhost:3001", { autoConnect: false });
```

```js
// Login.jsx — se conecta solo cuando el usuario envía su nombre
socket.connect();
socket.emit("set_username", input.trim());
```

Esto evita conexiones innecesarias de visitantes que no terminan el registro.

---

## Guía de uso

### 1. Levantar el servidor

```bash
cd server
npm install
node src/index.js
# → Servidor corriendo en http://localhost:3001
```

### 2. Levantar el cliente

```bash
# en la raíz del proyecto
npm install
npm start
# → App en http://localhost:3000
```

### 3. Usar la app

1. Al abrir aparece la **splash screen** animada (~2.6 segundos).
2. Escribe tu **nombre de usuario** y presiona Entrar.
3. En el **Lobby** elige una opción:
   - **Crear sala** → se genera un ID de 6 caracteres (ej: `AB12CD`). Cópialo y compártelo.
   - **Unirse a sala** → pega el ID que alguien te compartió.
4. Ya dentro del chat puedes **enviar mensajes** y ver en tiempo real quién está escribiendo.
5. El **ID de la sala** aparece en el sidebar con un botón para copiarlo y compartirlo en cualquier momento.

---

## Componentes del frontend

### `SplashScreen.jsx`

Pantalla de presentación que se muestra al cargar la app. Dura **2.6 segundos** en total:

- A los **2.0s** arranca la animación de fade-out (`splash-fade`).
- A los **2.6s** llama a `onDone()` y cede el control a `App.js`.

Contiene un SVG de burbuja de chat construido a mano con gradientes y tres puntos animados con CSS (`dot1`, `dot2`, `dot3`), más una barra de progreso.

---

### `Login.jsx`

Formulario simple de entrada. Al hacer submit:

1. Conecta el socket (`socket.connect()`).
2. Emite `set_username` con el nombre ingresado.
3. Escucha una sola vez (`socket.once`) el evento `username_set` para guardar el username en el store.

---

### `Lobby.jsx`

Pantalla intermedia entre el login y el chat. Ofrece dos acciones:

- **Crear sala**: genera un ID aleatorio de 6 caracteres con `Math.random().toString(36)`. Muestra el ID con un botón "Copiar" (usa `navigator.clipboard`). Al confirmar, emite `join_room` al servidor.
- **Unirse a sala**: input que fuerza mayúsculas. Al submit emite `join_room` con el ID ingresado.

---

### `Sidebar.jsx`

Panel lateral visible durante el chat. Muestra:

- El **ID de la sala actual** con botón para copiar (útil para invitar a alguien una vez dentro).
- La **lista de usuarios conectados** en esa sala, actualizada en tiempo real.

---

### `ChatBox.jsx`

Área de scroll con todos los mensajes de la sala. Por cada mensaje muestra:

- Nombre de usuario
- Hora (`toLocaleTimeString`)
- Texto del mensaje

Usa un `ref` al final del listado para hacer **auto-scroll** suave (`scrollIntoView`) cada vez que llega un mensaje nuevo.

---

### `MessageInput.jsx`

Input controlado para escribir y enviar mensajes. Maneja dos flujos en paralelo:

- **Envío**: al hacer submit emite `send_message` con `{ room, message }` y limpia el input.
- **Typing**: al escribir emite `typing_start`. Si el usuario deja de escribir por **1.5 segundos**, emite `typing_stop` automáticamente (debounce con `setTimeout`).

---

### `TypingIndicator.jsx`

Componente minimalista. Lee `typingUsers` del store y renderiza:

- `"Juan está escribiendo..."` si hay uno solo.
- `"Juan, María están escribiendo..."` si hay varios.
- Nada (`null`) si no hay nadie escribiendo.

---

## Estado global — `useChatStore.js`

Manejado con **Zustand**. Contiene todo el estado compartido de la sesión:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `username` | string | Nombre del usuario actual |
| `currentRoom` | string | Sala activa |
| `messages` | array | Mensajes de la sala activa |
| `users` | array | Usuarios conectados |
| `typingUsers` | array | Usuarios escribiendo actualmente |
| `unreadCounts` | object | Mensajes no leídos por sala |

Cuando el usuario cambia de sala, `setCurrentRoom` limpia los mensajes y resetea el contador de no leídos de esa sala.

---

## Servidor — handlers de Socket.IO

### `userHandlers.js`

| Evento escuchado | Acción |
|-----------------|--------|
| `set_username` | Registra al usuario en el Map en memoria, emite `username_set` al cliente y `users_list` a todos |
| `disconnect` | Elimina al usuario del Map y notifica a su sala con `user_left` |

### `messageHandlers.js`

| Evento escuchado | Acción |
|-----------------|--------|
| `join_room` | Mueve al socket a la sala, guarda la sala en el usuario, envía el historial (`room_history`) |
| `send_message` | Construye el payload, lo guarda en `roomHistory` (máx. 50 mensajes) y emite `receive_message` a todos en la sala |

### `typingHandlers.js`

| Evento escuchado | Acción |
|-----------------|--------|
| `typing_start` | Emite `user_typing { isTyping: true }` a los demás en la sala |
| `typing_stop` | Emite `user_typing { isTyping: false }` a los demás en la sala |

---

## Eventos Socket.IO — resumen completo

### Cliente → Servidor

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `set_username` | `string` | Registrar nombre de usuario |
| `join_room` | `string` (room id) | Unirse a una sala |
| `send_message` | `{ room, message }` | Enviar un mensaje |
| `typing_start` | `string` (room id) | El usuario comenzó a escribir |
| `typing_stop` | `string` (room id) | El usuario dejó de escribir |

### Servidor → Cliente

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `username_set` | `{ id, username }` | Confirmación de nombre registrado |
| `users_list` | `User[]` | Lista actualizada de todos los usuarios |
| `room_history` | `{ room, messages[] }` | Historial al unirse a una sala |
| `receive_message` | `{ id, username, message, room, timestamp }` | Nuevo mensaje en la sala |
| `user_typing` | `{ username, isTyping }` | Estado de escritura de otro usuario |
| `user_joined` | `{ username, room }` | Alguien entró a la sala |
| `user_left` | `{ username, room }` | Alguien salió de la sala |

---

## Scripts disponibles

```bash
# Cliente
npm start          # Inicia en modo desarrollo → http://localhost:3000
npm run build      # Build de producción optimizado
npm test           # Ejecuta los tests

# Servidor
node src/index.js  # Inicia el servidor → http://localhost:3001
```
