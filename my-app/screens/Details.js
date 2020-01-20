import React, { Component } from 'react'
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import { Appbar, Button } from 'react-native-paper'
//import SideMenu from 'react-native-side-menu';
import { withFirebaseHOC } from '../config/Firebase'
import firebase from 'firebase';

import ScreenName from '../components/ScreenName.js'
import Header from '../components/Header.js'

//import Menu from './Menu';
//const image = require('../assets/menu.png');

class Details extends Component {

    constructor(props) {
        super(props);
        this.state = {
            responseData    : {},
            responseStatus  : {},
            refkey          : '',
            type            :'',
            isLoading       : true,
            //isOpen          : false,
            //selectedItem    : 'About',
        };
    }
/*
    toggle() {
        this.setState({
          isOpen: !this.state.isOpen,
        });
    }
    
    updateMenuState(isOpen) {
        this.setState({ isOpen });
    }
    
    onMenuItemSelected = item =>
        this.setState({
          isOpen: false,
          selectedItem: item,
    });
*/

    componentDidMount() {
        let txnId = this.props.navigation.getParam('item', '');
        let txnType = this.props.navigation.getParam('type', '');
        let setNewData = [];
        let setNewStatus = [];
        const ref = firebase.firestore().collection('txn_usage').doc(txnId);
        ref.get()
        .then((doc) => {
            if (doc.exists) {
                //console.log("Document data:", doc.data());  
                const details = doc.data();
                for (let item in details) {
                    if ((item == 'data') && (txnType == 'refund')) {
                        setNewData.push({
                            item_id: item,  // this UUID
                            partnerTransactionId: details[item].partnerTransactionId,
                            refundTransactionDateTime: details[item].refundTransactionDateTime,
                            transactionId: details[item].transactionId,
                        })
                    }
                    if ((item == 'data') && (txnType == 'payment')) {
                        setNewData.push({
                            item_id: item,  // this UUID
                            partnerTransactionId: details[item].partnerTransactionId,
                            billerId: details[item].billerId,
                            payerBankCode: details[item].payerBankCode,
                            payerTepaCode: details[item].payerTepaCode,
                            reference1: details[item].reference1,
                            reference2: details[item].reference2,
                            refreence3: details[item].reference3,
                            transactionAmount: details[item].transactionAmount,
                            transactionDateTime: details[item].transactionDateTime,
                            transactionId: details[item].transactionId,
                        })
                    }
                    if (item == 'status') {
                        setNewStatus.push({
                            item_id: item,  // this UUID
                            code: details[item].code,
                            description: details[item].description,
                            
                        })
                    }
                }
                this.setState({
                    responseData    : setNewData,
                    responseStatus  : setNewStatus,
                    refkey          : doc.id,
                    type            : this.props.navigation.getParam('type', ''),
                    isLoading       : false
                });

                //console.log("Document data:", this.state.responseData);  
                //console.log("Document data:", this.state.responseStatus);  

            } else {
                console.log("No such document!");
            }
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
        const isLoading = this.state.isLoading;
        //const menu = <Menu onItemSelected={this.onMenuItemSelected} />;
        if (isLoading) {
            return(

                
                /*
                <SideMenu
                menu={menu}
                isOpen={this.state.isOpen}
                onChange={isOpen => this.updateMenuState(isOpen)}
                >
                */
                <>
                    <React.Fragment>
                        <Header />
                        <View style={styles.container}>
                            <ScreenName name={'Screen Details'} />
                        </View>
                    </React.Fragment>
                <Appbar>
                    <Appbar.Content title={'Details'} />
                </Appbar>
                <ScrollView>
                    {/* Loading pages */}
                    <View style={styles.container}>
                            <Text> Please waiting</Text>
                    </View>
                </ScrollView>
                <Button onPress={() => { this.handleSignout() }}>SignOut</Button>
                </>
                /*
                <TouchableOpacity
                onPress={this.toggle}
                style={styles.buttonMenu}
                >
                <Image
                    source={image}
                    style={{ width: 32, height: 32 }}
                />
                </TouchableOpacity>
                </SideMenu>
                */
            )
        }
        else{
        return (
            /*
            <SideMenu
            menu={menu}
            isOpen={this.state.isOpen}
            onChange={isOpen => this.updateMenuState(isOpen)}
            >
            */
            <>
                <React.Fragment>
                    <Header />
                    <View style={styles.container}>
                        <ScreenName name={'Screen Details'} />
                    </View>
                </React.Fragment>
                <Appbar>
                    <Appbar.Content title={'Details'} />
                </Appbar>
                <ScrollView>
                    <View style={styles.container}>
                        {this.state.type == 'refund'
                            ? <View style={styles.itemsList}>
                                <Text style={styles.txnHeader} >{this.state.refkey}</Text>
                                {this.state.responseData.map((item, index) => {
                                return (
                                    <View key={index}>
                                        <Text style={styles.itemtext}>Transaction Type ={this.state.type}</Text>
                                        <Text style={styles.itemtext}>{item.item_id} => </Text>
                                        <Text style={styles.itemtext}>partnerTransactionId : {item.partnerTransactionId} </Text>
                                        <Text style={styles.itemtext}>refundTransactionDateTime : {item.refundTransactionDateTime} </Text>
                                        <Text style={styles.itemtext}>transactionId : {item.transactionId}</Text>
                                    </View>
                                )
                                })}
                                {this.state.responseStatus.map((item, index) => {
                                return (
                                    <View key={index}>
                                        <Text style={styles.itemtext}>{item.item_id} => </Text>
                                        <Text style={styles.itemtext}>code : {item.code} </Text>
                                        <Text style={styles.itemtext}>description : {item.description} </Text>
                                    </View>
                                )
                                })}
                            </View>
                            // -------------------------------- //
                            // startshows payment details
                            : this.state.type == 'payment'
                            ? <View style={styles.itemsList}>
                                <Text style={styles.txnHeader} >{this.state.refkey}</Text>
                                {this.state.responseData.map((item, index) => {
                                return (
                                    <View key={index}>
                                        <Text style={styles.itemtext}>Transaction Type = {this.state.type}</Text>
                                        <Text style={styles.itemtext}>{item.item_id} => </Text>
                                        <Text style={styles.itemtext}>partnerTransactionId : {item.partnerTransactionId} </Text>
                                        <Text style={styles.itemtext}>billerId : {item.billerId} </Text>
                                        <Text style={styles.itemtext}>payerBankCode : {item.payerBankCode}</Text>
                                        <Text style={styles.itemtext}>payerTepaCode : {item.payerTepaCode}</Text>
                                        <Text style={styles.itemtext}>reference1 : {item.reference1}</Text>
                                        <Text style={styles.itemtext}>reference2 : {item.reference2}</Text>
                                        <Text style={styles.itemtext}>reference3 : {item.reference3}</Text>
                                        <Text style={styles.itemtext}>transactionAmount : {item.transactionAmount}</Text>
                                        <Text style={styles.itemtext}>transactionDateTime : {item.transactionDateTime}</Text>
                                        <Text style={styles.itemtext}>transactionId : {item.transactionId}</Text>
                                    </View>
                                )
                                })}
                                {this.state.responseStatus.map((item, index) => {
                                return (
                                    <View key={index}>
                                        <Text style={styles.itemtext}>{item.item_id} => </Text>
                                        <Text style={styles.itemtext}>code : {item.code} </Text>
                                        <Text style={styles.itemtext}>description : {item.description} </Text>
                                    </View>
                                )
                                })}
                                </View>
                            :   <View style={styles.itemsList}>
                                    <Text style={styles.txnHeader} >{this.state.refkey}</Text>
                                    <Text style={styles.itemtext}> Data Type Error </Text>
                                </View>
                        }
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
                <Button onPress={() => { this.handleSignout() }}>SignOut</Button>
                </>
                //{/* Menu */}
                /*
                <TouchableOpacity
                onPress={this.toggle}
                style={styles.buttonMenu}
                >
                <Image
                    source={image}
                    style={{ width: 32, height: 32 }}
                />
                </TouchableOpacity>
                </SideMenu>
                */
            )
            } 
        }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemsList: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    itemtext: {
        fontSize: 14,
        textAlign: 'left',
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
    },
    txnHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
        color: 'blue',
    },
    buttonMenu: {
        position: 'absolute',
        top: 20,
        padding: 10,
    }
})

export default withFirebaseHOC(Details)
