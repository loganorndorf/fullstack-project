// changed state from [] to {}
export const addMessageToStore = (state, payload) => {
  const { message, sender, recipient } = payload;
  const newState = {...state};

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

    newState[newConvo.otherUser.id] = newConvo;
    return newState;
  }

  const [key, convo] = Object
    .entries(newState)
    .find(([idx, convo]) => convo.id === message.conversationId);

  if(key) {
    const pk = parseInt(key);
    const copy = {...convo};
    const messages = [...copy.messages]

    messages.push(message);
    copy.messages = messages;
    copy.latestMessageText = message.text;

    if(!message.isRead) {
      copy.unreadMessagesCount++;
    } else if(message.senderId !== copy.otherUser.id) {
      copy.otherUser.lastRead = message.id;
    }

    newState[pk] = copy;
    return newState;
  } else {
    return state;
  }
  
};

export const addOnlineUserToStore = (state, id) => {
  const newState = {...state};
  const convoCopy = {...newState[id]};
  convoCopy.otherUser.online = true;
  newState[id] = convoCopy;

  return newState;
};


export const updateOnlineUserActiveChat = (state, payload) => {
  const {id, recipId} = payload;

  const newState = {...state};
  for(const [key, convo] of Object.entries(newState)) {
    const pk = parseInt(key);

    if(pk === id) {
      const convoCopy = {...convo};
      convoCopy.otherUser.activeChat = recipId;
      newState[pk] = convoCopy;
    } else {

      if(convo.otherUser.activeChat === recipId) {
        const convoCopy = {...convo};
        convoCopy.otherUser.activeChat = null;
        newState[pk] = convoCopy;
      }
    }
  }

  return newState;
};

export const removeOfflineUserFromStore = (state, id) => {
  const newState = {...state};
  const convoCopy = {...newState[id]};
  convoCopy.otherUser.online = false;
  convoCopy.otherUser.activeChat = null;

  newState[id] = convoCopy;

  return newState;
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  Object.values(state).forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = {...state};
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState[user.id] = fakeConvo;
    }
  });

  return newState;
};

export const removeSearchedUsersFromStore = (state) => {
  const newState = {...state};
  const newStateCopy = {...newState}
  for(const [idx, entry] of Object.entries(newStateCopy)) {
    if(!entry.id) {
      delete newState[idx];
    }
  }

  return newState;
}

export const addNewConvoToStore = (state, recipientId, message) => {
  const newState = {...state};
  const convo = {...newState[recipientId]};
  convo.id = message.conversationId;

  const messages = [...convo.messages];
  messages.push(message);
  convo.messages = messages;

  convo.latestMessageText = message.text;
  convo.unreadMessagesCount = convo?.unreadMessagesCount ?? 0;

  newState[recipientId] = convo;

  return newState;
};

export const updateStoredMessagesReadStatus = (state, payload) => {
  const { conversationId, lastReadMsg } = payload;
  const newState = {...state};

  const [key, entry] = Object
    .entries(newState)
    .find(([idx, convo]) => convo.id === conversationId);
  
  if(key) {
    const pk = parseInt(key);
    const convoCopy = {...entry};
    convoCopy.unreadMessagesCount = 0;

    const updatedMessages = convoCopy.messages.map((msg) => {
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

    convoCopy.messages = updatedMessages;
    newState[pk] = convoCopy;

    return newState;
  } else {
    return state;
  }
  
}