import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, StyleSheet, Platform, TouchableOpacity, View, Text, Modal, TextInput, useColorScheme, StatusBar, Animated, } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useDispatch, useSelector } from 'react-redux';


import { PersistsStateProp } from '@/store/Reducers/userReducer';
import { StateProp } from '@/store/Reducers/stateReducer';
// import ChangeImage from '@/components/imagePicker';
import { Ionicons } from '@expo/vector-icons';
import { Login } from '@/components/LoginScreen';
import { AnalysisInterface } from '@/components/AnalysisScreen';
// import { RelationLists } from '@/interfaces/Interface';
// import { RemoveRelation } from '@/components/AlertRemoveRelation';
import { useIsFocused } from '@react-navigation/native';
import { interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useSharedValue } from 'react-native-reanimated';
import { RetvrnScreen } from '@/components/ChatScreen';
import { BlurView } from 'expo-blur';


export default function HomeScreen() {

  // const contacts = useSelector((state: PersistsStateProp) => state.userData.relations);
  const [analysisScreen, setAnalysisScreen] = useState(false);
  // const [imagePicker, setImagePicker] = useState(false);

  // const [chatVisible, setChatVisibility] = useState<RelationLists | null>(null);
  // const [isRemRelation, setRemRelation] = useState<RelationLists | null>(null);
   
  const isFocused = useIsFocused();

  const colorScheme = useColorScheme();
  const inputStyle = colorScheme === "dark" ? styles.darkInput : styles.lightInput;
  const dispatch = useDispatch();



  const handleInputChange = (key: string, value: any) => {
  
  };

  

  const handleSubmit = () => {
    // console.log("Form Submitted:", formData);
    
  };

  // const handleImageSelect = (imageInfo: any) => {
  //   // indicatorVisible(true);
  //   var base64_string = imageInfo ? imageInfo.base64 : null;
  //   handleInputChange("profileImg", `data:image/png;base64,${base64_string}`);
  //   //  setImagePicker(false); // Close ChangeImage component after selecting image 
  //  };
  const LoginPage = useMemo(() => (<Login />), [])

  function calcTime(visited_on: string | null): string | null{
    if(visited_on){
     const datetimeStrings = visited_on.split(",");
     const date = datetimeStrings[1].trim();
     const reversedDate = date.split("/").reverse().join("-").trim();

     const time = datetimeStrings[2].trim();
     const visitedDate = new Date(`${reversedDate}T${time}`);
    //  const newDate = new Date(reversedDate).toLocaleDateString() + "T" + time;
    const currentDate = new Date();

    // Calculate the time difference in milliseconds
    const diffMs = currentDate.getTime() - visitedDate.getTime();

    // Convert the difference into meaningful time units
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffMonths / 12);
    // Return the appropriate human-readable string
    if (diffYears > 0) return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
    if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffMinutes > 0) return `${diffMinutes} min${diffMinutes > 1 ? "s" : ""} ago`;
    console.log(visitedDate)
    
    return "just now"; // If it's less than a minute ago
    }

     return visited_on
  }

  function startAnalysis(): void {
    setAnalysisScreen(!analysisScreen)
  }

  return (
    <>
    <ParallaxScrollView
      HEADER_HEIGHT={350}
      headerBackgroundColor={{ light: '#A1CEDC', dark: 'rgb(215, 215, 215)' }}
      headerComponent={
                      <Image source={require('@/assets/images/RETVRN.png')} style={styles.retvrnLogo} resizeMode={"contain"} />
                   }>

      <ThemedView style={{ padding:10 }}>  
        <ThemedText style={styles.title}>Home</ThemedText>
        <ThemedView style={styles.contactsContainer}>
          {/* {contacts.map((contact, index) => (
            <TouchableOpacity key={index} onPress={()=>{setChatVisibility(contact)}} 
              onLongPress={()=>setRemRelation(contact)}>
              <ThemedView  style={styles.contact}>
                <Image source={contact.profileImg ? contact.profileImg : require("@/assets/images/default.png") } style={styles.image} />
                <ThemedText style={styles.name}>{contact.name}</ThemedText>
                {isFocused && <ThemedText style={styles.time}>{calcTime(contact.visited_on)}</ThemedText>}
              </ThemedView>
            </TouchableOpacity>
          ))} */}
        </ThemedView>
        {/* <TouchableOpacity style={styles.addButton} onPress={() =>  setBotScreen(!botScreen)}>
          <ThemedText style={styles.addButtonText}>🤖</ThemedText>
        </TouchableOpacity> */}
        <ThemedView style={{flex:1, gap:10, flexDirection: "row", flexWrap:"wrap",}}>
        <TouchableOpacity style={[styles.Cards, {backgroundColor: '#e5e5e5'} ]} onPress={() => startAnalysis()}>
                        <Text style={styles.sendText}>Voice Analysis</Text>
        </TouchableOpacity>
        </ThemedView>
        {analysisScreen && <AnalysisInterface screen={analysisScreen} setScreen = {setAnalysisScreen}/>}
        {/* {botScreen && <RetvrnScreen screen={botScreen} setScreen={setBotScreen} />} */}
       
        {LoginPage}
         
      </ThemedView>
      
      {/* { isRemRelation && <RemoveRelation chat={isRemRelation} setRemChat={setRemRelation}/>} */}
      
      {/* <Modal
        transparent={true}
        visible={formVisible}
        animationType="slide"
        onRequestClose={() => setFormVisible(false)}
      >
        
        <View style={styles.modalBackground}>

          <ThemedView style={styles.modalContent}>
            <Ionicons size={30} name="close" style={{ color: "darkred", alignSelf:"flex-start", width:60}} onPress={() => setFormVisible(false)} />

            <ThemedText style={styles.formtitle}>Add Relations</ThemedText>
                    {/* <View style={styles.profileContainer}>
                        <Image source={formData.profileImg ? formData.profileImg : require("@/assets/images/default.png")} style={styles.profileImage} />
                        <Ionicons name="create-outline" size={20} color={colorScheme === 'dark' ? "white" : "black"} style={ styles.editIcon } onPress = {(event)=>{ event.preventDefault(); 
                          // setImagePicker(true);
                          }}/>
                    </View> 
            <TextInput
              style={[styles.input, inputStyle]}
              placeholder="Name"
              placeholderTextColor="gray"
              value={formData.name}
              autoCapitalize="words"
              onChangeText={(text) => handleInputChange("name", text)}
            />
            
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
              <ThemedText style={styles.submitButtonText}>Submit</ThemedText>
            </TouchableOpacity>
            
          </ThemedView>
        </View>
      </Modal> */}

    </ParallaxScrollView>

    </>
  );
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
    transform:[{scale:1.5},
      {translateX:50}
    ]
    // alignSelf:"flex-start"
  },

  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  contactsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  contact: {
    alignItems: 'center',
    margin: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  time: {
    fontSize: 14,
    color: '#888',
  },
  addButton: {
    flex:1,
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center', 
    textAlign: "center",
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    alignSelf: "center",
    padding:10
  
  },


  openButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
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

  editIcon:{
    position: "absolute",
    bottom: 40,
    right: 40
},

  profileContainer: {
    width: 350,
   //  maxWidth:0,
    // height: "auto",
    alignItems: "center",
    padding:80
  },
  profileImage: {
    // flex:1,
    width: 200,
    height: 200,
    borderRadius: 100,
  },
 
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(76, 75, 75, 0.5)", // Transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    // backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  formtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },

  submitButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
  },
  sendText: {
    color: '#ffffff', // Light text for the button
    fontWeight: 'bold',
  },
   Cards: {
    margin: 10,
    marginVertical:50,
    height: 40,
    alignSelf:"flex-start",
    boxShadow:"0 4px 8px rgba(0, 0, 0, 0.49)",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
});
