import React, { Component } from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Appbar, Button } from 'react-native-paper'
import { withFirebaseHOC } from '../config/Firebase'
import firebase from 'firebase';


class Details extends Component {

    constructor(props){
        super(props);
        this.state = {
            refkey : props.navigation.getParam('item', '')
        };
        console.log('key index : ' + this.state.refkey)

        var docRef = firebase.firestore().collection("txn_usage").doc(this.state.refkey);
        docRef.onSnapshot(function(snapshot) {
            let data = snapshot.val();
            console.log(data);
            
            //...
        }, function(error) {
            //...
        });

    }


/*
        var docRef = firebase.firestore().collection("txn_usage").doc(this.state.refkey);
        //docRef.doc('data').get().then(function(doc) {
        docRef.get().then(function(doc) {
            if (doc.exists) {
                console.log("Document data:", doc.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });

    */


    // go back to home pages
    goBackToHome = () => this.props.navigation.navigate('Home')

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
                        <Text>Details </Text>
                        <Text>{this.state.refkey}</Text>
                        <Text>value=1111</Text> 
                        {/* button click to details page per transaction id */}
                        <TouchableOpacity 
                              style={styles.buttonStyle}
                              //goto next details pages passing a txnRef  
                              onPress={this.goBackToHome}
                        >
                            <Text style={styles.buttonText}> Back To Home </Text>
                        </TouchableOpacity>


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
    },
    buttonStyle: {
      alignItems: 'center',
      backgroundColor: '#67f',
      borderWidth: 1,
      borderColor: '#336633',
      paddingTop: 4,
      paddingBottom: 4,
      paddingRight: 25,
      paddingLeft: 25,
      marginTop: 10,
      width: 300
    },
    buttonText : {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'white',
    }
})

export default withFirebaseHOC(Details)
