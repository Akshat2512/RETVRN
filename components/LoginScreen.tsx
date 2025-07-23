
import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Platform , TouchableOpacity, View, Text, KeyboardAvoidingView, TextInput, Button, ActivityIndicator, Modal, GestureResponderEvent, AppState, AppStateStatus,} from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSelector, useDispatch } from 'react-redux';
import { connectWebSocket } from '@/hooks/Websocket';
import { PersistsStateProp } from '@/store/Reducers/userReducer';
import { StateProp } from '@/store/Reducers/stateReducer';
import { loginAction, setConnection } from '@/store/userAction';
import { HandleMessage, sendMessage } from '@/hooks/handleMessages';
import { store } from '@/store/store';

export function Login(){
   console.log("Login screen rendered")

   const colorScheme = useColorScheme(); // Returns 'light' or 'dark'

   // Define conditional styles based on the color scheme
   const inputStyle = colorScheme === "dark" ? styles.darkInput : styles.lightInput;


   const [username, setUName] = useState('');
//    const [password, setPassword] = useState('');
   const [loading, setloading]=useState(false);

    const isSignedIn = useSelector((state: PersistsStateProp)=>state.userData.isSignedIn);
    const userName = useSelector((state: PersistsStateProp)=>state.userData.userName);
    const connected = useSelector((state: StateProp) => state.states.connection);

    const dispatch = useDispatch();


    const [appState, setAppState] = useState(AppState.currentState);

    useEffect(() => {
      const handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (appState.match(/inactive|background/) && nextAppState === 'active') {
          // console.log('App has come to the foreground!');
          clearInterval(interval.current);
          if(isSignedIn)
            if(store.getState().states.websocket?.readyState == 0)
            { console.log("Still Connecting ..")}
            else
             interval.current = setInterval(sendPing, 1000)
          // Your on focus code here
        } else if (nextAppState.match(/inactive|background/)) {
  
          // console.log("Ready State: ", socket?.readyState)
          //   socket.current?.close();
          // console.log('App has gone to the background!');
        //   dispatch(setConnection(null, false));
          clearInterval(interval.current);
          // Your on unfocus code here
        }
        setAppState(nextAppState);
      };
  
      const subscription = AppState.addEventListener('change', handleAppStateChange);
  
      return () => {
        subscription.remove();
      };
    }, [appState]);
  
   

    const interval = useRef<any>(null);
   
    useEffect(()=>{
     if(isSignedIn){
      setTimeout(async ()=>{
        if(userName)
         await connectWS(userName);
        setloading(false);
       }, 0)
        // handleSubmit();
     }
    }, [isSignedIn]);


    async function sendPing(){
         const status = sendMessage(JSON.stringify({Type:"ping"}))
                if(status == "failed"){
                  console.warn("Failed to send packet ...")
                  clearInterval(interval.current)
                  userName ? await connectWS(userName) : null
                }
                else if(status == "connecting"){
                    console.log("Wait trying to connect ...")
                }
                else if(status == "closed"){
                  console.log("Websocket is closed") 
                  clearInterval(interval.current)
                  userName ? connectWS(userName) : null ;
                   
                }
    }

    useEffect(()=>{
        if(connected){
            // dispatch(setSender(() => sender({ Type: "default" })));
            clearInterval(interval.current);
            interval.current = setInterval(sendPing, 1000);
            
        }
          return () => {
                clearInterval(interval.current);
            }
        
     }, [connected])


    useEffect(()=>{
     if(isSignedIn==false){
        clearInterval(interval.current);
     }
     }, [isSignedIn])
   


    async function connectWS(uname: string): Promise<void> {
 
        try {
            const socket = await connectWebSocket(uname);
            if(socket)
            { socket.onmessage = async (event) => {

                const message = JSON.parse(event.data);
                  //  console.log(event.data)

                HandleMessage(message, dispatch);
            
              }
      
              socket.onclose = async() => {
                dispatch(setConnection(null, false));
                console.log("Websocket disconnected");
                // connecting.current = false;
              //  isSignedIn && alert("Websocket disconnected")
            
              }
            }
      
           
            console.log("Connected .."); 
            dispatch(setConnection(socket, true));  
        } 
          catch (error) {
            console.log("WebSocket connection failed:", error); 
            // if(isSignedIn)
            //  await connectWS(uname);
            alert("Websocket server error, try to restart the app")
            console.log("Failed WebSocket:", error); // Here `error` contains the rejected value (`socket`)
          }
       

    }

    async function handleSubmit() {
        dispatch(loginAction(username));
        setloading(true);

    }

    function handleUsername(text: string): void {
        text = text.replaceAll(" ","");
        setUName(text);
    }


    return (
        <>
        { !isSignedIn && <Modal transparent={false} visible={!isSignedIn} animationType="slide">
         <View style={{ flex: 1}}>
              <ThemedView style={[styles.container]}>
                  <ThemedView style={[styles.loginContainer]}>
                      <ThemedText style={[styles.login]} allowFontScaling={false}>Login Details</ThemedText>
                      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                          <ThemedView style={styles.input}>
                              <TextInput style={[styles.inputText, inputStyle]} value={username} onChangeText={handleUsername} placeholder="username ..." placeholderTextColor={'gray'} allowFontScaling={false} />
                              <ThemedView style={[styles.Indicator]}></ThemedView>
                          </ThemedView>
                      </KeyboardAvoidingView>
                      <Button title='Connect' onPress={handleSubmit} />
                  </ThemedView>
                  {loading && <ThemedView style={styles.overlay}><ActivityIndicator /></ThemedView>}
              </ThemedView>
    
      </View>
      </Modal>}
     </>
  )
    
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // borderWidth:1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    darkInput: {
        backgroundColor: '#333',
        color: '#fff',
        borderColor: '#555',
    },
    lightInput: {
        backgroundColor: '#fff',
        color: '#000',
        borderColor: '#ccc',
    },
    loginContainer: {
        // flex:1,
        borderWidth: 0,
        alignItems: 'center',
        justifyContent: 'center',
        // gap:10,
        paddingVertical: 15,
        paddingHorizontal: 20,
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.46)',

    },
    login: {
        padding: 10,
        fontSize: 20,
    },

    input: {
        flexDirection: 'row',
        width: 250,
        alignItems: "center",
        padding: 10,
    },

    inputText: {
        // flex:1,
        maxHeight: 40,
        borderColor: 'gray',
        width: 100,
        borderRadius: 10,
        marginRight: 10,
        borderWidth: 1,
        padding: 10,
        flexGrow: 1,

        // flexDirection:'row', 
    },
    Indicator: {
        // borderWidth: 1,
        padding: 4,
        borderRadius: 8,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 0,
    },


});