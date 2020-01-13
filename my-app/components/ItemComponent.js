import React, { Component } from 'react';
import { View, Text, StyleSheet , ListView} from 'react-native';
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
                                No {index+1} , device_id = {item.device_id}
                            </Text>
                            <Text style={styles.itemtext}>details : {item.txn_type} = {item.txn_status}  </Text>
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
    }
});