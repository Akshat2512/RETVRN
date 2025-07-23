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
import WaveComponent from './RecordingWave';
import { store } from '@/store/store';
import { setAnalysisStatus } from '@/store/userAction';
import PopupView from './ui/popup';
// import { BlurView } from 'expo-blur';



export function AnalysisInterface({screen, setScreen}: {screen: any, setScreen:any}) {
  console.log("ChatStyleInterface rendered")
 
  const colorScheme = useColorScheme();
  const styles = colorScheme == "dark" ? darkstyles : lightstyles;
  const [transcript, setTranscript] = useState(false);
  const connected = useSelector((state:StateProp)=> state.states.connection)


  const transcription = useSelector((state: StateProp) => state.states.transcription);
  const transcribing = useSelector((state: StateProp) => state.states.transcribing);
  const analysis_stats = useSelector((state: StateProp) => state.states.AnalysisStatus);

  const [microphone, toggleMicrophone] = useState(false);

  const rec_state = useRef<(arg: boolean) => void>(()=>{});

  const socket = useSelector((state: StateProp) => state.states.websocket);

  const [textInput, setTextInput] = useState("");
  
  
  const dispatch = useDispatch();

  // const 

  // const renderHeader = useMemo(() => <OrbAnimation />, []);
 

 function toggleTranscript()
 { 
      transcript 
      ? sendMessage(JSON.stringify({Type:"transcription", "status": false})) 
      : sendMessage(JSON.stringify({Type:"transcription", "status": true})) 

      setTranscript(!transcript)
            
 }

 useEffect(() => {
   microphone
   ? null
   : ( transcript && sendMessage(JSON.stringify({Type:"transcription", status: false})) && setTranscript(false) )

 }, [microphone])

useEffect(()=>{
 if(analysis_stats){
    if(analysis_stats == "Ready"){
      setTimeout(()=>{
         dispatch(setAnalysisStatus(null));
      }, 3000)
    }
    // else()
 }
console.log(analysis_stats)
 return()=>{
  store.getState().states.AnalysisStatus = null;
 }
}, [analysis_stats])

  const emojis: { [key: string]: string } = {
    "happy"    :  "😊",
    "sad"      :  "😔",
    "excited"  :  "😀",
    "annoyed"  :  "😒",
    "nervous"  :  "😅",
    "confused" :  "😕",
    "angry"    :  "😡",
    "neutral"  :  "😑", 
  }

  const waveRef = useRef(null);
  const scrollRef = useRef<ScrollView>(null);
  const userScroll = useRef(true);
 
  function scrolltobottom(){
    userScroll.current && scrollRef.current?.scrollToEnd({animated: true})
  } 


 const userScript = useRef('>');
 const briefScript = useRef('');
 const empScript = useRef(false);
   
 const [viewScript, viewTranscript] = useState(false);
  
  useEffect(() => {
    scrolltobottom();
    if(transcription.length)
    {
      const token = transcription.shift();
      if(empScript.current){
        empScript.current = false;
        briefScript.current = "";
        userScript.current = userScript.current + ">";
      }
      


      userScript.current = userScript.current + token;
      briefScript.current = briefScript.current + token; 
      if(token == '\n'){
        setTimeout(()=>{
          empScript.current = true;
        }, 1000);
      }
    }
  }, [transcription]);
  
  function onEndScrolling(): void {
     userScroll.current = true
  }

  function closeScreen(){
        setScreen(false);
        sendMessage(JSON.stringify({Type:"transcription", status: false})); 
        toggleMicrophone(false);
        setTranscript(false);
  }

  function startAnalysis(): void { 
      toggleMicrophone(false);
      sendMessage(JSON.stringify({Type:"ai_analysis", status: true, session_id: store.getState().userData.sessions.length})); 
  }
  

  return (
    <Modal
      style = {{zIndex:0}}
      transparent={true}
      visible={screen}
       
      animationType="slide"
      
      onRequestClose={() => closeScreen()}
    >
      <View style={styles.container}>
        <Ionicons size={30} name="close" style={{right: 10, top:10, color: "darkgray", alignSelf:"flex-end", width:30}} onPress={()=>closeScreen()} />
            <WaveComponent ref={waveRef} />
    
       <View style={{flex:1,  justifyContent:'flex-end'}}>
           
           { transcript && (viewScript ? 
                  <ScrollView 
                      ref = {scrollRef}
                      contentContainerStyle={{  overflow:Platform.OS == "android" ? "scroll" : "hidden", justifyContent:'center'}} 
                      showsVerticalScrollIndicator={false} 
                      showsHorizontalScrollIndicator={false}
                      keyboardShouldPersistTaps="always"
                      onScrollBeginDrag={() => userScroll.current = false}
                      onScrollEndDrag={() => onEndScrolling()}
                      >
                      <TouchableOpacity activeOpacity={0.7} onPress={()=>{setTimeout(()=>scrolltobottom(), 1000); viewTranscript(false)}} style={{flex: 1,  padding:10}}>
                        <Text style={[styles.aiprompt, {flex: 1, alignSelf:"center", lineHeight:30, textAlign: 'left',  padding:10, minWidth: 200, minHeight: 220}]}>
                         {userScript.current}
                        </Text>
                      </TouchableOpacity>
                  </ScrollView>

              : <TouchableOpacity activeOpacity={0.7} onPress={()=>{viewTranscript(true)}} style={{ minHeight:30, padding:10 }}>
                  <Text style={[styles.aiprompt,{ alignSelf:"center", minWidth: 200, lineHeight:30}]}>
                    {briefScript.current}
                  </Text>
                </TouchableOpacity>)
            }
            { /* <View style={styles.processContainer}>
                     <ThemedText>{transcribing}</ThemedText>
                 </View> */ }
            <PopupView>
              <Text>Hello</Text>
            </PopupView>
        </View>
          <View style={styles.inputContainer}>
          {/* <TextInput
            multiline={true}
            style={styles.input}
            value={textInput}
            onChangeText={setTextInput}
            placeholder="Ask me anything..."
            placeholderTextColor="gray"
          /> */}
            {
            <>

            <View style={{ flexDirection: "row", alignSelf: "flex-end" }}>
              <TouchableOpacity style={[styles.Button, transcript && { backgroundColor: "rgb(147, 241, 109)" }]} onPress={() => toggleTranscript()}>
                <Text>📃</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.Button, microphone && { backgroundColor: "rgb(147, 241, 109)" }]} onPress={() => toggleMicrophone(!microphone)}>
                <Recorder type={"analysis_recording"} socket={socket} microphone={microphone} ReWavRef = {waveRef} />
              </TouchableOpacity>
             
               {(!analysis_stats || analysis_stats === "Failed") && (
                  <TouchableOpacity style={[styles.Button, analysis_stats && {backgroundColor: 'rgba(255, 86, 86, 1)'}]} onPress={() => startAnalysis()}>
                    {!analysis_stats ? <Text style={styles.sendText}>Analysis</Text> : <Text style={styles.sendText}>Retry</Text>}
                  </TouchableOpacity>
               ) }
               { (analysis_stats === "Start") && (
                 <View style={[styles.Button, {backgroundColor: 'rgb(0,0,0)'}]}><Text style={styles.sendText}>Analysing ...</Text></View>
               ) }
               { (analysis_stats === "Ready") && (
                    <View style={[styles.Button, {backgroundColor: 'rgba(6, 173, 20, 1)',}]}><Text style={[styles.sendText, {color: "rgba(29, 31, 28, 1)"}]}>Success</Text></View>
               ) }
              
            </View></>}
           </View>
          </View>
      
    </Modal>
  );
};



const lightstyles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    borderRadius:20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'space-between',
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
    // marginTop: 10,
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
    padding: 10,
    justifyContent: 'center',
    alignItems: 'flex-end',
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
    // padding: 20,
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
    backgroundColor: "rgb(48, 46, 40)",
    // margin:20,
    borderRadius: 10,
  },
  aiprompt: {
    // marginTop: 10,
    // maxWidth: "80%",
    fontFamily: "SpaceMono",
    fontSize: 16,
    padding: 4,
    borderRadius: 20,
    textAlign:"center",
    color: "rgb(205, 179, 163)",
    backgroundColor:"rgba(0, 0, 0, 0.2)"
  },
  emojis: {
    position:"absolute",
    right: 0,
    bottom: -5,
    fontSize: 20
  },

  processContainer: {
    margin: 10,
    padding: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
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
