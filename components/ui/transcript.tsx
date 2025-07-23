import { Text, StyleSheet, useColorScheme, FlatList, View, Platform } from 'react-native';
import { BlurView } from "expo-blur";
import { useRef, useState } from 'react';

export default function TranscriptView({Messages, flatListRef, userScroll}:{Messages: {responder: "AI" | "user", message: string}[], flatListRef: any, userScroll: any}){
    console.log("Transcript Rendered")
    const colorScheme = useColorScheme();
    const styles = colorScheme == "dark" ? darkstyles : lightstyles;
    const [transcript, setTranscript] = useState('');
    
    return (
        <BlurView intensity={Platform.OS == 'web' ? 20 : 100} experimentalBlurMethod= {Platform.OS == "web" ? "dimezisBlurView" : "none"} tint={Platform.OS == 'web' ? 'systemThickMaterialDark': 'systemChromeMaterialDark'} style={{top: 0, borderTopRightRadius:20, borderTopLeftRadius:20, width:"100%", height:"100%", overflow:"hidden", position:"absolute"}}>
         <FlatList
          ref={flatListRef}
          data = {Messages}
          keyExtractor={(_, index)=>String(index)}
          renderItem={({item})=>{
            return (
              <View style={{ padding:10}}>
                {item.responder == "AI" && 
                 <><Text style={[styles.aiprompt, {width: "70%",  alignSelf:"flex-end"}]}> Kore:</Text>
                    <BlurView intensity={70} experimentalBlurMethod = {Platform.OS == "web" ? "dimezisBlurView" : "none"} tint={'systemThickMaterialDark'} style={{ borderRadius: 10, width: "70%", alignSelf:"flex-end", overflow: 'hidden' }}>
                            <Text style={[styles.aiprompt,
                            { flex: 1, alignSelf: "flex-start", lineHeight: 25, paddingHorizontal: 10 }]}>
                              {item.message}
                            </Text>
                   </BlurView>
                </>
                }
                {item.responder == "user" &&
                    <><Text style={[styles.aiprompt, {width: "70%", alignSelf:"flex-start"}]}> You:</Text>
                     <BlurView intensity={10} experimentalBlurMethod = {Platform.OS == "web" ? "dimezisBlurView" : "none"} style={{borderRadius:10, width: "70%",  alignSelf:"flex-start", overflow: 'hidden'}}>
                                    <Text style={[styles.aiprompt,
                                    {flex: 1, alignSelf:"flex-start", lineHeight:25, paddingHorizontal: 10}]}>
                                    {item.message}
                                    </Text>
                     </BlurView> 
                   </>
                }
              </View>
                   
            );
          }}
          contentContainerStyle={{
            // flex:1,
            backgroundColor:"rgba(159, 153, 153, 0)",
            // borderWidth: 1,
            // borderColor:"white",
        //   padding: 10,
          paddingBottom: "130%",
        //   height:400
          }}
         showsVerticalScrollIndicator = {false}
         onScrollToIndexFailed={({index, highestMeasuredFrameIndex, averageItemLength})=>{
            console.log(index, highestMeasuredFrameIndex, averageItemLength)
          }}
          onScrollBeginDrag={()=>userScroll.current = false}
          onScrollEndDrag={()=>userScroll.current = true}
        />
      </BlurView>
    )
}

const lightstyles = StyleSheet.create({

  aiprompt: {
    // marginTop: 10,
    fontFamily: "SpaceMono",
    fontSize: 20,
    // padding: 4,
    textAlign:"left",
    color: "rgb(179, 123, 45)",
  },
})




const darkstyles = StyleSheet.create({
  aiprompt: {
    // marginTop: 10,
    // maxWidth: "80%",
    fontFamily: "SpaceMono",
    fontSize: 16,
    padding: 4,
    borderRadius: 20,
    textAlign:"justify",
    color: "rgb(205, 179, 163)",
  }
})