import React, { Component } from 'react'
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Icon } from 'react-native'
import { Appbar, Button } from 'react-native-paper'
import { withFirebaseHOC } from '../config/Firebase'
import firebase from 'firebase';
// implement menu
import ScreenName from '../components/ScreenName'    // pull in the ScreenName component from ScreenName.js
import Header from '../components/Header'            // pull in header with DrawerTrigger

let txnRef = firebase.database().ref('tx_usage')

class Home extends Component {

  /*
  static navigationOptions = {
    drawerIcon: ({ tintColor }) => (
      <Icon name="home" style={{ fontSize: 24, color: tintColor }} />
    )
  }*/

  constructor(props) {
    super(props);
    this.state = {
      tx_usage:{},
    };
  }

  componentDidMount() {
    txnRef.on('value',(snapshot) => {
        let tx_usage = snapshot.val();
        let newState = [];
        for(let item in tx_usage){
          newState.push({
              item_id     :item,  // this UUID
              device_id   :tx_usage[item].device_id,
              txn_type    :tx_usage[item].txn_type,
              txn_status  :tx_usage[item].txn_status,
              txn_date    :tx_usage[item].txn_date,
              txn_time    :tx_usage[item].txn_time
          })
        }
        this.setState({
          tx_usage:newState,
        })
      
    })
  }
  
  // goto next pages
  goToDetails = (refKey, txnType) => 
  {
     //console.log ("goToDetails pages");
     //console.log ("key     =  " + refKey);
     //console.log ("type    =  " + txnType);
      this.props.navigation.navigate('Details', {
          item: refKey,
          type: txnType,
          // you can pass any type of object in here as well
      });
  }

  render() {
    //console.log("Screen Home() : Start Rander ................. ");
    return (
        <>
        <React.Fragment>
          <Header />
          <View style={styles.headerCenter}>
            <ScreenName name={'Home'}/>
          </View>
        </React.Fragment>
        <ScrollView>
        <View style={styles.viewHome}>
          {
            this.state.tx_usage.length > 0
              ? // TODO it have a value
                <View style={styles.itemsList}>
                {
                  this.state.tx_usage.map((item, index) => {
                    return (
                      <View key={index}>
                        <Text style={styles.itemtext}>
                          {index + 1}. | {item.item_id}
                        </Text>
                        <Text style={styles.itemtext}>device id  : {item.device_id}</Text>
                        <Text style={styles.itemtext}>type           : {item.txn_type} </Text>
                        <Text style={styles.itemtext}>status       : {item.txn_status} </Text>
                        <Text style={styles.itemtext}>date           : {item.txn_date}</Text>
                        <Text style={styles.itemtext}>time           : {item.txn_time}</Text>
                        {/* button click to details page per transaction id */}
                        <TouchableOpacity style={styles.buttonStyle} onPress={() => { this.goToDetails(item.item_id, item.txn_type) }}>
                          <Text style={styles.buttonText}> View </Text>
                        </TouchableOpacity>
                      </View>
                    )
                  })
                }
              </View>
              : // shows no data found
              <Text>No items</Text>
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewHome : {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop : 10,
    alignItems: 'center',
    justifyContent: 'center'
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
  buttonText : {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
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

export default withFirebaseHOC(Home)