import { Component } from 'react'
import { withFirebaseHOC } from '../config/Firebase'

class Logout extends Component {

    signOut = async () => {
        try {
          await this.props.firebase.signOut()
          this.props.navigation.navigate('Auth')
        } catch (error) {
          console.log(error)
        }
    }

    render() {
        {this.signOut()}
        return null;
    }
}

export default withFirebaseHOC(Logout)