import { USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE,USERS_LIKES_STATE_CHANGE, CLEAR_DATA } from "../constants"

const initialState = {
    users: [], // users = [user1: {email, name, uid}}, user2, user3, ...]
    feed: [],  // feed = [post1: {postId, postInfo, userWhoPost}, post2, post3, ...]
    usersFollowingLoaded: 0
}

export const users = (state = initialState, action) => {
    

    switch (action.type){
        case USERS_DATA_STATE_CHANGE: 
            return ({
                ...state, 
                users: [...state.users, action.user]
            })
        case USERS_POSTS_STATE_CHANGE: 
            return ({
                ...state, 
                usersFollowingLoaded: state.usersFollowingLoaded + 1, 
                feed: [...state.feed, ...action.posts]
            })
        case USERS_LIKES_STATE_CHANGE: 
            return ({
                ...state, 
                feed: state.feed.map(post => post.id == action.postId ? 
                    {...post, currentUserLike: action.currentUserLike} : post)   
            })
        

        case CLEAR_DATA: 
            return initialState
        

        default: 
            return state
    }

}