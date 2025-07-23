
import { PropsWithChildren, ReactElement } from "react";
import { StyleSheet, View } from "react-native";



export default function PopupView({ children }: PropsWithChildren<{}>){
 return (
    <View style={styles.container}>
     {children}
    </View>
 )
}

const styles = StyleSheet.create({
    container:{
     position: 'absolute',
    //  backgroundColor:"white",
    //  height: "100%",
     width: "100%",
     zIndex: 4,
     justifyContent:"center",
     alignItems:"center",
     borderRadius: 10
    }
})