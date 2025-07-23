import { useEffect, useMemo, useRef, useState } from 'react';
import { View,Text, StyleSheet, Button, Alert, TouchableOpacity, Platform, NativeModules } from 'react-native';


import { setAudioModeAsync, useAudioPlayer, useAudioSampleListener } from 'expo-audio';
import {useAudioRecorder, RecordingConfig, ExpoAudioStreamModule } from '@siteed/expo-audio-studio';
import * as FileSystem from 'expo-file-system';
import { sendMessage } from '@/hooks/handleMessages';
import { useSelector } from 'react-redux';
import { StateProp } from '@/store/Reducers/stateReducer';
import { Asset } from 'expo-asset';
import { base64ToInt16Array, handleIncomingAudio, int16ArrayToBase64, playBufferAud } from '@/hooks/audioHandler';
import Speaker from './speech';
import WebView from 'react-native-webview';


export function Recorder({type, socket, microphone, ReWavRef, CoWavRef}:{type: string, socket: WebSocket | null, microphone: boolean, ReWavRef: any, CoWavRef?: any}) {
  //  console.log("Rendering Recorder")
    const [recording, setRecording] = useState(false)
    const audiouri = useRef<string>("");
    const audio_queue = useRef<(Int16Array | Float32Array)[]>([]);
    const interval = useRef<NodeJS.Timeout | number | null>(null);
    
    const isPlaying = useRef(false);
   


    const [speech, startSpeech] = useState<boolean>(true);

    useEffect(()=>{
      microphone ? handleStart() : handleStop();
    }, [microphone])

    const int = useRef(null);
   
       
    const {
        prepareRecording,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        isRecording,
        isPaused,
        // durationMs,
        // size,
        // analysisData,
        // compression,
    } = useAudioRecorder()

 const config: RecordingConfig = {
                interval: 200, // Emit recording data every 200ms
                enableProcessing: false, // Enable audio analysis
                sampleRate: 16000, // Sample rate in Hz (16000, 44100, or 48000)
                channels: 1, // Mono recording
                encoding: 'pcm_16bit', // PCM encoding (pcm_8bit, pcm_16bit, pcm_32bit)
                showWaveformInNotification: false,
             
                android: {
                  audioFocusStrategy: "none"
                } ,
                deviceDisconnectionBehavior: "fallback",
                
                // Optional: Handle audio stream data
                onAudioStream: async (audioData) => {
                    // console.log(`onAudioStream`, audioData.eventDataSize)
                    // socket?.send(audioData.data)
                    let samples: Int16Array | Float32Array | null = null;
                    if(typeof(audioData.data)=='object')
                    { 
                      samples = audioData.data;
                      audio_queue.current.unshift(audioData.data)

                    }
                    else if (typeof(audioData.data)=='string'){
                    // const buffer = new Float32Array(base64ToInt16Array(audioData.data).buffer)
                      const buffer = base64ToInt16Array(audioData.data);
                      samples = buffer;
                      audio_queue.current.unshift(buffer)
                    }
                     
                     if (samples) {
                        // console.log(samples.byteLength)

                        const amp = calculateAmplitude(samples);
             
                        if(!CoWavRef) 
                          ReWavRef.current?.animateAmp(amp);
                        
                      }
                     
                },
                
                // // Optional: Handle audio analysis data
                // onAudioAnalysis: async (analysisEvent) => {
                //     console.log(`onAudioAnalysis`, analysisEvent)
                // },
                
                // Optional: Handle recording interruptions
                onRecordingInterrupted: (event) => {
                    console.log(`Recording interrupted: ${event.reason}`)
                },
                
                // Optional: Auto-resume after interruption
                autoResumeAfterInterruption: false,
              
            }


    useEffect(() => {
      const prepare = async () => {
        await prepareRecording(config);
        // console.log('Recording resources prepared and ready');
      };
      
      prepare();
    }, []);


    useEffect(()=>{
        // run();
        // fileInfo();
 
        
        return () => {
            handleStop()
            int.current && clearInterval(int.current);
            // startSpeech();
         
         }
    }, [])
   

    const deleteAudioFiles = async () => {
        try {
          // Get the document directory
          const internalDir = FileSystem.documentDirectory;
  
          if(internalDir)
          {
          const files = await FileSystem.readDirectoryAsync(internalDir);
          // console.log('Files in internal storage before deletion:', files);
  
          // Filter `.wav` files and delete them
          for (const file of files) {
            if (file.endsWith('.wav')||file.endsWith('.opus') || file.endsWith('.aac')) {
               const fileInfo = await FileSystem.getInfoAsync(internalDir + file);
               const fileSize = fileInfo.exists ? fileInfo.size : 0;
              await FileSystem.deleteAsync(internalDir + file);
              // console.log(`Deleted: ${file}, Size: ${fileSize}`);
            }
          }

        }
        } catch (error) {
          // console.error('Error deleting files:', error);
        }
      };
   
    useEffect(() => {
    if(!recording)
    { 
      sendMessage(JSON.stringify({"Type": type, "status": recording}))
      deleteAudioFiles();
      CoWavRef?.current?.animateAmp(0);
      ReWavRef.current?.animateAmp(0);
      // console.log(recording)
    }
    else
     sendMessage(JSON.stringify({"Type": type, "status": recording}))
      }, [recording]);

    
    function mapAmplitudeToPercent(amp: number, minAmp = 121, maxAmp = 3000) {
      if(amp<121){
        return 0
      }
      const norm = Math.max(0, Math.min(1, (amp - minAmp) / (maxAmp - minAmp)));
      return Math.round(norm * 100);
    }

    function calculateAmplitude(samples: Int16Array | Float32Array) {
          let sumSquares = 0;
          for (let i = 0; i < samples.length; i++) {
            sumSquares += samples[i] * samples[i];
          }
          const rms = Math.sqrt(sumSquares / samples.length);
          // // Reference value for PCM 16-bit is 32768, for Float32 is 1.0
          // const ref = samples instanceof Int16Array ? 32768 : 1.0;
          // const db = 20 * Math.log10(rms / ref);
          const mapped_rms = mapAmplitudeToPercent(rms);
          return mapped_rms;
    }
      
    // const filteraudio = (audioData: Int16Array) => {
    //       if(audio)
    // }



    const handleStart = async () => {


        if(interval.current)
          clearInterval(interval.current);
        // const stream = new InputAudioStream( AUDIO_SOURCES.VOICE_COMMUNICATION, 44100, // Sample rate in Hz. CHANNEL_CONFIGS.MONO, AUDIO_FORMATS.PCM_16BIT, 4096, // Sampling size. );
        

        const { status } = await ExpoAudioStreamModule.requestPermissionsAsync()
          if (status !== 'granted') {
            return 
          }

        setAudioModeAsync({
          shouldRouteThroughEarpiece: false,
          // interruptionModeAndroid:"doNotMix"
        });
    
        if (status) {

            await startRecording(config);
            setRecording(true);
            interval.current = setInterval(handleAudioStream,100)
          
        }
    }
   
    const handleStop = async () => {
        if(interval.current)
            clearInterval(interval.current);
       try{
        const recording = await stopRecording()
        audiouri.current = recording.fileUri;
       }
       catch(e){
          // console.log(e);
         }
        setRecording(false);
        audio_queue.current = []
    }
  



  const handleAudioStream = () => {
        if(audio_queue.current.length !=0)
       {  
            if (socket?.readyState === WebSocket.OPEN) {
             
                const audioData = audio_queue.current.pop();
                if (audioData !== undefined) {
                    socket.send(audioData);
                }
            } 
        } 
        // else
        // {
        // console.log('audioQueue is empty!')
        // }
  }

  const audioList = useSelector((state: StateProp)=> state.states.bot_stream.voice_data);

  const buffer = useRef<string[]>([]);
  const playerRef = useRef<WebView | null>(null);
  const playQueRef = useRef<number>(null);
  const playerWebRef = useRef<HTMLAudioElement>(null);

  useEffect(()=>{
    if(audioList.length>0)
    try{
    const run = async () => {
    
      const audio : {id: number, base64: string} | undefined = audioList.shift();

      if (typeof audio?.base64 === 'string') {
      
       if(Platform.OS == "android"){
      
           if (playerRef.current) {
            const safeBase64 = audio.base64.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
            
           if(audio?.id == 1){
              pauseRecording();         
              playerRef.current?.injectJavaScript(`audioURLs = [];`);
           }
            
            playerRef.current?.injectJavaScript(`
              convertIntoInt16Array("${safeBase64}");
              true;
            `);
        
          }
              
          if(audio?.id == 1){
              playerRef.current?.injectJavaScript(`playAudio();`);
          }
            // const fileUri = await handleIncomingAudio(audio.data, `temp_${audio.id}.wav`);
            // console.log(fileUri)
            // audios.current.push(fileUri);
      }
      else if(Platform.OS == "web"){
        
      if(audio?.id == 1){
        buffer.current = [];
        // isPlaying.current = true;
      }
        const bytes = base64ToInt16Array(audio.base64)
        const blob = new Blob([bytes], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        buffer.current.push(url);
    
      if(audio?.id == 1){
        playBufferAud(playQueRef, playerWebRef, buffer.current, CoWavRef);
      }

      }

      }
    }
   
    run();

  }
  catch(e){
    console.error(e)
  }
  return ()=> {

  }

  }, [audioList])


 


function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}





  return (
    <View style={styles.container}>
      <Text>🎙️</Text>
      {speech && 
        <Speaker 
        playerRef={playerRef} 
        startSpeech = {startSpeech} 
        resumeRec={resumeRecording} 
        wavRef={CoWavRef}
         />
      }
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  speech: {
    // fontWeight: 'bold',
  },

   sendButton: {
    marginRight: 40,
    alignSelf:"flex-end",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
});


