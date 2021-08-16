import React, { Component } from "react";
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

class Chat extends Component {
  handleClick = async () => {
    const { setActiveChat, user, conversation } = this.props;
    await setActiveChat({user, conversation});
  };

  render() {
    const { classes, conversation } = this.props;
    const otherUser = conversation.otherUser;
    return (
      <Box
        onClick={this.handleClick}
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
}

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (data) => {
      dispatch(updateReadStatus(data));
    },
  };
};

export default connect(null, mapDispatchToProps)(withStyles(styles)(Chat));
