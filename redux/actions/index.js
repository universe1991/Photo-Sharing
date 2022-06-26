import firebase from "firebase/compat/app" 
import "firebase/compat/auth"
import "firebase/compat/firestore"
require("firebase/firestore")
import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, USERS_LIKES_STATE_CHANGE, CLEAR_DATA } from "../constants/index"

export function clearData() {
    return ((dispatch) => {
        dispatch({type: CLEAR_DATA})
    })
}

export function fetchUser() {
    return((dispatch) => {
        
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                if(snapshot.exists){
                    
                    dispatch({type: USER_STATE_CHANGE, currentUser: snapshot.data()})

                    // console.log(snapshot.data())
                }
                else {
                    console.log('does not exist')
                }
            })
    })
}

export function fetchUserPosts() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                dispatch({ type: USER_POSTS_STATE_CHANGE, posts })
                //console.log(posts)
            })
            //console.log(1)
    })
}

export function fetchUserFollowing() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .onSnapshot((snapshot) => {
                let following = snapshot.docs.map(doc => {
                    const id = doc.id;
                    return id 
                })
                // console.log(following)
                dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following })
                for (let i = 0; i < following.length; i++) {
                    dispatch(fetchUsersData(following[i], true))
                }
            })
            //console.log(1)
    })
}

export function fetchUsersData(uid, getPosts) {
    return ((dispatch, getState) => {
        const found = getState().usersState.users.some(el => el.uid === uid)
        

        if (!found) {
            firebase.firestore()
            .collection("users")
            .doc(uid)
            .get()
            .then((snapshot) => {
                if(snapshot.exists){
                    let user = snapshot.data()
                    // console.log(user.uid)
                    // console.log(1)
                    // console.log(snapshot)
                    user.uid = snapshot.id
                    // console.log(user.uid)

                    dispatch({type: USERS_DATA_STATE_CHANGE, user})
                    
                    
                }
                else {
                    console.log('does not exist')
                }
            })
            if(getPosts) {
                dispatch(fetchUsersFollowingPosts(uid))
            }
        }
    })
}

export function fetchUsersFollowingPosts(uid) {
    return ((dispatch, getState) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                
                // This uid is for each user
                const uid = snapshot.query._delegate._query.path.segments[1]; 
                // console.log({snapshot, uid})
                // console.log(snapshot.query._delegate._query.path.segments[1])
                const user = getState().usersState.users.find(el => el.uid === uid)

                // console.log(user.uid)

                // console.log(snapshot.docs)
                // console.log(user.uid)

                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    // console.log(data)

                    // This id is for each post
                    const id = doc.id;
                    // console.log(doc.id)
                    return { id, ...data, user }
                })

                // console.log(posts)
                
                //
                dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid })
                for (let i = 0; i < posts.length; i++) {
                    dispatch(fetchUsersFollowingLikes(uid, posts[i].id))
                }
                
                //console.log(posts)
                // console.log(getState()) 
                
                
            })
            //console.log(1)
    })
}

export function fetchUsersFollowingLikes(uid, postId) {
    return ((dispatch) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .doc(postId)
            .collection('likes')
            .doc(firebase.auth().currentUser.uid)
            .onSnapshot((snapshot) => {
                
                const postId = snapshot._delegate.ref._path.segments[3]; 
                
                 let currentUserLike = false; 
                 if (snapshot.exists) {
                     currentUserLike = true; 
                     
                 }
                dispatch({ type: USERS_LIKES_STATE_CHANGE, postId, currentUserLike })
                
                
            })
            //console.log(1)
    })
}