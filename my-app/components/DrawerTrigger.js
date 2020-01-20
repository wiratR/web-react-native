import React from 'react';
import { TouchableOpacity, StyleSheet, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// withNavigation allows components to dispatch navigation actions
import { withNavigation } from 'react-navigation';
// DrawerActions is a specific type of navigation dispatcher
import { DrawerActions } from 'react-navigation-drawer';

// import image
const image = require('../assets/menu.png');

class DrawerTrigger extends React.Component {
  render() {
    return (
      <TouchableOpacity style={styles.buttonMenu}
        onPress={() => {
          this.props.navigation.dispatch(DrawerActions.openDrawer())
        }}
      >
        <Image
          source={image}
          style={{ width: 32, height: 32 }}
        />
      </TouchableOpacity>

    )
  }
}

const styles = StyleSheet.create({
  buttonMenu: {
    position: 'absolute',
    top: 20,
    padding: 10,
  },
});

export default withNavigation(DrawerTrigger);