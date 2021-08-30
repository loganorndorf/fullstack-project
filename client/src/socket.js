import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  updateReadMessages,
  updateOnlineUserData,
} from "./store/conversations";

const socket = io(window.location.origin, {
  auth: async(cb) => {
    const token = await localStorage.getItem("messenger-token");
    cb({
      token
    });
  },
  autoConnect: false,
  reconnection: false,
  rejectUnauthorized: true
});


const checkForConvo = (idToCheck) => {
  const { conversations } = store.getState();
  
  if(conversations[idToCheck]) return true
  else return false
}

socket.on("connect", () => {
  console.log("Server Connected -");

  socket.on("add-online-user", (id) => {
    if(checkForConvo(id)) {
      const { user, conversations, activeConversation } = store.getState();
      store.dispatch(addOnlineUser(id));

      if(activeConversation === conversations[id].otherUser.username) {
        socket.emit("update-online-user", {
          recipientId: id,
          otherUserId: id,
          id: user.id
        });
      }
    }
  });

  socket.on("update-online-user", (data) => {
    if(checkForConvo(data.id)) {
      store.dispatch(updateOnlineUserData(data.otherUserId, data.id));
    }
  })

  socket.on("remove-offline-user", (id) => {
    if(checkForConvo(id)){
      store.dispatch(removeOfflineUser(id));
    }
  });

  socket.on("new-message", (data) => {
    store.dispatch(setNewMessage(data.message, data.recipientId, data.sender));
  });

  socket.on("update-messages", (data) => {
    store.dispatch(updateReadMessages(data.id, data.lastRead));
  })

  socket.on("disconnect", reason => {
    console.log("User disconnect by", reason);
  })
});

socket.on("connect_error", error => {
  console.error(error.message);
})

export default socket;
