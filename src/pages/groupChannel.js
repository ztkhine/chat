import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  ListView,
  TouchableHighlight,
  Alert,
  StyleSheet
} from 'react-native'
import {
  CachedImage
} from 'react-native-cached-image'
//const CachedImage = require('react-native-cached-image');
//import {APP_ID, PULLDOWN_DISTANCE} from '../consts';
//import TopBar from '../components/topBar';
//import moment from 'moment';
//import SendBird from 'sendbird';
var sb = null;
var ds = null;

export default class GroupChannel extends Component {
  

  render() {
    return (
      <View style={styles.container}>
        <TopBar
          onBackPress={this._onBackPress.bind(this)}
          onGroupChannel={this._onGroupChannel.bind(this)}
          title='Chats'
           />

        <View style={styles.listContainer}>
          <ListView
            removeClippedSubviews={false}
            enableEmptySections={true}
            onEndReached={() => this._getChannelList()}
            onEndReachedThreshold={PULLDOWN_DISTANCE}
            dataSource={this.state.dataSource}
            renderRow={(rowData) =>
              <TouchableHighlight onPress={() => this._onChannelPress(rowData)}>
                <View style={styles.listItem}>
                  <View style={styles.listIcon}>
                    <CachedImage style={styles.channelIcon} key={rowData.coverUrl} source={{uri: rowData.coverUrl.replace('http://', 'https://')}} />
                  </View>
                  <View style={styles.listInfo}>
                    <Text style={styles.titleLabel}>{this._channelTitle(rowData.members)}</Text>
                    <Text style={styles.memberLabel}>{rowData.lastMessage ? ( rowData.lastMessage.message && rowData.lastMessage.message.length > 15 ? rowData.lastMessage.message.substring(0, 11) + '...' : rowData.lastMessage.message ) : '' }</Text>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end', marginRight: 10}}>
                    <View style={{flex: 1, flexDirection: 'column', alignItems: 'flex-end', marginRight: 4}}>
                      <Text style={{color: '#861729'}}>{rowData.unreadMessageCount}</Text>
                    </View>
                     <View style={{flex: 1, alignItems: 'flex-end'}}>
                       <Text style={styles.descText}>{rowData.memberCount} members</Text>
                       <Text style={styles.descText}>{(!rowData.lastMessage || rowData.lastMessage.createdAt == 0) ? '-' : moment(rowData.lastMessage.createdAt).format('MM/DD HH:mm')}</Text>
                     </View>
                  </View>
                </View>
              </TouchableHighlight>
            }
          />
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#ffffff'
  },
  listContainer: {
    flex: 11,
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f8fc',
    borderBottomWidth: 0.5,
    borderColor: '#D0DBE4',
    padding: 5
  },
  listIcon: {
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 15
  },
  channelIcon: {
    width: 30,
    height: 30
  },
  listInfo: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  titleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#60768b',
  },
  memberLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: '#abb8c4',
  },
  descText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#ababab'
  }
});
