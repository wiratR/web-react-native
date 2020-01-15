import React, { Component } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { Appbar, Button } from 'react-native-paper'
import { withFirebaseHOC } from '../config/Firebase'
import firebase from 'firebase';

let txnRef = firebase.database().ref('tx_usage')



class Home extends Component {

  state = {
    tx_usage:[]
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
          tx_usage:newState
        })
    })
  }
  
  // goto next pages
  goToDetails = (refKey) => 
    this.props.navigation.navigate('Details', {
        item: refKey,
        // you can pass any type of object in here as well
  });

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
          <Appbar.Content title={'Txn List'} />
        </Appbar>
        <ScrollView>
        <View style={styles.container}>
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
                        {/*
                        <TouchableOpacity 
                              style={styles.buttonStyle}
                              //goto next details pages passing a txnRef  
                              onPress={this.goToDetails(index)}
                            >
                            <Text style={styles.buttonText}> View </Text>
                        </TouchableOpacity>
                        */}
                         <Button style={styles.buttonStyle} onPress={() => { this.goToDetails(item.item_id) }}> 
                              <Text style={styles.buttonText}> View </Text> 
                        </Button>
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

export default withFirebaseHOC(Home)