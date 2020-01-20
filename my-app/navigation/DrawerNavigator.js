import { createDrawerNavigator } from 'react-navigation-drawer'
import HomeScreen from '../screens/Home'
import DetailsScreen from '../screens/Details'
import LocationScreen from '../screens/Location'
import DeviceScreen from '../screens/Device'
import LogoutScreen from '../screens/Logout'

const DrawerNavigator = createDrawerNavigator(
    {
        //Drawer Optons and indexing
        Home : {
            screen : HomeScreen,
        },
        Details : {
            screen : DetailsScreen,
        },
        Location : {
            screen : LocationScreen,
        },
        Device : {
            screen : DeviceScreen,
        },
        Logout : {
            screen : LogoutScreen,
        },
    },
    {
        initialRouteName: 'Home',
        headerMode: 'none',
    }
)

export default DrawerNavigator;