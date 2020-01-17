import React, { Component } from 'react'
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, } from 'react-native'
import { Appbar, Button } from 'react-native-paper'
import { withFirebaseHOC } from '../config/Firebase'
import firebase from 'firebase';
import SideMenu from 'react-native-side-menu';
import Menu from './Menu';

let txnRef = firebase.database().ref('tx_usage')
const image = require('../assets/menu.png');

class Home extends Component {

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      tx_usage:{},
      isOpen: false,
      selectedItem: 'About',
    };

  }

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
  goToDetails = (refKey, Txntype) => 
    this.props.navigation.navigate('Details', {
        item: refKey,
        type: Txntype,
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
    const menu = <Menu onItemSelected={this.onMenuItemSelected} />;
    return (
      <SideMenu
        menu={menu}
        isOpen={this.state.isOpen}
        onChange={isOpen => this.updateMenuState(isOpen)}
      >
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
                         <Button style={styles.buttonStyle} onPress={() => { this.goToDetails(item.item_id,item.txn_type)}}> 
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
        </>
        <Button onPress={() => { this.handleSignout() }}>SignOut</Button>
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
  },
  buttonMenu: {
    position: 'absolute',
    top: 20,
    padding: 10,
  },
})

export default withFirebaseHOC(Home)