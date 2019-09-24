import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NoImg from '../images/NoImg.png'
import classNames from 'classnames';

import "../styles/messenger.scss";

//MUI Stuff
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

// Redux
import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';
import { isMemberExpression } from '@babel/types';

class messenger extends Component {
    state = {
        height: window.innerHeight,
        messages: []
    }

    addTestMessages = this.addTestMessages.bind(this);

    _onResize(){
        this.setState({ height : window.innerHeight })
       
    }

    componentDidMount(){
        window.addEventListener('resize', this._onResize.bind(this))
        this.addTestMessages();
        
    }

    addTestMessages(){
        let msgs =[]
        for(let i= 0; i< 100; i++){
            let isMe = false;
            if (i % 3 === 0){
                isMe = true;
            }
            const newMsg = {
                author: `Author ${i}`,
                body: `The body of message ${i}`,
                avatar: NoImg,
                me: isMe,
            }
            msgs.push(newMsg)
        }
        this.setState({messages: msgs});
    }


    componentWillUnmount(){
        window.removeEventListener('resize', this._onResize.bind(this))
        
    }

   
    render() {
        const {height, messages} = this.state

        const style ={
            height: 600
        }
        console.log('msgs =', this.state.messages)

        
        
        return (
           

           
            <div style={style} className="app-messenger">
                <div className="header"> 
                    <div className="left">
                        <div className="actions">
                            <Button className="msg-button">New message</Button>

                        </div>
                   
                    </div>
                   
                    <div className="content">
                        <h2>Yomi Lee</h2>
                    </div>
                    <div className="right">
                        <div className="user-bar">
                            <div className="profile-name">Caitlin Lee</div>
                            <div className="profile-image">
                                <img src={NoImg} alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="main">
                    
                    <div className="sidebar-left"> 
                    <h2 className="title">Messages</h2>
                        <div className="chats">
                            <div className="chat">
                                <div className="user-image">
                                    <img src={NoImg} alt=""/>
                                </div>
                                <div className="chat-info">
                                    <h2>Toan, Alex</h2>
                                    <p>Hello there...</p>
                                </div>
                            </div>

                            <div className="chat">
                                <div className="user-image">
                                    <img src={NoImg} alt=""/>
                                </div>
                                <div className="chat-info">
                                    <h2>Toan, Alex</h2>
                                    <p>Hello there...</p>
                                </div>
                            </div>
                    </div>
                    </div>
                    <div className="content"> 
                        <div className="messages">
                            {messages.map((message, index) => {
                                return(
                                    <div key={index} className={classNames('message', {'me': message.me})}>
                                        <div className="msg-user-image">
                                            <img src={message.avatar} alt=""/>
                                        </div>
                                        <div className="msg-body">
                                            <div className="msg-author"> {message.me ? 'You said' : `${message.author} said`}</div>
                                            <div className="msg-text"> <p> {message.body}</p></div>  
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="messenger-input">
                            <div className="text-input"> 
                           
                                {/* <TextField
                                    id="outlined-bare"
                                    defaultValue="Write your message..."
                                    variant="outlined"
                                    inputProps={{ 'aria-label': 'bare' }}
                                /> */}
                            
                                <textarea placeholder="Write your message..."/>
                            </div>
                            <div className="actions"> 
                                <Button className="send">Send</Button>
                            </div>

                           
                        </div>
                    </div>

                    <div className="sidebar-right"> 
                    <h2 className="title">Members</h2>
                        <div className="members">
                            <div className="member">
                                <div className="user-image">
                                    <img src={NoImg} alt=""/>
                                </div>
                                <div className="member-info">
                                    <h2> Yomi Lee </h2>
                                    <p>Joined: 3 days ago</p> 
                                </div>
                            </div>

                            <div className="member">
                                <div className="user-image">
                                    <img src={NoImg} alt=""/>
                                </div>
                                <div className="member-info">
                                    <h2> Edgar Jiang </h2>
                                    <p>Joined: 3 days ago</p> 
                                </div>
                            </div>
                        </div>
                    
                    </div>
                </div>
                
            </div>
            
        )
    }
}

messenger.propTypes = {
    getUserData: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    data: state.data
});

export default connect(mapStateToProps, { getUserData })(messenger);





