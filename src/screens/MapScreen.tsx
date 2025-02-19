import {GestureHandlerRootView} from "react-native-gesture-handler";
import MapsIndoors, {
  MapControl,
  MapView,
 MPMapConfig,
} from "@mapsindoors/react-native-maps-indoors-mapbox";
import {Button, NativeEventEmitter,useWindowDimensions, View} from "react-native";
import React, {useEffect, useState} from "react";


export default function MapScreen({navigation, route}) {

  const [mapControl, setMapControl] = useState<MapControl>()

  const load = async () => {
    try {
      const {apiKey} = route.params;

      console.log('Loading MapsIndoors...', apiKey);
      await MapsIndoors.load(apiKey);

      console.log('Creating MapControl...');
      const mapControl = await MapControl.create(new MPMapConfig({useDefaultMapsIndoorsStyle: true}), NativeEventEmitter);
      setMapControl(mapControl);

      console.log('Moving to venue...');
      await mapControl.goTo((await MapsIndoors.getVenues()).getAll()[0]);

      console.log('Done!');

    } catch (e) {
      console.error('Error while loading MapsIndoors:', e);
      navigation.pop();
    }
  };

  // Load MapsIndoors when the app mounts, i.e. the MapView should be ready.
  useEffect(() => {
    load().catch((reason) => {console.error('MapsIndoors failed to load:', reason)});

    return () => {
      console.log('Clean data');
      MapsIndoors.destroy();
    }
  }, []); // NOTE: the second parameter deps: [] is important, otherwise it will load everytime the MapView changes

  const {width, height} = useWindowDimensions();

  return (
      <GestureHandlerRootView style={{flex:1, flexGrow:1}}>
        <MapView style={{
          width: width,
          height: height,
          flex: 1,
        }}/>

        <View style={{position: 'absolute', bottom: 0, padding: 40, width: '100%'}}>
          <Button
            title={'Settings'}
            onPress={() => navigation.navigate('Settings')}
          />
        </View>
      </GestureHandlerRootView>
  );
}
