
export const addMessageToStore = (state, payload) => {
  const { message, sender, recipient } = payload;
  const newState = [...state];

  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      latestMessageText: message.text,
    };
    
    newConvo.otherUser.activeChat = recipient;
    
    if(!message.isRead) {
      newConvo.unreadMessagesCount = 1
    }
    else {
      newConvo.unreadMessagesCount = 0
      if(message.senderId !== newConvo.otherUser.id) {
        newConvo.otherUser.lastRead = message.id;
      }
    }

    return [newConvo, ...newState];
  }

  return newState.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = {...convo};
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;

      if(!message.isRead) {
        convoCopy.unreadMessagesCount++;
      } else if(message.senderId !== convoCopy.otherUser.id) {
        convoCopy.otherUser.lastRead = message.id;
      }

      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  const newState = [...state];
  return newState.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true; 
      return convoCopy;
    } else {
      return convo;
    }
  });
};


export const updateOnlineUserActiveChat = (state, payload) => {
  const {id, recipId} = payload;

  const newState = [...state];
  return newState.map((convo) => {
    if(convo.otherUser.id === id) {
      const convoCopy = {...convo};
      convoCopy.otherUser.activeChat = recipId;
      return convoCopy;
    } else {
      if(convo.otherUser.activeChat === recipId) {
        const convoCopy = {...convo};
        convoCopy.otherUser.activeChat = null;
        return convoCopy;
      }
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  const newState = [...state];
  return newState.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      convoCopy.otherUser.activeChat = null;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  const newState = [...state];
  return newState.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const convoCopy = {...convo};

      convoCopy.id = message.conversationId;
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      convoCopy.unreadMessagesCount = convoCopy?.unreadMessagesCount ?? 0;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const updateStoredMessagesReadStatus = (state, payload) => {
  const newState = [...state];
  const { conversationId, lastReadMsg } = payload;

  return newState.map((convo) => {
    if(convo.id === conversationId){
      const convoCopy = {...convo};
      convoCopy.unreadMessagesCount = 0;

      convoCopy.messages = convoCopy.messages.map((msg) => {
        if(msg.id > lastReadMsg) {
          const msgCopy = {...msg};
          msgCopy.isRead = true;
          if(msg.senderId !== convoCopy.otherUser.id) {
            convoCopy.otherUser.lastRead = msg.id;
          }
          return msgCopy;
        } else {
          return msg;
        }
      })

      return convoCopy;
    } else {
      return convo;
    }
  })
}