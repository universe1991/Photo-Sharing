import React, { useState } from 'react'
import { View, TextInput, Image, Button } from 'react-native'

import firebase from "firebase/compat/app"

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { NavigationContainer } from '@react-navigation/native'
require("firebase/firestore")

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUserPosts } from '../../redux/actions/index'

export  function Save(props) {
    const [caption, setCaption] = useState('')



    const uploadImage = async () => {
        const metadata = {
            contentType: 'image/jpeg'
        }
        
        const uri = props.route.params.image;
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
        
        const response = await fetch(uri)
        const blob = await response.blob()

        const storage = getStorage()
        //console.log(storage)

        const imageRef = ref(storage, childPath)
        //console.log(imageRef)

        const task = uploadBytesResumable(imageRef, blob, metadata)

        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            getDownloadURL(task.snapshot.ref).then((snapshot) => {
                savePostData(snapshot);
                console.log(snapshot)
            })
        }

        const taskError = snapshot => {
            // console.log(snapshot)
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted);
    }

    const savePostData = (downloadURL) => {
        
        firebase.firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .add({
                downloadURL,
                caption,
                likesCount: 0,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            }).then((function () {
                props.navigation.popToTop()
                props.fetchUserPosts()
            }))
    }

  return (
    <View style={{flex: 1}}>
        <Image source={{uri: props.route.params.image}}/>
        <TextInput 
            placeholder='Write a Caption . . . ' 
            onChangeText={(caption) => setCaption(caption)}
        />
        <Button title="Save" onPress={() => uploadImage()} />
    </View>
  )
}

const mapDispatchProps = (dispatch) => bindActionCreators({fetchUserPosts}, dispatch)

export default connect(null, mapDispatchProps)(Save)
