import { combineReducers, createStore } from "redux";

import  { persistReducer, persistStore } from "redux-persist";
import storage from "@react-native-async-storage/async-storage";

import userReducer from "./Reducers/userReducer";
import stateReducer from "./Reducers/stateReducer";
// import thunk from "redux-thunk";

const userPersistConfig = {
     key: "user",
     storage
}
   
const rootReducer = combineReducers({
     userData: persistReducer(userPersistConfig, userReducer),
     states: stateReducer
});

export const store = createStore(rootReducer)
export const persistor = persistStore(store)
