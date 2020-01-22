import React, { Component } from 'react'
import { View, StyleSheet, FlatList, ActivityIndicator, Text, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native'
// Login
import { withFirebaseHOC } from '../config/Firebase'

// implement menu
import ScreenName from '../components/ScreenName'    // pull in the ScreenName component from ScreenName.js
import Header from '../components/Header'            // pull in header with DrawerTrigger
import uuid from 'uuid/v1';
import { ListItem } from 'react-native-elements'
import QRCode from 'react-native-qrcode-svg'

const API_KEY     = "l7b315d5f8e95146f19da6cc579ed67f93"
const API_SECRET  = "902af33a328149ff8900f4fb107024f8"
const MERCHANT_ID = "157033124877907"
const TERMINAL_ID = "885964411201658"

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      isLoading : true,
      valuesForQRCode : '',
      inPutAmount : '',
    }
  }

  // refer :: https://developer.scb/#/documents/api-reference-index/qr-payments/post-qrcode-create.html
  getQRData = async (authToken, txnAmount) => {
    let UUID = uuid();
    console.log("getQRData() : token = " + authToken);
    console.log("getQRData() : value = " + txnAmount);
    fetch('https://api-sandbox.partners.scb/partners/sandbox/v1/payment/qrcode/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept-language': 'EN',
        authorization   : authToken,
        requestUId      : UUID,
        resourceOwnerId : API_KEY,
        Accept          : 'application/json',
      },
      body: JSON.stringify({
        'qrType': 'PPCS',
        'ppType': 'BILLERID',
        'ppId': '165134740692203',
        amount: txnAmount,
        'ref1': 'REFERENCE1',
        'ref2': 'REFERENCE2',
        'ref3': 'SCB',
        merchantId: MERCHANT_ID,
        terminalId: TERMINAL_ID,
        'invoice': 'INVOICE',
        'csExtExpiryTime': '60'
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        //console.log(res);
        console.log("getQRData() : status = " + res['status']['code']);
        if (res['status']['code'] == 1000) {
          //console.log("getQRData() : qrRawData = " + res['data']['qrImage']);

          this.setState({
            isLoading: false,
            valuesForQRCode: res['data']['qrImage'],
          })
        } 

      })
      .catch((error) => {
        alert('error')
      })
  }
           
  getAccessToken = async (amount) => {
    var UUID = uuid();
    //console.log("getAccessToken() : uuid      = " + UUID);
    //console.log("getAccessToken() : APIKey    = " + API_KEY)
    //console.log("getAccessToken() : APISecret = " + API_SECRET);
    fetch('https://api-sandbox.partners.scb/partners/sandbox/v1/oauth/token',{
        method: 'POST',
        headers: {
          'Content-Type'    : 'application/json',
          'accept-language' : 'EN',
          resourceOwnerId   : API_KEY,
          requestUId        : UUID,
          Accept            : 'application/json',
        },
        body: JSON.stringify({
          applicationKey    : API_KEY,
          applicationSecret : API_SECRET,
        }),
    })
    .then((response) => response.json())
    .then((res) => {
      //console.log(res);
      //console.log("getAccessToken() : status = " + res['status']['code']);
      let qrData = '';
      let accessToken = '';
      if (res['status']['code'] == 1000){
        console.log("getAccessToken() : status sucess");
        accessToken = res['data']['tokenType'] + ' ' + res['data']['accessToken'] ;
        qrData = this.getQRData(accessToken, amount);  // test <accesstokem from auth , txnAmount>
      }else{
        console.log("getAccessToken() : status error");
      }
    })
   .catch((error) => {
        alert('error')
        })
  } 


  getTextInputValue = () =>{
      let inputText = this.state.inPutAmount;
      this.getAccessToken(inputText);
  }
         
  render() {
    let isLoading = this.state.isLoading;
    //console.log("show state = " + isLoading);
    return (
      <>
      <React.Fragment>
        <Header />
        <View style={styles.headerCenter}>
          <ScreenName name={'Home'} />
        </View>
      </React.Fragment>
        <ScrollView>
          <View style={styles.viewHome}>

            <TextInput
              style={styles.TextInputStyle}
              onChangeText={(text) => this.setState({inPutAmount:text})}
              underlineColor="transparent"
              placeholder="Enter Value to generate QR Code"
            />

            <TouchableOpacity 
              style={styles.buttonStyle} 
              // onPress={() => { this.getAccessToken() }}
              // still loading 
              onPress={this.getTextInputValue} activeOpacity={0.7} style={styles.button}
            >
              <Text style={styles.TextStyle}> Payment </Text>
            </TouchableOpacity>
          { 
            isLoading == false 
            ?
              <Image 
                style={{ width: 300, height: 300 }} 
                  source={{ uri: `data:image/gif;base64,${this.state.valuesForQRCode}`}} 
              />
            : 
              <Text> </Text>
          }
          </View>
        </ScrollView>
        </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute'
  },
  headerCenter: {
    paddingTop: 35,
    position: 'absolute',
    left: 160,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  viewHome: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
    alignItems: 'center',
    //justifyContent: 'center'
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#67f',
    borderWidth: 1,
    borderColor: '#336633',
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 25,
    paddingLeft: 25,
    marginTop: 5,
    width: 300
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  itemsList: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  itemtext: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  TextInputStyle:{
    width:'100%',
    height:40,
    borderRadius:10,
    marginBottom:10,
    borderWidth:1,
    borderColor: '#F44336',
    textAlign: 'center'
  },
  button: {
    width: '100%',
    paddingTop : 8,
    paddingBottom : 8,
    backgroundColor : '#009688',
    borderRadius: 7,
    marginBottom: 20
  },
  TextStyle: {
    color: '#fff',
    textAlign: 'center',
    fontSize:18
  }
});

export default withFirebaseHOC(Home)