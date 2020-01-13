import React from 'react'
import { Image } from 'react-native-elements'

const AppLogo = () => (
  <Image
    source={require('../assets/logo.png')}
    style={{ width: 280, height: 220 }}
  />
)

export default AppLogo
