import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'; 
import { View, Text } from 'react-native'

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux'; 
import rootReducers from './redux/reducers'
import thunk from 'redux-thunk'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import firebase from "firebase/compat/app"

const store = createStore(rootReducers, applyMiddleware(thunk))

const firebaseConfig = {
  apiKey: "AIzaSyAYcxayyh3AV2VBAAulvxMCe3ZtxNVBUAw",
  authDomain: "exercise2-59a65.firebaseapp.com",
  projectId: "exercise2-59a65",
  storageBucket: "exercise2-59a65.appspot.com",
  messagingSenderId: "1073680717186",
  appId: "1:1073680717186:web:ee800f954e0dd4898beb9b",
  measurementId: "G-Y0MF6CY41S"
};

if(firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'
import LoginScreen from './components/auth/Login'
import MainScreen from './components/Main'
import AddScreen from './components/main/Add'
import SaveScreen from './components/main/Save'
import CommentScreen from './components/main/Comment'

const Stack = createStackNavigator()

export class App extends Component {
  constructor(props) {
    super(props); 
    this.state = {
      loaded: false, 
    }
    
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if(!user) {
        this.setState({
          loggedIn: false, 
          loaded: true, 
        })
      } else {
        this.setState({
          loggedIn: true, 
          loaded: true, 
        })
      }
    })
  } 

  render() {
    const { loggedIn, loaded } = this.state
    if(!loaded) {
      return(
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text>Loading</Text>
        </View>
      )
    }

    if(!loggedIn){
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={ LandingScreen } options={{ headerShown: false}}/>
            <Stack.Screen name="Register" component={ RegisterScreen }/>
            <Stack.Screen name="Login" component={ LoginScreen }/>
          </Stack.Navigator>
        </NavigationContainer>
      )
    }
    return(
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="Main" component={ MainScreen } />
            <Stack.Screen name="Add" component={AddScreen} />
            <Stack.Screen name="Save" component={SaveScreen} />
            <Stack.Screen name='Comment' component={CommentScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
      
    )
  }
}

export default App

