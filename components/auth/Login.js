import React, { Component } from 'react'
import { View, Button, TextInput } from 'react-native'

import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"

export default class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: 'test@gmail.com',
            password: '123456', 
        }
        this.onSignUP = this.onSignUP.bind(this)
    }
    

    onSignUP() {
        const { email, password } = this.state; 
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((result) => {
            console.log(result)
        })
        .catch((error) => {
            console.log(error)
        })
    }

  render() {
    return (
      <View>
          <TextInput 
                placeholder = 'email' 
                onChangeText={(email) => this.setState({ email })}
          />
          <TextInput 
                placeholder = 'password' 
                secureTextEntry={true}
                onChangeText={(password) => this.setState({ password })}
          />
          <Button 
                onPress={() => this.onSignUP()}
                title="Sign In"
          />
      </View>
    )
  }
}