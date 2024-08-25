# Chatt Application

[Visit Page](https://chat.kjsportfolio.se)

```chat.kjsportfolio.se
https://chat.kjsportfolio.se
```

## Introduction

This project is developed using Vite and React. It is styled with TailwindCSS. The application utilizes React's Context API to handle state management across the app.

## Context API

The project uses several context providers to manage the state across the application effectively. Below is an overview of each context and its responsibilities:

### AuthContext

`AuthContext` handles user authentication and state management related to the user's session. It provides the following functionalities:

- `fetchCsrfToken()`: Fetches a CSRF token for secure HTTP requests.
- `login()`: Logs the user into the application.
- `register()`: Registers a new user.
- `logout()`: Logs the user out of the application.
- **State Managed**:
  - `user`: Contains the logged-in user's details.
  - `isAuthenticated`: A boolean indicating if the user is logged in.
  - `jwtToken`: Stores the JSON Web Token for authentication purposes.
  - `csrfToken`: Stores needed token for login/register API calls.

### MessageContext

`MessageContext` manages messages and conversations within the app. It provides the following functionalities:

- `fetchConversation(conId)`: Fetches a specific conversation by its ID using `Promise.all`.
- `fetchMessages()`: Retrieves all messages related to the logged-in user.
- `createMessage()`: Sends a new message.
- `deleteMessage()`: Deletes a specific message.
- `deleteAllMessages()`: Deletes all messages using `Promise.all` and the `fetchMessages` and `deleteMessage` methods.
- `handleInvite()`: Creates a new invite for a conversation.
- **State Managed**:
  - `messages`: An array containing all messages for the logged-in user.
  - `activeConversation`: Stores the currently active conversation ID or object.

### UserContext

`UserContext` manages user data and interactions within the app. It provides the following functionalities:

- `fetchAllUsers()`: Fetches all users from the API.
- `fetchUserById(id)`: Fetches information about a specific user by their ID.
- `updateUser()`: Updates the logged-in user's data.
- `deleteUser()`: Deletes a user.
- `fetchUserInvites()`: Retrieves all invites related to the logged-in user.
- `removeUserInvite()`: Removes an invite from the user's list.
- `handleInviteResponse()`: Handles accepting or declining an invite, removing it from the API.
- **State Managed**:
  - `userList`: An array of all user objects fetched from the API.
  - `invites`: An array containing invite objects related to the logged-in user.

### ThemeContext

`ThemeContext` manages the application's theme preferences. It provides the following functionalities:

- **Theme Management**: Controls whether the user prefers a dark theme or light theme.
- `toggleTheme()`: Switches between dark and light themes dynamically within the app.
- **State Managed**:
  - `theme`: A string that indicates the current theme (`'light'` or `'dark'`).

## Hooks

The project also includes custom hooks to simplify the logic and reusability of various functionalities throughout the application. Below is an overview of each hook and its purpose:

### useContextHooks.js

`useContextHooks.js` provides helper functions to easily retrieve and use functions from the context API files. It simplifies the process of accessing and using different context functions within components, ensuring a cleaner and more manageable codebase.

### useLocalStorage.js

`useLocalStorage.js` is a custom hook designed to get and set values in the `localStorage` of the browser. This hook is useful for persisting state between page reloads and ensuring that user data or preferences are maintained even when the browser is closed and reopened.

### useSessionStorage.js

`useSessionStorage.js` works similarly to `useLocalStorage.js` but interacts with the `sessionStorage` instead. This hook is useful for persisting data only for the duration of the session, ensuring that the data is cleared when the browser session ends.

### useUnreadMessages.js

`useUnreadMessages.js` is a custom hook that periodically checks the API for new and unread messages. It uses intervals to poll the server, helping keep the user interface up-to-date with the latest message status without requiring manual refreshes. This hook is crucial for enhancing real-time communication features within the application.
