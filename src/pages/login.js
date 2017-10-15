import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  Keyboard,
  KeyboardAvoidingView
} from 'react-native'
import {
  StackNavigator,
} from 'react-navigation';

const LoginView = Platform.select({
  ios: () => KeyboardAvoidingView,
  android: () => View,
})();

import Button from '../components/button';
//import GroupChannel from './groupChannel';
var groupChannel = require('./groupChannel.js');
//import SendBird from 'sendbird'
import SocketIOClient from 'socket.io-client';
//import Index from '../index';
var sb = null;
var socket = SocketIOClient('http://localhost:3000');
// Socket events

  // Whenever the server emits 'login', log the login message
  socket.on('login', function (data) {
    connected = true;
    // Display the welcome message
    var message = "Welcome to the Game Server ";
    log(message, {
      prepend: true
    });
    addParticipantsMessage(data);
  });

  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', function (data) {
    addChatMessage(data);
  });



  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function (data) {
    log(data.username + ' joined');
    addParticipantsMessage(data);
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', function (data) {
    log(data.username + ' left');
    addParticipantsMessage(data);
    removeChatTyping(data);


  });

  // Whenever the server emits 'typing', show the typing message
  socket.on('typing', function (data) {
    addChatTyping(data);
  });


  // Whenever the server emits 'stop typing', kill the typing message
  socket.on('stop typing', function (data) {
    removeChatTyping(data);
  });




  socket.on('gameCreated', function (data) {
    console.log("Game Created! ID is: " + data.gameId)
    log(data.username + ' created Game: ' + data.gameId);
    //alert("Game Created! ID is: "+ JSON.stringify(data));
  });
  
  socket.on('disconnect', function () {
   log('you have been disconnected');
 });
  
  socket.on('reconnect', function () {
   log('you have been reconnected');
   if (username) {
     socket.emit('add user', username);
   }
 });
  
  socket.on('reconnect_error', function () {
   log('attempt to reconnect has failed');
 });


//Join into an Existing Game
function joinGame(){
  socket.emit('joinGame');
};

socket.on('joinSuccess', function (data) {
  log('Joining the following game: ' + data.gameId);
});


//Response from Server on existing User found in a game
socket.on('alreadyJoined', function (data) {
  log('You are already in an Existing Game: ' + data.gameId);
});


function leaveGame(){
  socket.emit('leaveGame');
};

socket.on('leftGame', function (data) {
  log('Leaving Game ' + data.gameId);
});

socket.on('notInGame', function () {
  log('You are not currently in a Game.');
});

socket.on('gameDestroyed', function (data) { 
  log( data.gameOwner+ ' destroyed game: ' + data.gameId);

});
// Log a message
  function log (message, options) {
    console.log(message)
  }
function addParticipantsMessage (data) {
    var message = '';
    if (data.numUsers === 1) {
      message += "Crickets...It's Just YOU and ME -Robot";
    } else {
      message += "there are " + data.numUsers + " players in the Lobby";
    }
    log(message);
  }
/* first comment --  */
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      username: '',
      connectLabel: 'CONNECT',
      buttonDisabled: true,
      errorMessage: ''
    };
    this._onPressConnect = this._onPressConnect.bind(this);
    this._onPressOpenChannel = this._onPressOpenChannel.bind(this);
    //this._onPressGroupChannel = this._onPressGroupChannel.bind(this);
    this._onPressSketch = this._onPressSketch.bind(this)

  }

  _onPressConnect() {
    Keyboard.dismiss();

    if (!this.state.buttonDisabled) {
      this._onPressDisconnect();
      return;
    }
    
    if (this.state.username.trim().length == 0 ) {
      this.setState({
        userId: '',
        username: '',
        errorMessage: 'User ID and Nickname must be required.'
      });
      return;
    }

    var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi
    if (regExp.test(this.state.username)) {
      this.setState({
        userId: '',
        username: '',
        errorMessage: 'Please only alphanumeric characters.'
      });
      return;
    }
     // Tell the server your username
    socket.emit('add user', this.state.username);
    var _SELF = this;
    _SELF.setState({
          buttonDisabled: false,
          connectLabel: 'DISCONNECT',
          errorMessage: ''
        });

    //this.state.username = this.state.userId;
    /*ßsb = SendBird.getInstance();
    var _SELF = this;
    sb.connect(_SELF.state.userId, function (user, error) {
      if (error) {
        _SELF.setState({
          userId: '',
          username: '',
          errorMessage: 'Login Error'
        });
        console.log(error);
        return;
      }

      if (Platform.OS === 'ios') {
        if (sb.getPendingAPNSToken()){
          sb.registerAPNSPushTokenForCurrentUser(sb.getPendingAPNSToken(), function(result, error){
            console.log("APNS TOKEN REGISTER AFTER LOGIN");
            console.log(result);
          });
        }
      } else {
        if (sb.getPendingGCMToken()){
          sb.registerGCMPushTokenForCurrentUser(sb.getPendingGCMToken(), function(result, error){
            console.log("GCM TOKEN REGISTER AFTER LOGIN");
            console.log(result);
          });
        }
      }

      sb.updateCurrentUserInfo(_SELF.state.username, '', function(response, error) {
        _SELF.setState({
          buttonDisabled: false,
          connectLabel: 'DISCONNECT',
          errorMessage: ''
        });
      });
    });*/
  }

  _onPressOpenChannel() {
    this.props.navigator.push({name: 'openChannel'});
  }

  _onPressGroupChannel() {
    this.props.navigator.push({
                title: 'groupChannel',
                component: groupChannel,
                navigationBarHidden: true,
                passProps: {myElement: 'text'}
            });
  }
  _onPressSketch() {
    this.props.navigator.push({name: 'sketchImage'});
  }


  _onPressDisconnect() {
    sb.disconnect();
    this.setState({
      userId: '',
      username: '',
      errorMessage: '',
      buttonDisabled: true,
      connectLabel: 'CONNECT'
    });
  }


  _buttonStyle() {
    return {
      backgroundColor: '#6E5BAA',
      underlayColor: '#51437f',
      borderColor: '#6E5BAA',
      disabledColor: '#ababab',
      textColor: '#ffffff'
    }
  }

  render() {
    return (
      <LoginView behavior='padding' style={styles.container} >
        <View style={styles.loginContainer}>
         {/*} <TextInput
             style={[styles.input, {marginTop: 10}]}
            value={this.state.userId}
            onChangeText={(text) => this.setState({userId: text})}
            onSubmitEditing={Keyboard.dismiss}
            placeholder={'Enter User ID'}
            maxLength={12}
            multiline={false}

            />
        */}
          <TextInput
            style={[styles.input, {marginTop: 10}]}
            value={this.state.username}
            onChangeText={(text) => this.setState({username: text})}
            onSubmitEditing={Keyboard.dismiss}
            placeholder={'Enter User Nickname'}
            maxLength={12}
            multiline={false}
            />

          <Button
            text={this.state.connectLabel}
            style={this._buttonStyle()}
            onPress={this._onPressConnect}
          />

          <Text style={styles.errorLabel}>{this.state.errorMessage}</Text>
          <Button
            text={'Start Chat'}
            style={this._buttonStyle()}
            disabled={this.state.buttonDisabled}
            onPress={this._onPressGroupChannel}
          />
          {/*Comment by Khine, hide buttons
          <Button
            text={'Public Chat'}
            style={this._buttonStyle()}
            disabled={this.state.buttonDisabled}
            onPress={this._onPressOpenChannel}
          />
          <Button
            text={'Sketch Chat'}
            style={this._buttonStyle()}
            onPress={this._onPressSketch}
          />
          */}
        </View>
      </LoginView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  input: {
    width: 250,
    color: '#555555',
    padding: 10,
    height: 50,
    borderColor: '#6E5BAA',
    borderWidth: 1,
    borderRadius: 4,
    alignSelf: 'center',
    backgroundColor: '#ffffff'
  },
  errorLabel: {
    color: '#ff0200',
    fontSize: 13,
    marginTop: 10,
    width: 250
  }
});
