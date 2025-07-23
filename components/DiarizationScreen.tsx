import { View, Text, Modal } from "react-native";




export function DiarizationScreen(){
    return (
        <Modal
            style = {{zIndex:0}}
              transparent={true}
              visible={true}
              animationType="slide"
            //   onRequestClose={() => setChat(false)}
            >
        <View>
            <Text>Hello</Text>
        </View>
        </Modal>
    )
}