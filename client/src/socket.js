import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  updateReadMessages,
  updateOnlineUserData,
} from "./store/conversations";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    const { user } = store.getState();

    store.dispatch(addOnlineUser(id));
    socket.emit("update-online-user", {
      recipientId: id,
      otherUserId: id,
      id: user.id
    })
  });

  socket.on("update-online-user", (data) => {
    store.dispatch(updateOnlineUserData(data.otherUserId, data.id));
  })

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });

  socket.on("new-message", (data) => {
    store.dispatch(setNewMessage(data.message, data.recipientId, data.sender));
  });

  socket.on("update-messages", (data) => {
    store.dispatch(updateReadMessages(data.id, data.lastRead));
  })
});

export default socket;
