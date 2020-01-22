import React from 'react'
import { createDrawerNavigator } from 'react-navigation-drawer'
import HomeScreen from '../screens/Home'
import TransactionScreen from '../screens/Transaction'
import DetailsScreen from '../screens/Details'
import LocationScreen from '../screens/Location'
import DeviceScreen from '../screens/Device'
import LogoutScreen from '../screens/Logout'
import { Ionicons } from '@expo/vector-icons'  
import Hidden from '../components/Hidden'

const DrawerNavigator = createDrawerNavigator(
    {
        //Drawer Optons and indexing
        Home : {
            screen : HomeScreen,
            // sample to add a icons $https://expo.github.io/vector-icons/
            navigationOptions: {
                drawerIcon: ({ tintColor }) => (
                    <Ionicons name="ios-home" color={tintColor} size={25} />
                )
            }
        },
        Transaction: {
            screen: TransactionScreen,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => (
                    <Ionicons name="ios-card" color={tintColor} size={25} />
                )
            }
        },
        Device : {
            screen : DeviceScreen,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => (
                    <Ionicons name="ios-desktop" color={tintColor} size={25} />
                )
            }
        },
        Location : {
            screen : LocationScreen,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => (
                    <Ionicons name="ios-bus" color={tintColor} size={25} />
                )
            }
        },
        Logout : {
            screen : LogoutScreen,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => (
                    <Ionicons name="ios-log-out" color={tintColor} size={25} />
                )
            }
        },
        Details: {
            screen: DetailsScreen,
            navigationOptions: {
                // test hide navigation menu
                drawerLabel: <Hidden />,
            }
        },
    },
    {
        initialRouteName: 'Home',
        headerMode: 'none',
    }
)


// This code let you hide the bottom app bar when "Details" is rendering
DrawerNavigator.navigationOptions = ({ navigation }) => {
    let tabBarVisible;
    if (navigation.state.routes.length > 1) {
        navigation.state.routes.map(route => {
            if (route.routeName === "DetailsScreen") {
                tabBarVisible = false;
            } else {
                tabBarVisible = true;
            }
        });
    }

    return {
        tabBarVisible
    };
};

export default DrawerNavigator;