import React from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent, Notification } from "../Sidebar";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { updateReadStatus } from "../../store/utils/thunkCreators";

const styles = {
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab",
    },
  },
};

const Chat = (props) => {
  const { classes, setActiveChat, user, conversation } = props;
  const { otherUser } = conversation;

  const handleClick = async () => {
    await setActiveChat({user, conversation});
  }

  return (
    <Box
      onClick={handleClick}
      className={classes.root}
    >
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />
      <Notification conversation={conversation} />
    </Box>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (data) => {
      dispatch(updateReadStatus(data));
    },
  };
};

export default connect(null, mapDispatchToProps)(withStyles(styles)(Chat));
