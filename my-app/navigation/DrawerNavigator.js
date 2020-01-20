import React from 'react'
import { createDrawerNavigator } from 'react-navigation-drawer'
import HomeScreen from '../screens/Home'
import DetailsScreen from '../screens/Details'
import LocationScreen from '../screens/Location'
import DeviceScreen from '../screens/Device'
import LogoutScreen from '../screens/Logout'

import { Ionicons } from '@expo/vector-icons'  // https://expo.github.io/vector-icons/

const DrawerNavigator = createDrawerNavigator(
    {
        //Drawer Optons and indexing
        Home : {
            screen : HomeScreen,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => (
                    <Ionicons name="ios-home" color={tintColor} size={25} />
                )
            }
        },
        Details : {
            screen : DetailsScreen,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => (
                    <Ionicons name="ios-albums" color={tintColor} size={25} />
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
        Device : {
            screen : DeviceScreen,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => (
                    <Ionicons name="ios-desktop" color={tintColor} size={25} />
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
    },
    {
        initialRouteName: 'Home',
        headerMode: 'none',
    }
)

export default DrawerNavigator;