import React from 'react';
import { View, StyleSheet , Text } from 'react-native';
// pull in from DrawerTrigger.js
import DrawerTrigger from './DrawerTrigger'

class Header extends React.Component {

    render() {
        return (
            <View style={styles.header}>
                <DrawerTrigger />
                <Text style={styles.textRight}>       
                    Demo
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        paddingTop: 60,
        backgroundColor: 'whitesmoke'
    },
    textRight: {
        paddingTop: 35,
        position: 'absolute',
        right: 20,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
    },
});

export default Header;