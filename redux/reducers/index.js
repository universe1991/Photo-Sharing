import { combineReducers } from "redux";
import { user } from './user'; 
import { users } from './users';

const rootReducers = combineReducers({
    userState: user, 
    usersState: users
})

export default rootReducers
