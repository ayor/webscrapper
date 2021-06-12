import React from 'react';
import Loading from '../Loading/Loading'; 
import Emoji from '../Emoji/Emoji';


const Noreviews = props => (<div className="vh-75 text-center">
    <p
        className="h3 text-center text-muted my-5 p-5">
        Ooops looks like nothing {props.commentType} has been said so far, searching the web for more!!
<Emoji emojiClass="mr-2 " symbol="🧐" label="shocked" /></p>
    <Loading />
</div>)
export default Noreviews;