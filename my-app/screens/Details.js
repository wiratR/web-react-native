import React, { Component } from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Appbar, Button } from 'react-native-paper'
import { withFirebaseHOC } from '../config/Firebase'
import firebase from 'firebase';

class Details extends Component {

    constructor(props){
        super(props);
        this.state = {
            refkey : props.navigation.getParam('item', ''),
            type : props.navigation.getParam('type', ''),
        };
    }

    componentDidMount() {
        console.log('key index : ' + this.state.refkey);
        console.log('Txn Type  : ' + this.state.type);
        var txnType = this.state.type;
        var refKey = this.state.refkey;
        let docRef = firebase.firestore().collection('txn_usage').doc(refKey);
        docRef
        .onSnapshot(function(snapshot) {
            console.log("Current data: ", snapshot.data());
            let details = snapshot.data();
            let dataNew = [];
            let statusNew = [];
            for(let item in details){
                if (( item == 'data') &&  (txnType == 'refund'))
                {
                    dataNew.push({
                        item_id    :item,  // this UUID
                    })
                }
                if (( item == 'data') &&  (txnType == 'paymet'))
                {
                    dataNew.push({
                        item_id    :item,  // this UUID
                    })
                }
                if( item == 'status')
                {
                    statusNew.push({
                        item_id      :item,  // this UUID
                        code         :details[item].code,
                        description  :details[item].description,
                    })
                }
            }
            // need to export object array to rander
            console.log("data   : ", dataNew);
            console.log("status : ", statusNew);
            //...
        }, function(error) {
            //...
        });

    }

    // go back to home pages
    goBackToHome = () => this.props.navigation.navigate('Home')
    // handle sign out button
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
                        <Text>{this.state.type}</Text>
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
