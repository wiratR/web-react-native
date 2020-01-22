import React, { Component } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { withFirebaseHOC } from '../config/Firebase'
import firebase from 'firebase';
// implement menu
import ScreenName from '../components/ScreenName'    // pull in the ScreenName component from ScreenName.js
import Header from '../components/Header'            // pull in header with DrawerTrigger

import { Table, TableWrapper, Row } from 'react-native-table-component'

class Device extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      dv_status     : {},
      tableHead     : [ 'no', 'name', 'ip adder', 'date&Time', 'status'],
      widthArr      : [ 20, 100 , 80 , 80 , 80 ],
      isLoadingPage : true,
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    const itemsRef = firebase.database().ref('dv_status');
    itemsRef.on('value', (snapshot) => {
      let data = snapshot.val();
      //console.log(data);
      let setDvStaus = [];
      for (let item in data) {
        setDvStaus.push({
          item_id   : item,
          device_id : data[item].device_id,
          datetime  : data[item].datetime,
          status    : data[item].status,
          location  : data[item].location,
        })
      }
      this.setState({
        dv_status     : setDvStaus,
        isLoadingPage : false,
      })
      //console.log(setDvStaus);
    })
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    let loadingstate = this.state.isLoadingPage;
    //console.log("get a is loading state " + loadingstate);
    let state = this.state;
    let tableData = [ ];
      const rowData = [];
      for( let item in state.dv_status ) {
        rowData.push(
          item+1,
          state.dv_status[item].item_id,
          state.dv_status[item].device_id,
          state.dv_status[item].datetime,
          state.dv_status[item].status,
        )
      }
      tableData.push(rowData);
    
    return (
        <React.Fragment>
        <Header />
        <View style={styles.headerCenter}>
          <ScreenName name={'Device'}/>
        </View>
        {/* --------- design Table Layout ----------------- */}
        <View style={styles.container}>
          <ScrollView horizontal={true}>
            <View>
              <Table borderStyle={{ borderColor: '#C1C0B9' }}>
                <Row 
                    data      ={state.tableHead} 
                    widthArr  ={state.widthArr} 
                    style     ={styles.header} 
                    textStyle ={styles.text} 
                />
              </Table>
              <ScrollView style={styles.dataWrapper}>
                <Table borderStyle={{ borderColor: '#C1C0B9' }}>
                  {
                    tableData.map((rowData, index) => (
                      <Row
                        key       ={index}
                        data      ={rowData}
                        widthArr  ={state.widthArr}
                        style     ={[styles.row, index % 2 && { backgroundColor: '#F7F6E7' }]}
                        textStyle ={styles.text}
                      />
                    ))
                  }
                </Table>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
        {/* --------- End design Table Layout --------------- */}
        </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  headerCenter: {
      paddingTop: 35,
      position: 'absolute',
      left: 160,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'left',
  },
  container: { 
    flex: 1, 
    padding: 16, 
    paddingTop: 30, 
    backgroundColor: '#fff' 
  },
  header: { 
    height: 50, 
    backgroundColor: '#537791' 
  },
  text: { 
    textAlign: 'center', 
    fontWeight: '100' 
  },
  dataWrapper: { 
    marginTop: -1 
  },
  row: { 
    height: 40, 
    backgroundColor: '#E7E6E1' 
  }
});

export default withFirebaseHOC(Device)