import { createStackNavigator } from 'react-navigation-stack'
import Home from '../screens/Home'
import Details from '../screens/Details'

const AppNavigation = createStackNavigator(
  {
      Home: { screen: Home },
      Details: { screen: Details }
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none'
  }
)

export default AppNavigation
