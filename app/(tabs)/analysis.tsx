import { ThemedView } from "@/components/ThemedView";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity,StyleSheet, View, Text, Platform } from "react-native";
// import { LinearProgress } from '@expo/ui/swift-ui';

export default function AnalysisScreen(){

    
    function startAnalysis(): void {
        throw new Error("Function not implemented.");
    }

    return (
        <View>
            <ThemedView style={{flex:1, gap:10, flexDirection: "row", flexWrap:"wrap", top: 100}}>
                    <TouchableOpacity style={[styles.Cards,  ]} onPress={() => startAnalysis()}>
                             <MaterialIcons name="graphic-eq" size={50} color={"white"}/>
                                    <Text style={styles.sendText}>Voice Analysis</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.Cards]} onPress={() => startAnalysis()}>
                        {/* {Platform.OS == "android" && <LinearProgress progress={0.5} style={{ width: 300 }} color="red" /> } */}
                                    <Text style={styles.sendText}>Voice Analysis</Text>
                                    <Text style={styles.sendText}>Sessions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.Cards ]} onPress={() => startAnalysis()}>
                                    <Text style={styles.sendText}>Voice Analysis</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.Cards]} onPress={() => startAnalysis()}>
                                    <Text style={styles.sendText}>Voice Analysis</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.Cards ]} onPress={() => startAnalysis()}>
                                    <Text style={styles.sendText}>Voice Analysis</Text>
                    </TouchableOpacity>
            </ThemedView>
        </View>
    )
}



const styles = StyleSheet.create({

  retvrnLogo: {
    height: "100%",
    width: "100%",
    // flex:1,
    bottom: 0,
    left: 0,
    // position: 'absolute',
    // overflow:"visible",
    transform:[
      {scale:1.5},
      {translateX:50}
    ]
    // alignSelf:"flex-start"
   },
     sendText: {
    color: '#ffffff', // Light text for the button
    fontWeight: 'bold',
  },
   Cards: {
    margin: 10,
    marginVertical:50,
    height:100,
    alignSelf:"flex-start",
    justifyContent:"flex-end",
    boxShadow:"0 4px 8px rgba(0, 0, 0, 0.49)",
    backgroundColor: '#2a28288e',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
});
