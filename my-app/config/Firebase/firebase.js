import * as firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import firebaseConfig from './firebaseConfig'

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
/*
const  db = firebase.firestore()

const TxnUsage = {
  getData = async (id) =>  {
    const doc = await db.doc(`txn_usage/${id}`).get()
    const data = doc.data()
    if (!data) {
      console.error('member does not exist')
      return
    }
    return data
  },
  getStatus = async (id) =>  {
    const doc = await db.doc(`txn_usage/${id}`).get()
    const data = doc.data()
    if (!data) {
      console.error('member does not exist')
      return
    }
    return data
  }
}

app.post('/data', cors(), async (req, res) => {
  const id  = req.body.id
  if (id) {
    res.json(await getData(id))
    return
  }
  res.end()
})


app.post('/status', cors(), async (req, res) => {
  const id  = req.body.id
  if (id) {
    res.json(await getStatus(id))
    return
  }
  res.end()
})
*/

const Firebase = {
  // auth
  loginWithEmail: (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  },
  signupWithEmail: (email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
  },
  signOut: () => {
    return firebase.auth().signOut()
  },
  checkUserAuth: user => {
    return firebase.auth().onAuthStateChanged(user)
  },

  // firestore
  createNewUser: userData => {
    return firebase
      .firestore()
      .collection('users')
      .doc(`${userData.uid}`)
      .set(userData)
  }
}

//export default {Firebase,TxnUsage}
export default Firebase