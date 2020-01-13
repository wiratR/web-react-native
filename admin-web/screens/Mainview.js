import React from 'react'
import { connect } from 'react-redux'
import Firebase, { admin } from '../config/Firebase'
import { Appbar, Button } from 'react-native-paper';
import { View, Text, StyleSheet } from 'react-native';
import ItemComponent from '../components/ItemComponent';



let txnRef = admin.ref('tx_usage')

class Mainview extends React.Component {

    handleSignout = () => {
        Firebase.auth().signOut()
        this.props.navigation.navigate('Login')
    }

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
            <Button onPress={() => {this.handleSignout()}}>Logout</Button>
            </>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#B6A6BB',
    }
})


const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(Mainview)