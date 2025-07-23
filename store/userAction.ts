import { ImageSourcePropType } from "react-native";
import { TS_STREAM, LOGIN, LOGOUT, TRANSCRIBING, USER_PROFILE_IMG, WS_CONN, WS_SEND, BOT_STREAM, ANALYSIS_STATUS, SAVE_SESSION} from "./types";
// import { friendsProp } from "./Reducers/userReducer";
import { store } from "./store";
import { ChatListProp, ChatMessage, ChatStream, RelationLists, SentimentListProp } from "@/interfaces/Interface";
import { useDispatch } from "react-redux";
import { PersistsStateProp } from "./Reducers/userReducer";

  

export const loginAction = (uname: string) => {
    return {
        type: LOGIN,
        payload: {isSignedIn: true, uname: uname.toLowerCase()}
    }
}

export const logoutAction = () => {
    return {
        type: LOGOUT,
        payload: false
    }
}

export const setConnection = (socket: WebSocket | null, status: Boolean) => {
    return {
        type: WS_CONN,
        payload: {websocket: socket, status: status}
    }
}


export const setAITranscript = (payload:ChatStream) => {
    return {
        type: TS_STREAM,
        payload: payload.content
    }
}

export const setAIVoice = (payload:ChatStream) => {
    return{
        type: BOT_STREAM,
        payload: payload
    }
}

export const setAnalysisStatus = (payload: string | null) => {
    return {
        type: ANALYSIS_STATUS,
        payload: payload
    }
}

export const setSession = (payload: any) => {
    return {
        type: SAVE_SESSION,
        payload: payload
    }
}

// export const setSession = (payload: )

//  export const setVisits = (id: number) => {
//     const time = new Date().toLocaleString("en-In",  {weekday: "short", 
//         year: "numeric",  
//         month: "2-digit",  
//         day: "2-digit",   
//         hour: "2-digit",  
//         minute: "2-digit",
//         second: "2-digit", 
//         hour12: false
//      })

//     return {
//         type: VISITS,
//         payload: {id: id, time: time}
//     }
//  }

 export const setTranscribingStatus = (message: string | null)=> {
    let payload;

    if(message == "error") 
        payload = "Error occured during transcription"
    if(message == "start")
        payload = "..."

    console.log("Transcribing ...", payload)

    return {
        type: TRANSCRIBING,
        payload: payload
    }
 }

