import { StyleSheet, Image, Platform, Button, View } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { logoutAction, setConnection } from '@/store/userAction';
import { useDispatch, useSelector } from 'react-redux';
import { StateProp } from '@/store/Reducers/stateReducer';
import { useNavigation } from '@react-navigation/native';

export default function TabThreeScreen() {

  const dispatch = useDispatch();
  const socket = useSelector((state: StateProp) => state.states.websocket);
  const navigation = useNavigation();
  const handleLogout = () => {
     dispatch(logoutAction());
     setTimeout(()=>{dispatch(setConnection(null, false));}, 1000)
     socket?.close();
     navigation.canGoBack() && navigation.goBack();
  }

  return (
    <ParallaxScrollView
      HEADER_HEIGHT={250}
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerComponent={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
        <ThemedView style={{ padding: 20, flex:1 }}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Settings</ThemedText>
          </ThemedView>
 
            <Collapsible title="Logout">
              <ThemedText type="default">⚠️ This will logout and clear all your data, please proceed with caution: </ThemedText>
              <ThemedView style={{width:200, marginLeft:20, padding:10}}>
                <Button title='Logout' color={'rgba(232, 16, 16, 0.75)'} onPress={handleLogout}/>
              </ThemedView>
            </Collapsible>
          </ThemedView>
    
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    padding: 20,
  },
});
