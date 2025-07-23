import { store } from "@/store/store";
// import { AudioPlayer, createAudioPlayer, useAudioPlayer, useAudioSampleListener } from "expo-audio";
import { memo } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import  WebView from 'react-native-webview';
import { speech_html } from "./speechView";
import { calculateAmplitude } from "@/hooks/audioHandler";


function Speaker({ playerRef, startSpeech, resumeRec, wavRef }: { playerRef: React.RefObject<WebView | null>, startSpeech: (x:boolean) => void,  resumeRec: () => Promise<void>,  wavRef: any}) {
  console.log("render");
  store.getState().states.audioContext = Platform.OS == 'web' ? new AudioContext() : null;


  return (
       Platform.OS == 'android' && <WebView
          ref = {playerRef}
          style={{ backgroundColor: "transparent"}}
          source={{ html: speech_html }}
          scalesPageToFit={false}
          originWhitelist={['*']}
          scrollEnabled={true}
          automaticallyAdjustContentInsets={false}
           allowsInlineMediaPlayback={true}
           mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled={true}
          androidLayerType="hardware" // For Android, ensures transparency works
          onMessage={(event) => {
            // console.log("Message:", event.nativeEvent.data)
            if (isNaN(parseInt(event.nativeEvent.data))) {
              console.log(event.nativeEvent.data)
              if(event.nativeEvent.data == "<Rerender>")
                Platform.OS == 'android' && resumeRec();
                startSpeech(false)
                setTimeout(()=>{startSpeech(true);}, 500)
              return
            }
            const peak = calculateAmplitude(parseInt(event.nativeEvent.data));
            wavRef.current?.animateAmp(peak);
 
          }}

        />
  );
}

export default memo(Speaker);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  sendText: {
    fontWeight: 'bold',
  },
 

});

