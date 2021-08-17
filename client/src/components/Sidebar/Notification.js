import React from "react";
import { Badge, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    badge: {
        marginRight: 25
    }
}));

const NotificationBadge = (props) => {
    const classes = useStyles();

    const { otherUser, messages, unreadMessagesCount } = props.conversation;
    const lastSent = messages[messages.length-1]

    return lastSent?.senderId === otherUser.id && 
    <Badge className={classes.badge} badgeContent={unreadMessagesCount} color="primary"/>;

}

export default NotificationBadge;