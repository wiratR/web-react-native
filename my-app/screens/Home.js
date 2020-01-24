import React, { Component } from 'react'
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Image, 
  Linking,
  Button,
} from 'react-native'
// Login
import { withFirebaseHOC } from '../config/Firebase'
// implement menu
import ScreenName from '../components/ScreenName'    // pull in the ScreenName component from ScreenName.js
import Header from '../components/Header'            // pull in header with DrawerTrigger
import uuid from 'uuid/v1';
import QRCode from 'react-native-qrcode-svg'

const API_KEY     = "l7b315d5f8e95146f19da6cc579ed67f93"
const API_SECRET  = "902af33a328149ff8900f4fb107024f8"
const MERCHANT_ID = "157033124877907"
const TERMINAL_ID = "885964411201658"
const BILLER_ID   = "165134740692203"
const ACCOUNT_TEST = "3486110001"

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      isLoading : true,
      valuesForQRCode : '',
      inPutAmount : '',
      paymentLink : '',
      timer       : '',
      ewalletUrl  : '',
      paymentType : '',
    }
    // preserve the initial state in a new object
    this.baseState = this.state 
  }

  resetForm = () => {
    this.setState(this.baseState)
  }

  componentDidMount() {
    this.interval = setInterval(
      () => this.setState((prevState) => ({ timer: prevState.timer - 1 })),
      1000
    );
  }

  componentDidUpdate() {
    if (this.state.timer === 0) {
      clearInterval(this.interval);
      this.resetForm();
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getAccessAuthToken = async() => { 
    let UUID = uuid();
    console.log("getAccessAuthToken() : start.....")
    try {
      const response = await fetch('https://api-sandbox.partners.scb/partners/sandbox/v1/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept-language': 'EN',
          resourceOwnerId: API_KEY,
          requestUId: UUID,
          Accept: 'application/json',
        },
        body: JSON.stringify({
          applicationKey: API_KEY,
          applicationSecret: API_SECRET,
        }),
      })

      if (!response.ok) {
        throw Error(response.statusText)
      }
      const responseJson = await response.json();
      console.log("getAccessAuthToken() : get a access token = " + responseJson['data']['accessToken']);
      return responseJson['data']['accessToken'];
    } catch (error) {
      console.log(error);
    }
    
  }


  //create WeChat QR //
  // type 'A' : Alipay
  // type 'W' : WeChatPay
  createEwalletQR = async(txnType) => {
    let UUID = uuid();
    let authorizationToken = await this.getAccessAuthToken();
    let randomNumber = Math.floor(Math.random() * 100000) + 1;
    console.log("createEwalletQR()    : start authorization = Bearer " + authorizationToken);
    console.log("createEwalletQR()    : outTradeNo random   = SCB" + randomNumber);
    // call get acccToken
    try {

        const response = await fetch('https://api-sandbox.partners.scb/partners/sandbox/v1/payment/ewallets/qrcode/create', {
        method: 'POST',
        headers: {
          'Content-Type'    : 'application/json',
          'accept-language' : 'EN',
          authorization     : 'Bearer ' + authorizationToken,
          resourceOwnerId   : API_KEY,
          requestUId        : UUID,
          Accept            : 'application/json',
        },
        body: JSON.stringify({
          tranType          : txnType,
          companyId         : '0001',
          terminalId        : TERMINAL_ID,
          outTradeNo        : 'SCB' + randomNumber,
          totalFee          : '10.00',
        }),
      })

      if (!response.ok) {
        console.log("createEwalletQR()    : error https status = " + response.status);
        throw Error(response.statusText)
      }
      const responseJson = await response.json();
      const codeUrl = responseJson['data']['codeUrl'];
      console.log("createEwalletQR()     : get a codeUrl = " + codeUrl);
      console.log("createEwalletQR()     : wtih txn type = " + txnType);

      this.setState({
        ewalletUrl : codeUrl,
        paymentType: txnType,
        isLoading  : false,
        timer      : 59,
      });


    } catch (error) {
      console.log(error);
    }

  }

  // refer :: https://developer.scb/#/documents/api-reference-index/qr-payments/post-qrcode-create.html
  getQRData = async (accessToken, txnAmount) => {
    let UUID = uuid();
    console.log("getQRData() : token = " + accessToken);
    console.log("getQRData() : value = " + txnAmount);
    fetch('https://api-sandbox.partners.scb/partners/sandbox/v1/payment/qrcode/create', {
      method: 'POST',
      headers: {
        'Content-Type'    : 'application/json',
        'accept-language' : 'EN',
        authorization     : 'Bearer ' + accessToken,
        requestUId        : UUID,
        resourceOwnerId   : API_KEY,
        Accept            : 'application/json',
      },
      body: JSON.stringify({
        'qrType': 'PPCS',
        'ppType': 'BILLERID',
        'ppId': BILLER_ID,
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
            timer : 59,
          })
        } 

      })
      .catch((error) => {
        alert('error')
      })
  }

  // get deepLink
  getDeepLink = async(accessToken, amount) => {
    var UUID = uuid();
    console.log("getDeeplink() : accessToken = " + accessToken);
    fetch('https://api-sandbox.partners.scb/partners/sandbox/v3/deeplink/transactions',{
      method: 'POST',
      headers: {
        'Content-Type'    : 'application/json',
        authorization     : 'Bearer ' + accessToken,
        'accept-language' : 'EN',
        resourceOwnerId   : API_KEY,
        requestUId        : UUID,
        'channel'         : 'scbeasy',
        Accept            : 'application/json'
      }, 
      body: JSON.stringify({
        'transactionType'       : 'PURCHASE',
        'transactionSubType'    : ['BP'],
        sessionValidityPeriod   : 60,
        billPayment : {
          paymentAmount       : amount,
          accountTo           : BILLER_ID,
          accountFrom         : ACCOUNT_TEST,
          'ref1'              : 'ABCDEFGHIJ1234567890',
          'ref2'              : 'ABCDEFGHIJ1234567890',
          'ref3'              : 'SCB'
        }
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        //console.log(res);
        console.log("get a deeplink url : " + res['data']['deeplinkUrl'])

        this.setState({
          isLoading: false,
          paymentLink: res['data']['deeplinkUrl'],
        })
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
      let response = '';
      let accessToken = '';
      if (res['status']['code'] == 1000){
        console.log("getAccessToken() : status sucess");
        //accessToken = res['data']['tokenType'] + ' ' + res['data']['accessToken'] ;
        accessToken = res['data']['accessToken'];
        qrData = this.getQRData(accessToken, amount);  // test <accesstokem from auth , txnAmount>
        //response = this.getDeepLink(accessToken, amount);
       // console.log("get return " + response);
        //this.getQRData(accessToken, amount);

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

  getLogoFile = (logoType) => { 
    const alipayLogo = require('../assets/alipay-logo.png');
    const wechatLogo = require('../assets/wechat-logo.png');
    if (logoType == 'A'){
      return alipayLogo;
    }else if (logoType == 'W'){
      return wechatLogo;
    }
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
        <ScrollView
  
        >
          <View style={styles.viewHome}>
{/*
            <TextInput
              style={styles.TextInputStyle}
              onChangeText={(text) => this.setState({inPutAmount:text})}
              underlineColor="transparent"
              placeholder="Enter Value to generate QR Code"
            />
*/}

            <TouchableOpacity 
              style={styles.buttonStyle} 
              // onPress={() => { this.getAccessToken() }}
              onPress={() => { 
                //refreshPage;
                //window.location.reload(false);
                this.createEwalletQR('A');
              }}
              // still loading 
              //onPress={this.getTextInputValue} activeOpacity={0.7} style={styles.button}
            >
              <Text style={styles.TextStyle}> AliPay </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonStyle}
              // onPress={() => { this.getAccessToken() }}
              onPress={() => { 
                
                //window.location.reload(false);
                this.createEwalletQR('W');
              }}
            // still loading 
            //onPress={this.getTextInputValue} activeOpacity={0.7} style={styles.button}
            >
              <Text style={styles.TextStyle}> WeChatPay </Text>
            </TouchableOpacity>
          { 
            isLoading == false 
            ?
              <View style={{ flex: 1, justifyContent: 'center', }}>

                  {/*
                  <Image
                    style={{ width: 300, height: 300 }}
                    source={{ uri: `data:image/gif;base64,${this.state.ewalletUrl}` }}
                  />*/}
                  <QRCode
                      value={this.state.ewalletUrl}
                      logo={this.getLogoFile(this.state.paymentType)}
                      size={300}
                      bgColor='white'
                      fgColor='black'
                  />
                  <Text style={styles.timerText}> Time Out : {this.state.timer} </Text>

                  <TouchableOpacity
                    style={styles.buttonStyle}
                    // onPress={() => { this.getAccessToken() }}
                    onPress={() => {
                      //refreshPage();
                      //RNRestart.Restart();
                      //window.location.reload();
                      this.resetForm();
                    }}
                  // still loading 
                  //onPress={this.getTextInputValue} activeOpacity={0.7} style={styles.button}
                  >
                    <Text style={styles.TextStyle}> Clear </Text>
                  </TouchableOpacity>

              </View> 
           /*
                <Text style={{ color: 'blue' }}
                  onPress={() => Linking.openURL(this.state.paymentLink)}>
                  paymentLink
                </Text>
                */
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
  },
  timerText : {
    color     : 'red',
    textAlign : 'center',
    fontSize  : 18,
    fontWeight: 'bold',
  }
});

export default withFirebaseHOC(Home)