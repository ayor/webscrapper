import React from 'react';
const Emoji = props => (
    <span
        className={"emoji "+ props.emojiClass}
        role="img"
        aria-label={props.label ? props.label : ""}
        aria-hidden={props.label ? "false" : "true"}
    >
        {props.symbol}
    </span>
);
export default Emoji;