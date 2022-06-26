import React, { useState, useEffect } from 'react' 
import { View, Text, FlatList, Button, TextInput } from 'react-native'

import firebase from "firebase/compat/app"

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'

export function Comment(props) {
    const [refresh, setRefresh] = useState(0)
    const [comments, setComments] = useState([])
    const [postId, setPostId] = useState("")
    const [text, setText] = useState("")

    useEffect(() => {
        
        function matchUserToComment(comments) {
            for (let i = 0; i < comments.length; i++) {

                if (comments[i].hasOwnProperty('user')){
                    continue; 
                }

                const user = props.users.find(x => x.uid === comments[i].creator)
                // const user = comments[i].creator
                if (user == undefined) {
                    props.fetchUsersData(comments[i].creator, false)
                } else {
                    comments[i].user = user
                }
            }
            setComments(comments)
        }

        // console.log(postId)
        // console.log(props.route.params.postId)
        if(props.route.params.postId !== postId) {
            // console.log(postId)
            firebase.firestore()
            .collection('posts')
            .doc(props.route.params.uid)
            .collection('userPosts')
            .doc(props.route.params.postId)
            .collection('comments')
            .get()
            .then((snapshot) => {
                let comments = snapshot.docs.map(doc => {
                    const data = doc.data()
                    // console.log(data.id)
                    const id = data.id
                    return {
                        data
                    }
                })
                
                matchUserToComment(comments)
            })
            setPostId(props.route.params.postId)
        } else {
            let newComments = []
            if (text) {
                const newComment = {
                    creator: firebase.auth().currentUser.uid,
                    text
                }
                newComments = [...comments, newComment]
                
                setText("")
            } else {
                newComments = comments
                
            } 
            matchUserToComment(newComments)
        } 
    }, [props.route.params.postId, props.users, refresh])

    const onCommentSend = () => {
        firebase.firestore()
            .collection('posts')
            .doc(props.route.params.uid)
            .collection('userPosts')
            .doc(props.route.params.postId)
            .collection('comments')
            .add({
                creator: firebase.auth().currentUser.uid,
                text
            })
        if (refresh === 0) {
            setRefresh({refresh: 1})
        } else {
            setRefresh({refresh: 0})
        }
    }

    return (
        <View>
            <FlatList 
                numColumns={1}
                horizontal={false}
                data={comments}
                renderItem={({item}) =>(
                    <View>
                        {item.user != undefined ? 
                        <Text>
                            {item.user.name}
                        </Text>
                    
                    : null}
                        <Text>{item.text}</Text>
                    </View>
                )}
            />

            <View>
                <TextInput 
                    placeholder='comment . . .'
                    onChangeText={(text) => setText(text)} 
                    clearTextOnFocus={true}
                />
                <Button 
                    onPress={() => onCommentSend()}
                    title='Send'
                />

            </View>


        </View>
    )
}

const mapStateToProps = (store) => ({
    users: store.usersState.users
})
const mapDispatchProps = (dispatch) => bindActionCreators({fetchUsersData}, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Comment)

/* */