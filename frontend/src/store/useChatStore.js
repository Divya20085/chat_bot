import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    
    console.log("=== CHAT STORE DEBUG ===");
    console.log("Selected user:", selectedUser);
    console.log("Selected user ID:", selectedUser?._id);
    console.log("Message data received:", {
      text: !!messageData.text,
      image: !!messageData.image,
      imageLength: messageData.image?.length
    });
    
    if (!selectedUser || !selectedUser._id) {
      console.error("No selected user or user ID!");
      toast.error("Please select a user to chat with");
      return;
    }
    
    try {
      console.log("Making request to:", `/messages/send/${selectedUser._id}`);
      console.log("Request data:", {
        text: messageData.text,
        imageLength: messageData.image?.length,
        hasImage: !!messageData.image
      });
      
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      console.log("Message sent successfully:", res.data);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.error("=== SEND MESSAGE ERROR ===");
      console.error("Failed to send message:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error message:", error.message);
      toast.error(error.response?.data?.error || error.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
