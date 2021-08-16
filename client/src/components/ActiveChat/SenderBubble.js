import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography, Avatar } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end"
  },
  date: {
    fontSize: 11,
    color: "#BECCE2",
    fontWeight: "bold",
    marginBottom: 5
  },
  text: {
    fontSize: 14,
    color: "#91A3C0",
    letterSpacing: -0.2,
    padding: 8,
    fontWeight: "bold"
  },
  bubble: {
    background: "#F4F6FA",
    borderRadius: "10px 10px 0 10px"
  },
  avatar: {
    height: 20,
    width: 20,
    marginTop: 6
  },
}));

const ReadReceipt = (props) => {
  const { msgId, otherUser } = props;
  const avatar = (<Avatar alt={otherUser.username} src={otherUser.photoUrl} className={props.className}></Avatar>);

  if(otherUser.lastRead === msgId) {
    return avatar;
  }
  return null;
}

const SenderBubble = (props) => {
  const classes = useStyles();
  const { time, text, otherUser, msgId } = props;

  return (
    <Box className={classes.root}>
      <Typography className={classes.date}>{time}</Typography>
      <Box className={classes.bubble}>
        <Typography className={classes.text}>{text}</Typography>
      </Box>
      <ReadReceipt 
      msgId={msgId} 
      otherUser={otherUser} 
      className={classes.avatar}
      />
    </Box>
  );
};

export default SenderBubble;
