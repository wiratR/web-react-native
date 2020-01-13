import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Appbar, Button } from 'react-native-paper'
import { withFirebaseHOC } from '../config/Firebase'
import firebase from 'firebase';
import ItemComponent from '../components/ItemComponent';

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
        <View style={styles.container}>
          {
            
            this.state.tx_usage.length > 0
              ? <ItemComponent items={this.state.tx_usage} /> 
              : <Text>No items</Text>
          }

        </View>
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

export default withFirebaseHOC(Home)