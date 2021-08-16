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

    if(lastSent?.senderId !== otherUser.id) {
        return null;
    }
    
    return <Badge className={classes.badge} badgeContent={unreadMessagesCount} color="primary"></Badge>;
}

export default NotificationBadge;