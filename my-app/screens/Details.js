import React, { Component } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { Appbar, Button } from 'react-native-paper'
import { withFirebaseHOC } from '../config/Firebase'
import firebase from 'firebase';

class Details extends Component {

    handleSignout = async () => {
        try {
            await this.props.firebase.signOut()
            this.props.navigation.navigate('Auth')
        } catch (error) {
            console.log(error)
        }
    }
    render() {
        return (
            <>
                <Appbar>
                    <Appbar.Content title={'Details'} />
                </Appbar>
                <ScrollView>
                    <View style={styles.container}>
                        {/* TODO : add designed here*/}
                    </View>
                </ScrollView>
                {/*Logout button*/}
                <Button onPress={() => { this.handleSignout() }}>SignOut</Button>
            </>
        )
    } 
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default withFirebaseHOC(Details)
