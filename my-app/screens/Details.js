import React, { Component } from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { withFirebaseHOC } from '../config/Firebase'
import firebase from 'firebase';
// implement menu
import ScreenName from '../components/ScreenName'    // pull in the ScreenName component from ScreenName.js
import Header from '../components/Header'            // pull in header with DrawerTrigger

let detailsRef = firebase.firestore().collection('txn_usage')

class Details extends Component {

    constructor(props) {   
        super(props);
        this.state = {
            responseData    : {},
            responseStatus  : {},
            refkey          : '',
            type            : '',
            isLoading       : true,
        };
    }

    resetForm = () => {
          //console.log("Screen Details() : reset rorm");
          let txnId = this.props.navigation.getParam('item', '');
          let txnType = this.props.navigation.getParam('type', '');
          let setNewData = [];
          let setNewStatus = [];
          detailsRef.doc(txnId)
          .get().then((doc) => {
              if (doc.exists) {
                 // console.log("Document data:", doc.data());  
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
                      isLoading       : false,
                  });
  
                  //console.log("Document data:", this.state.responseData);  
                 // console.log("Document data:", this.state.responseStatus);  
  
              } else {
                  console.log("No such document!");
              }
          });        
    }

    // go back to home pages
    goBackToHome = () => this.props.navigation.navigate('Home')
    
    render() {
       //console.log("Screen Details() : Start Rander ................. ");
       let isLoading    = this.state.isLoading;
       let isNewTxnId   = this.props.navigation.getParam('item', '');
     //  console.log("Screen Details() : old ref txn Name " + this.state.refkey);
     //  console.log("Screen Details() : Txn name " + isNewTxnId);
       if ( this.state.refkey != isNewTxnId && (isLoading == false))
       {
            return(
                <>
                    <React.Fragment>
                        <Header />
                        <View style={styles.headerCenter}>
                        <ScreenName name={'Details'}/>
                        </View>
                    </React.Fragment>
                    <ScrollView>
                    {/* Loading pages */}
                        <View style={styles.container}>
                                <Text > Please waiting</Text>
                                {this.resetForm()}
                        </View>
                    </ScrollView>
                </>
            )
       }
       // still loading
       if (isLoading) {
            return(
                <>
                <React.Fragment>
                    <Header />
                    <View style={styles.headerCenter}>
                    <ScreenName name={'Details'}/>
                    </View>
                </React.Fragment>
                    <ScrollView>
                    {/* Loading pages */}
                        <View style={styles.container}>
                                <Text > Please waiting</Text>
                                {this.resetForm()}
                        </View>
                    </ScrollView>
                </>
            )
        }
        else{
        return (
            <>
                <React.Fragment>
                    <Header />
                    <View style={styles.headerCenter}>
                    <ScreenName name={'Details'}/>
                    </View>
                </React.Fragment>
                <ScrollView>
                    <View style={styles.container}>
                        {this.state.type == 'refund'
                            ? <View style={styles.itemsList}>
                                <Text style={styles.txnHeader} >{this.state.refkey}</Text>
                                {this.state.responseData.map((item, index) => {
                                return (
                                    <View key={index}>
                                        <Text style={styles.itemtext}>Transaction Type = {this.state.type}</Text>
                                        <Text style={styles.itemtext}>---------------------- {item.item_id} -------------------- </Text>
                                        <Text style={styles.itemtext}>partnerTransactionId : {item.partnerTransactionId} </Text>
                                        <Text style={styles.itemtext}>refundTransactionDateTime : {item.refundTransactionDateTime} </Text>
                                        <Text style={styles.itemtext}>transactionId : {item.transactionId}</Text>
                                    </View>
                                )
                                })}
                                {this.state.responseStatus.map((item, index) => {
                                return (
                                    <View key={index}>
                                        <Text style={styles.itemtext}>--------------------- {item.item_id} -------------------</Text>
                                        <Text style={styles.itemtext}>code            : {item.code} </Text>
                                        <Text style={styles.itemtext}>description  : {item.description} </Text>
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
                                        <Text style={styles.itemtext}>---------------------- {item.item_id} -------------------- </Text>
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
                                        <Text style={styles.itemtext}>--------------------- {item.item_id} -------------------</Text>
                                        <Text style={styles.itemtext}>code            : {item.code} </Text>
                                        <Text style={styles.itemtext}>description  : {item.description} </Text>
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
                </>
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
    },
    headerCenter: {
        paddingTop: 35,
        position: 'absolute',
        left: 160,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
    },
})

export default withFirebaseHOC(Details)
