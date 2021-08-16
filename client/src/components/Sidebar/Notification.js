import React from "react";
import { Badge, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    badge: {
        marginRight: 25
    }
}));

const NotificationBadge = (props) => {
    const classes = useStyles();

    const { otherUser, messages, notifCount } = props.conversation;
    const lastSent = messages[messages.length-1]

    if(lastSent && lastSent.senderId === otherUser.id) {
        return(
            <Badge className={classes.badge} badgeContent={notifCount} color="primary"></Badge>
        )
    }
    
    return null;
}

export default NotificationBadge;