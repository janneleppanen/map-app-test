import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import React from "react";
import FrontScreen from "./screens/FrontScreen";
import MapScreen from "./screens/MapScreen";

function App(): React.JSX.Element {
  const Stack = createNativeStackNavigator();

  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name={'Front'} component={FrontScreen}/>
          <Stack.Screen name={'Map'} component={MapScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
  )
}

export default App;
