import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  useColorScheme,
  FlatList,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';

import { RelationLists } from '@/interfaces/Interface';
import { sendMessage } from '@/hooks/handleMessages';
// import OrbAnimation from './OrbAnimation';
import { PersistsStateProp } from '@/store/Reducers/userReducer';
import { useDispatch, useSelector } from 'react-redux';
import { StateProp } from '@/store/Reducers/stateReducer';
import { Recorder } from './Recorder';
import { ThemedText } from './ThemedText';
import  WaveComponent  from './RecordingWave';
import { ConcentricCircles } from './ui/CircleAnimation';
import Speaker from './speech';
import { store } from '@/store/store';
import { BlurView } from 'expo-blur';
import TranscriptView from './ui/transcript';



export function RetvrnScreen({screen, setScreen}: {screen:any, setScreen: any}) {
  // console.log("ChatStyleInterface rendered")
 
  const colorScheme = useColorScheme();
  const styles = colorScheme == "dark" ? darkstyles : lightstyles;
  const [viewScript, setScript] = useState(false);
  // const connected = useSelector((state:StateProp)=> state.states.connection)


  const transcription = useSelector((state: StateProp) => state.states.transcription);
  const [microphone, toggleMicrophone] = useState(false);

  const rec_state = useRef<(arg: boolean) => void>(()=>{});

  const socket = useSelector((state: StateProp) => state.states.websocket);

  const [textInput, setTextInput] = useState("");

  
  const dispatch = useDispatch();


  function sendText(text: string): void {
      if(text != "")
       sendMessage(JSON.stringify({Type:"ai_retvrn", text:text }))
      setTextInput("")

  }

useEffect(()=>{
  sendMessage(JSON.stringify({Type:"ai_retvrn", "status": true})) 
return ()=>{
  sendMessage(JSON.stringify({Type:"ai_retvrn", "status": false})) 
}
}, [])

 function toggleTranscript(){ 
      setScript(!viewScript) 
      if(transcription.length)
        scrolltobottom();        
 }



  const ai_script = useRef("");
  var [aiscript, setAITranscript] = useState(""); 
  var messages = useRef<{responder: "AI" | "user", message: string}[]>([]);


  useEffect(()=>{
   
    const interval = setInterval(()=>{
    var ai_transcript = store.getState().states.bot_stream.transcript;
    // console.log(ai_script, messages)
    if(ai_transcript.length>0){
         
          const script = ai_transcript.shift();
          // if(script.includes("\n")){
          //   console.warn(script);
          // }
          ai_script.current = ai_script.current + script;
          setAITranscript(ai_script?.current);

          if(messages.current[messages.current.length-1].responder == "user"){
            messages.current.push({responder: "AI", message: script})
            // const length = ai_transcript.length;      
            // for(let i=0; i<length;i++)
            //     ai_transcript.pop();
          }
          else{
            messages.current[messages.current.length-1].message = messages.current[messages.current.length-1].message + script;
          
          }
      }   
    
    },100)
    return()=>{
      clearInterval(interval);
      var ai_transcript = store.getState().states.bot_stream.transcript;
      ai_transcript = [];
    }
   
  }, [])


//  useEffect(() => {
//    microphone
//    ? null
//    : ( sendMessage(JSON.stringify({Type:"transcription", "status": false})) && transcript && setTranscript(false) )

//  }, [microphone])

  

  const ReWavRef = useRef(null);
  const CoWavRef = useRef(null);

  const scrollRef = useRef<ScrollView>(null);
  const userScroll = useRef(true);
    const flatListRef = useRef<FlatList>(null);  

 
  function scrolltobottom(){
     userScroll.current && flatListRef.current?.scrollToIndex({animated: true, index: messages.current.length-1,  viewPosition:0.2})
  } 

 
  useEffect(() => {

  //  console.log(transcription);
     var token = transcription.shift();
     if(token!="\n" && token){
      
      if((messages.current.length == 0 || messages.current[messages.current.length-1].responder == "AI" )){
        const length = transcription.length;      
        for(let i=0; i<length;i++)
                transcription.pop();
        if(/^ /.test(token)){
              token = token.replace(" ", "")
        }
        messages.current.push({responder: "user", message: token })
        setTimeout(()=>{
            scrolltobottom();
        }, 2000);
      }

      else{
            messages.current[messages.current.length-1].message = messages.current[messages.current.length-1].message + token;
            // flatListRef.current?.scrollToEnd({animated: false})
                //  flatListRef.current?.scrollToIndex({animated: false, index: messages.current.length-1,  viewPosition:0.5})

      }
    }
  }, [transcription]);
  

  function closeScreen(){
    setScreen(false)
  }

  return (
    <Modal
      // style = {{zIndex:0}}
      hardwareAccelerated
      transparent={true}
      visible={screen}
      animationType="slide"
      onRequestClose={() => closeScreen()}
    >
      <View style={styles.container}>
        <Ionicons size={30} name="close" style={{right: 10, zIndex:1, top: 10, color: "darkgray", alignSelf:"flex-end", width:30}} onPress={()=>closeScreen()} />
        
        <View style={{flex:1, zIndex:0}}>   
              <ConcentricCircles ref={CoWavRef}/>    
        </View>
              {viewScript && <TranscriptView Messages={messages.current} flatListRef={flatListRef} userScroll={userScroll}/>}

     
      {  <View style={styles.inputContainer}>
              <View style={styles.processContainer}>
                {/* <ThemedText>{transcription}</ThemedText> */}
              </View>
                {/* <TouchableOpacity style={[styles.Button, isPlaying && { backgroundColor: "rgb(147, 241, 109)"  }]} onPress={() => toggleTranscript()}>
                <Speaker audioUri={""}/>
              </TouchableOpacity> */}
          <TextInput
            multiline={true}
            style={styles.input}
            value={textInput}
            onChangeText={setTextInput}
            placeholder="Ask me anything..."
            placeholderTextColor="gray"
          />
            {
            <>
            <View style={{ flexDirection: "row", alignSelf: "flex-end" }}>
              <TouchableOpacity style={[styles.Button, viewScript && { backgroundColor: "rgb(147, 241, 109)"  }]} onPress={() => toggleTranscript()}>
                <Text>📃</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.Button, microphone && { backgroundColor: "rgb(147, 241, 109)"  }]} onPress={() => toggleMicrophone(!microphone)}>
                <Recorder type={"retvrn_recording"} socket={socket} microphone={microphone} ReWavRef = {ReWavRef} CoWavRef = {CoWavRef} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.Button} onPress={() => sendText(textInput)}>
                <Text style={styles.sendText}>Analysis</Text>
              </TouchableOpacity>
            </View></>}
            </View>}
          </View>
      
    </Modal>
  );
};

    // { viewScript && <View style={[{height:100}, styles.transcriptview]}>
    //                     {/* <ScrollView contentContainerStyle={{ height:100, overflow:Platform.OS == "android" ? "scroll" : "hidden", justifyContent:'flex-end'}}  */}
    //                     <ScrollView 
    //                         ref = {scrollRef}
    //                         contentContainerStyle={{overflow:Platform.OS == "android" ? "scroll" : "hidden", justifyContent:'flex-end'}} 
    //                         showsVerticalScrollIndicator={false} 
    //                         showsHorizontalScrollIndicator={false}
    //                         keyboardShouldPersistTaps={"handled"}
    //                         onScrollBeginDrag={() => userScroll.current = false}
    //                         onScrollEndDrag={() =>  userScroll.current = true}
    //                       >
    //                         <Text style={[styles.aiprompt, 
    //                         {flex: 1, alignSelf:"center", lineHeight:30}]}>
    //                           {aiscript}
    //                         </Text>
                          
    //                     </ScrollView>
    //                   </View>}

const lightstyles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    position:"relative",
    borderRadius:20,
    // backgroundColor: '#f5f5f5',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    overflow: 'hidden'
  },
  orbContainer: {
    // flex: 1,
    height: 200,
    alignItems: "center",
    alignSelf:"center",
    marginTop: 50,
  },

  userprompt: {
    marginTop: 10,
    maxWidth: "80%",
    fontWeight: 'bold',
    backgroundColor: "rgb(224, 219, 219)",
    fontFamily: "SpaceMono",
    fontSize: 16,
    padding: 10,
    borderRadius: 20,
    textAlign:"left",
    color: "rgb(57, 57, 57)"
  },
  transcriptview:{
    backgroundColor: "rgb(254, 235, 188)",
    boxShadow:"0px 4px 8px rgba(0, 0, 0, 0.37)",
    margin:20,
    borderRadius: 10,
  },
  aiprompt: {
    marginTop: 10,
    maxWidth: "80%",
    fontFamily: "SpaceMono",
    fontSize: 20,
    padding: 4,
    textAlign:"center",
    color: "rgb(179, 123, 45)",
  },
  emojis: {
    position: "absolute",
    right: 0,
    bottom: -10,
    fontSize: 20
  },

  processContainer: {
    margin: 10,
    // padding: 10,
    // justifyContent: 'center',
    // alignItems: 'flex-end',
  },
  optionButton: {
    backgroundColor: 'rgb(235, 235, 235)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    borderRadius: 10,
    boxShadow:"0px 4px 8px rgba(0, 0, 0, 0.37)",
    // elevation: 2,
    // width: '80%',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },

  inputContainer: {
    // position:"absolute",
    // bottom: 0,
    padding: 10,
    flexDirection: 'column',
    gap: 10,
    alignItems: 'center',
    alignSelf:'center',
    width:"100%",
     backgroundColor: 'rgb(214, 204, 204)'
  },
  input: {
    width: "95%",
    backgroundColor: '#ffffff',
    // boxShadow:"0 4px 8px rgba(0, 0, 0, 0.84)",
    // height: 50,
    padding: 15,
    maxHeight: 300,
    // minHeight: 50,

    borderRadius: 30,
    elevation:2, 
    color: '#000000', 

  },
  Button: {
    marginRight: 30,
    alignSelf:"flex-end",
    backgroundColor: '#e5e5e5',
    boxShadow:"0 4px 8px rgba(0, 0, 0, 0.49)",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  sendText: {
    color: '#333',
    fontWeight: 'bold',
  },
  appContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});


const darkstyles = StyleSheet.create({
  container: {
    flex: 1,
    position:"relative",
    borderRadius: 20,
    backgroundColor: '#121212', // Dark background
    justifyContent: 'space-between',
  },


  userprompt: {
    borderWidth:0.1,
    borderColor: "lightgray",
    marginTop: 10,
    backgroundColor: "rgb(27, 27, 27)",
    fontFamily: "monospace",
    maxWidth: "80%",
    fontSize: 16,
    padding: 10,
    borderRadius: 20,
    textAlign:"left",
    color: "rgb(253, 253, 253)",
    fontWeight: 'bold', // Fixed missing comma
  },
  transcriptview:{
    boxShadow:"0px 4px 8px rgba(0, 0, 0, 0.37)",
    backgroundColor: "rgba(2, 2, 2, 0.38)",
    margin:20,
    borderRadius: 10,
  },
  aiprompt: {
    marginTop: 10,
    maxWidth: "80%",
    fontFamily: "SpaceMono",
    fontSize: 16,
    padding: 4,
    borderRadius: 20,
    textAlign:"center",
    color: "rgb(205, 179, 163)",
  },
  emojis: {
    position:"absolute",
    right: 0,
    bottom: -5,
    fontSize: 20
  },

  processContainer: {
    // margin: 10,
    // borderWidth:1,
    padding: 10,
  },
  optionButton: {
    backgroundColor: '#1f1f1f', // Dark button background
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    borderRadius: 10,
    boxShadow:"0 4px 8px rgba(0, 0, 0, 0.84)",
    // elevation: 2,
    // width: '80%',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 12,
    color: '#ffffff', // White text for buttons
  },
  inputContainer: {
    // position:"absolute",
    // bottom: 0,
    padding: 10,
    flexDirection: 'column',
    gap: 10,
    alignItems: 'center',
    alignSelf:'center',
    width:"100%",
     backgroundColor: 'rgb(34, 32, 32)'
  },
  input: {
 
    width: "95%",
    backgroundColor: 'rgb(96, 87, 87)', // Darker input background
    // boxShadow:"0 4px 8px rgba(0, 0, 0, 0.84)",
    // minHeight: 50,
    padding: 15,
    maxHeight: 300,
    borderRadius: 30,
    elevation:2, 
    color: '#ffffff'
  },
  // inputText:{
  //  , // Light text inside input
  // },
   Button: {
    marginRight: 30,
    alignSelf:"flex-end",
    backgroundColor: '#333333', // Dark button background
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  sendText: {
    color: '#ffffff', // Light text for the button
    fontWeight: 'bold',
  },
  appContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212', // Dark theme background
  },
});
