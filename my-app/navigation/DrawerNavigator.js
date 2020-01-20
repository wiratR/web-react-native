import { createDrawerNavigator } from 'react-navigation-drawer'

import HomeScreen from '../screens/Home'
import DetailsScreen from '../screens/Details'
import LocationScreen from '../screens/Location'
import DeviceScreen from '../screens/Device'

const DrawerNavigator = createDrawerNavigator({
    Home:       HomeScreen,
    Details:    DetailsScreen,
    Location:   LocationScreen,
    Device:     DeviceScreen,
});

export default DrawerNavigator;