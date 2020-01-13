import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Appbar, Button } from 'react-native-paper'
import { withFirebaseHOC } from '../config/Firebase'
import firebase from 'firebase';
import ItemComponent from '../components/ItemComponent';

let txnRef = firebase.database().ref('tx_usage')

class Home extends Component {

  state = {
    items: []
  }

  componentDidMount() {
    txnRef.on('value', (snapshot) => {
      let data = snapshot.val()
      let items = Object.values(data)
      this.setState({ items })
    });
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
            this.state.items.length > 0
              ? <ItemComponent items={this.state.items} />
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