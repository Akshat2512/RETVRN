import { Timestamp } from "react-native-reanimated/lib/typescript/commonTypes";
import { LOGIN, LOGOUT, SAVE_SESSION} from "../types";

import { ChatListProp, RelationLists, SentimentListProp } from "@/interfaces/Interface";




export interface diarizationProp{
    speaker_id: number,
    name: string | null,
    transcript: string,
    start_time: string
}

export interface sessionProp{
    id: number,
    transcript: string,
    timestamp: string
    diarization: diarizationProp[]
}

export interface PersistsStateProp{
    userData : {
        isSignedIn: boolean;
        userName: string | null;
        sessions: {[key: string]: sessionProp[]}
        
    }

}


const initialState: PersistsStateProp['userData'] = {
    isSignedIn: false,
    userName: null,
    sessions: {}
}

export default (state = initialState, {type, payload}: {type: any, payload: any}) => {
     
    switch (type) {
        case LOGIN : 
              return  {...state, isSignedIn: payload.isSignedIn, userName: payload.uname} 

        case LOGOUT : 
              return { ...initialState }
        
        case SAVE_SESSION :
             return {...state, sessions:{...state.sessions, [payload.date]: payload.data }}


    }
    // console.log(payload);
    return state;
}