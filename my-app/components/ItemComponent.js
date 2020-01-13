import React, { Component } from 'react';
import { View, Text, StyleSheet , Alert } from 'react-native';
import PropTypes from 'prop-types';


export default class ItemComponent extends Component {

    static propTypes = {
        items: PropTypes.array.isRequired
    };


    render() {
        return (
            <View style={styles.itemsList}>
                {this.props.items.map((item, index) => {
                    return (
                        <View key={index}>
                            <Text style={styles.itemtext}>
                                 {index+1}. | {item.item_id}
                            </Text>
                            <Text style={styles.itemtext}>device id  : {item.device_id}</Text>
                            <Text style={styles.itemtext}>type           : {item.txn_type} </Text>
                            <Text style={styles.itemtext}>status       : {item.txn_status} </Text>
                            <Text style={styles.itemtext}>date           : {item.txn_date}</Text>
                            <Text style={styles.itemtext}>time           : {item.txn_time}</Text>
                        </View>
                        
                )
                })}

                

            </View>

            
        );
    }
}

const styles = StyleSheet.create({
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
    buttontext:{
        textAlign: 'left',
        flexDirection: 'column'
    }
});