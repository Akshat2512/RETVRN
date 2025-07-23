import { Platform } from "react-native";
import { store } from "../store";
import { TS_STREAM, TRANSCRIBING, WS_CONN, BOT_STREAM, ANALYSIS_STATUS } from "../types";

export interface StateProp{
    states : {
        connection: Boolean;
        websocket: WebSocket | null;
        AnalysisStatus: string | null;
        transcription: string[];
        bot_stream: {voice_data: {id: number, base64: string}[], transcript:string[]};
        transcribing: string | null;
        speech: {status: boolean, text: string | null};
        audioContext : AudioContext | null
    };

}


const initialState: StateProp['states'] = {
    connection: false,
    websocket: null,
    AnalysisStatus: null,
    transcription: [],
    bot_stream: {voice_data: [], transcript: []},
    transcribing: null,
    speech: {status: false, text: null},
    audioContext : null,

}


export default (state = initialState, {type, payload}: {type: any, payload: any}) => {
     
    switch (type) {
        
        case WS_CONN: 
           return  {...state, websocket: payload.websocket, connection: payload.status}
        
        case ANALYSIS_STATUS:
            return {
                ...state,
                AnalysisStatus: payload
            }

        case TS_STREAM:
           if(payload == "<stream>" || payload == "<terminate>")
            { state.transcription = [];
              payload = ""; }
           if(payload == "</n>"){
              payload = "\n";
           }
           return {...state, transcription: [... state.transcription, payload]}
        
        case BOT_STREAM:
            if(payload["Type"] == "ai_voice"){
               return {...state, bot_stream: {...state.bot_stream, voice_data: [... state.bot_stream.voice_data, {id: payload.file_idx, base64:payload.content}]}} 
            }

            if(payload["Type"] == "ai_transcript"){
                 
                var transcript = state.bot_stream.transcript;
                if(payload["content"] == "<stream>" || payload["content"] == "<terminate>"){ 
                  transcript = [];
                  payload["content"] = ""; 
                //   return {...state}
                }
                if(payload["content"] == "</n>"){
                    payload["content"] = "\n";
                 }

                 
                return {...state, bot_stream: {...state.bot_stream, transcript: [... transcript, payload.content]}}
            }
        // case TRANSCRIBING:
        //     return {...state, transcribing: payload}

    } 
        
    return state;
}