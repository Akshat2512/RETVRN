// import { VisitTracker } from "@/components/charts/VisitTracker";
import { Collapsible } from "@/components/Collapsible";
import SelectDropdown from "@/components/SelectDropdown";
import ParallaxScrollView from "@/components/ParallaxScrollView";
// import { RelationStats } from "@/components/RelationStats";
import { ThemedText } from "@/components/ThemedText";
import { PersistsStateProp } from "@/store/Reducers/userReducer";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, View, StyleSheet, FlatList, Image, TouchableOpacity, Text, NativeSyntheticEvent, TargetedEvent } from "react-native";
// import { BarChart } from "react-native-gifted-charts";
import { useSelector } from "react-redux";


export default function TabTwoScreen() {
    console.log("Explore Rendered")
    const [selectedRelations, setSelectedRelations] = useState<number[]>([]);
    const [visibleName, setVisibleNames] = useState(NaN);
  
    // const data = [
    //   { x: 1, y: 100, color: '#FF0000' }, // Red bar
    //   { x: 2, y: 150, color: '#00FF00' }, // Green bar
    //   { x: 3, y: 80, color: '#0000FF' }, // Blue bar
    // ];

    const [relationLists, setRelations] = useState<{value:number, label:string}[]>();
   
    // const relations = useSelector((state: PersistsStateProp) => state.userData.relations);
    
   
    
 
    
    // function showName(id: number): void {
    //         setVisibleNames(id);
    //     }

    

    
const renderRelationStats = useMemo(()=>{

   return (<View style={styles.container}>
               {/* <RelationStats chatId={selectedRelations} /> */}
           </View> )  
}, [selectedRelations])


    return (

        <ParallaxScrollView
              HEADER_HEIGHT={360}
              headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
              headerComponent={
                <View>
              {/* <VisitTracker visits_section={visits_section} showName={setVisibleNames}/> */}
                </View>
            }>
         <View style={{  }}>
            {/* <Collapsible title="Clear All Data"> */}
            {/* <ThemedText type="defaultSemiBold"> Here are the stats: </ThemedText> */}
            
            <View style={styles.dropdown}>
                    <SelectDropdown
                        label="Select Relation"
                        options={relationLists?relationLists:[]}
                        value={selectedRelations}
                        onChange={setSelectedRelations}
                    />
            </View>
            {renderRelationStats}

            {/* </Collapsible> */}
        </View>
        </ParallaxScrollView>
    )
}


const styles = StyleSheet.create({
    
    container:{
        flex: 1,
        backgroundColor: "rgb(9, 60, 88)", 
    },
    dropdown: {
        position:"absolute",
        zIndex:1,
        alignSelf:"center",
        justifyContent: "center",
        padding: 20,
        // borderWidth:1
    },
    names: { 
        textAlign: "center", 
        alignSelf:"center", 
        width: 58, 
        color: "white",
        fontWeight:"bold", 
        letterSpacing:1, 
        lineHeight:12, 
        fontSize:10
    }
   
    

  });