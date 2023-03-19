import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth"
import currentDevice from "./currentDevice";
import devices from "./devices";
import textsReducer from './texts'
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist'
import createTransform from "redux-persist/es/createTransform";
import { parse, stringify } from "flatted";


const transformCircular = createTransform(
    (inboundState, key) => stringify(inboundState),
    (outboundState, key) => parse(outboundState),
)
const persistConfig = {
    key: "admin",
    version: 1,
    storage,
    transforms:[transformCircular]
}
const reducer = combineReducers({
    auth: authReducer,
    text: textsReducer,
    currentDevice: currentDevice,
    devices:devices

})

const persistedReducer = persistReducer(persistConfig,reducer)

export default configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})