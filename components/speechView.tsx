

export const speech_html = `
<!DOCTYPE html>
<html>
<head>
<style>

body{
margin:0;
padding:0;
display: flex;
align-items: center;
height: 90vh;
}

.box {
   display: flex;
    height: 65px; 
    width: 72px; 
   overflow:hidden; 
   justify-content: center;
   transform: Scale(0.6)
}

</style>
</head>
<body>

 <div class="box" >
 
</div>
 <script>
   
  
    const ctx = new AudioContext();
    let audioURLs = [];
    let player = null;
    var interval = null;


    function base64ToInt16Array(base64Data) {
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

    function convertIntoInt16Array(byteString) {
      // window.ReactNativeWebView.postMessage(byteString)
      const buffer = base64ToInt16Array(byteString);
   
      const blob = new Blob([buffer], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
 
      audioURLs.push(url);
      const num = audioURLs.length.toString();
      window.ReactNativeWebView.postMessage(num);
    }


    function trackerAmps(playr, url){
    
         const source = ctx.createMediaElementSource(playr);
         const analyser = ctx.createAnalyser();

         source.connect(analyser);
         analyser.connect(ctx.destination);

         // Configure analyser
         analyser.fftSize = 2048;
         const bufferLength = analyser.frequencyBinCount;
         const data = new Uint8Array(bufferLength);
        
         // Start playback
         playr.play();

         let endloop = false;
         setTimeout(()=>{
         endloop = true;
         URL.revokeObjectURL(url);
         }, 2000);
            
        
         // Log amplitude data every frame
         function trackAmplitude() {
            analyser.getByteTimeDomainData(data);
            let peak = Math.max(...data); // Find loudest value right now
            peak = peak.toString();
            window.ReactNativeWebView.postMessage(peak);
        
            if (endloop){
               return
            }
            
            requestAnimationFrame(trackAmplitude); // Keep checking
         }

         trackAmplitude();
    }

    function playAudio(){
      if(interval){
      clearInterval(interval);
      }
      const startPlayer = ()=>{
      if(audioURLs.length>0)
      { 
         const url = audioURLs.shift();
         const player = new Audio(url);
         trackerAmps(player, url)
      }
      else{
         window.ReactNativeWebView.postMessage("<Rerender>")
         clearInterval(interval);
      }

      }

      if(player)
        player.pause();
      startPlayer();
      interval = setInterval(startPlayer, 2000)
      }

 
 </script>
</body>
</html>

`