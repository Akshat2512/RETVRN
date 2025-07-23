import { Platform } from "react-native";
import * as FileSystem from 'expo-file-system';
import { store } from "@/store/store";


async function ensureFolderExists() {
    const folderUri = FileSystem.documentDirectory + 'audio-files/';
    const dirInfo = await FileSystem.getInfoAsync(folderUri);
    //  console.log(dirInfo)
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true });
    }
  }

export const handleIncomingAudio =  async (base64Audio: string , filename: string ) => {
   try{
   if( Platform.OS == "android") {
          await ensureFolderExists();
  
          // console.log(base64Audio);

          const folderUri = FileSystem.documentDirectory + 'audio-files/';
          const fileUri = folderUri + filename; // e.g., 'audio-files/sound1.wav'
          const base64audio = base64ToInt16Array(base64Audio)
          await FileSystem.writeAsStringAsync(fileUri, base64Audio, {
            encoding: FileSystem.EncodingType.Base64,
          });  
          // fileInfo();
          return fileUri;
     }
    }
    catch(e){
      console.error(e)
    }
     return "";
    }

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function playBufferAud(interval:React.RefObject<number | null>, player: React.RefObject<HTMLAudioElement | null>, objURLs:string[], CoWavRef: any) {
  // const byteCharacters = atob(base64);
  // const byteArrays = new Uint8Array(byteCharacters.length);
  // for (let i = 0; i < byteCharacters.length; i++) {
  //   byteArrays[i] = byteCharacters.charCodeAt(i);
  // }
  var i = 0;
  console.log(`Recieved First Chunk`)
  if(interval.current)
    clearInterval(interval.current);
  
  const startPlayer = ()=>{
    if(objURLs.length>0){ 
    const url = objURLs.shift();
    if(url){ 
      player.current = new Audio(url);
      player.current.play();
      trackerAmps(player.current, CoWavRef);
      console.log(`Recieved Chunk ${i}`)
      i = i+ 1;
    }
   }
    else{
      if(interval.current)
        clearInterval(interval.current);
    }

} 
 player.current?.pause();
 startPlayer();
 interval.current = setInterval(startPlayer, 2000);

}

export function base64ToInt16Array(base64Data: string) {
        // Step 1: Decode Base64 into binary string
        const binaryString = atob(base64Data);
    
        // Step 2: Create a Uint8Array from binary string
        const byteArray = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            byteArray[i] = binaryString.charCodeAt(i);
        }
    
        // Step 3: Convert Uint8Array to Int16Array
        const int16Array = new Int16Array(byteArray.buffer);
    
        return int16Array;
}


export function int16ArrayToBase64(int16Array: Int16Array): string {
  const buffer = int16Array.buffer; // Get the underlying ArrayBuffer
  const bytes = new Uint8Array(buffer); // View as byte array
  let binary = '';

  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary); // Encode binary string to Base64
}


// export const normalizedFloatValues = (array: Int8Array)=>{
//     const byteArray = new Int8Array(array);
//     const dataOffset = 44; // Standard WAV header length for PCM
//     const samples = [];

//     for (let i = dataOffset; i < byteArray.length; i += 2) {
//       // Little-endian 16-bit sample
//       const sample = byteArray[i] | (byteArray[i + 1] << 8);
//       const signedSample = sample > 32767 ? sample - 65536 : sample;
//       samples.push(signedSample / 32768); // Normalize to -1.0 ... 1.0
//     }
//     // console.log(samples.slice(0, 2048)); // First 10 normalized values

      
// }

  function mapAmplitudeToPercent(amp: number, minAmp = 128, maxAmp = 200) {
      if(amp<128){
        return 0
      }
      const norm = Math.max(0, Math.min(1, (amp - minAmp) / (maxAmp - minAmp)));
      // console.log(amp, norm)
      return Math.round(norm * 100);
    }

export function calculateAmplitude(amplitude: number) {
        
          const mapped_amp = mapAmplitudeToPercent(amplitude);
          return mapped_amp;
    }


    function trackerAmps(player: HTMLAudioElement, CoWavRef: any){
         const ctx = store.getState().states.audioContext;
         if (!ctx) {
           console.error("AudioContext is null");
           return;
         }
         const source = ctx.createMediaElementSource(player);
         const analyser = ctx.createAnalyser();
         if(analyser){
          source.connect(analyser);
          analyser.connect(ctx.destination);

          // Configure analyser
          analyser.fftSize = 2048;
          const bufferLength = analyser.frequencyBinCount;
          const data = new Uint8Array(bufferLength);
          
          // Start playback
          player.play();

          let endloop = false;
          setTimeout(()=>{
            endloop = true;
          }, 2000);
              
          
          // Log amplitude data every frame
          function trackAmplitude() {
              analyser.getByteTimeDomainData(data);
              let peak = Math.max(...data); // Find loudest value right now
              // console.log(peak);
              peak = calculateAmplitude(peak);
              CoWavRef.current?.animateAmp(peak);
          
              if (endloop){
                return
              }
              
              requestAnimationFrame(trackAmplitude); // Keep checking
          }

          trackAmplitude();
          }
    }