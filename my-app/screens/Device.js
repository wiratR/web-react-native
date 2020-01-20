import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native';
// pull in the ScreenName component from ScreenName.js
import ScreenName from '../components/ScreenName'
// pull in header with DrawerTrigger
import Header from '../components/Header'
// Login
import { withFirebaseHOC } from '../config/Firebase'

class Device extends Component {

  render() {
    return (
        <React.Fragment>
        <Header />
        <View style={styles.headerCenter}>
          <ScreenName name={'Device'}/>
        </View>
        </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
      paddingTop: 35,
      position: 'absolute',
      left: 160,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'left',
  },
});

export default withFirebaseHOC(Device)