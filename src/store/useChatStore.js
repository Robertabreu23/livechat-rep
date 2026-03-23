import { create } from "zustand";

const useChatStore = create((set) => ({
  username: "",
  currentRoom: "",
  messages: [],
  users: [],
  typingUsers: [],
  unreadCounts: {},

  setUsername: (username) => set({ username }),
  setCurrentRoom: (room) =>
    set((state) => ({
      currentRoom: room,
      messages: [],
      unreadCounts: { ...state.unreadCounts, [room]: 0 },
    })),

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setMessages: (messages) => set({ messages }),

  incrementUnread: (room) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [room]: (state.unreadCounts[room] || 0) + 1,
      },
    })),

  setUsers: (users) => set({ users }),

  setTypingUser: (username, isTyping) =>
    set((state) => ({
      typingUsers: isTyping
        ? [...new Set([...state.typingUsers, username])]
        : state.typingUsers.filter((u) => u !== username),
    })),
}));

export default useChatStore;
