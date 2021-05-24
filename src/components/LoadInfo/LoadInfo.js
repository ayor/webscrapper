import React from 'react';
import Emoji from '../Emoji/Emoji';

const LoadInfo = props => {
    return(
        <React.Fragment>
             <div className="load-info ">
                            <Emoji emojiClass="pr-3 h2" symbol={props.emojiSymbol} label={props.emojiLabel}/>
                            <p className="m-2 h4"> &#60;X&#62;%</p>
                            <p className="m-3 h3">{props.message}</p>
                        </div>
        </React.Fragment>
    )
}

export default LoadInfo;