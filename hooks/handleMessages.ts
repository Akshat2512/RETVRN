import { store } from "@/store/store";
import { setAITranscript, setAIVoice, setAnalysisStatus } from "@/store/userAction";
import { Dispatch, UnknownAction } from "redux";

export function sendMessage(message: string): "sent" | "failed" | "connecting" | "closed" {

            const socket = store.getState().states.websocket;
            // console.log(socket?.readyState);
            if(socket?.readyState == WebSocket.OPEN){
                socket.send(message);
                return 'sent';
            }
            if(socket?.readyState == WebSocket.CONNECTING){
                return 'connecting';
            }
            if(socket?.readyState == WebSocket.CLOSED){
                return 'closed';
            }
            return "failed"; 
}


export function HandleMessage(message:any, dispatch: Dispatch<UnknownAction>){

    if(message["Type"] == 'user_transcript'){
        // console.log(message)
        dispatch(setAITranscript(message))
    }

    else if(message["Type"] == 'ai_transcript'){
        dispatch(setAIVoice(message))
    }
    
    else if(message["Type"] == 'ai_voice'){
        dispatch(setAIVoice(message))
    }

    else if(message["Type"] == 'Analysis'){
        if(message["status"]=='<started>' ){
           dispatch(setAnalysisStatus("Start"));
        }
        else if(message["status"]=='<failed>'){
           dispatch(setAnalysisStatus("Failed"));
        }
        else{
           dispatch(setAnalysisStatus("Ready"));
           console.log(message);
           const time = new Date(message.start_time);
           console.log(time);
        //    dispatch(setSession())
        }
        // if(message["content"])
        //   console.log(message["content"])
    }


}