import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native';

// pull in the ScreenName component from ScreenName.js
import ScreenName from '../components/ScreenName.js'
// pull in header with DrawerTrigger
import Header from '../components/Header.js'
// Login
import { withFirebaseHOC } from '../config/Firebase'

class Location extends Component {

    // we won't need to configure navigationOptions just yet
    static navigationOptions = {

    };

    render() {
        return (
            <React.Fragment>
                <Header />
                <View style={styles.container}>
                    <ScreenName name={'Screen Location'/*pass the name prop to ScreenName*/} />
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
});

export default withFirebaseHOC(Location)