/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {
  Text, View, TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

import AutoCompleteKeyboardInput from './src/auto-complete';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <AutoCompleteKeyboardInput ref={(ref=>this.autoCompleteElement)}/>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.welcome}>
            Show
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.welcome}>
            Hide
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button : {
    padding:4,
  },
  textButton: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
