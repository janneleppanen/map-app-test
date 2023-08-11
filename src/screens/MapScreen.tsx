import {GestureHandlerRootView} from "react-native-gesture-handler";
import MapsIndoors, {
  MapControl,
  MapView, MPCameraUpdate, MPDirectionsRenderer,
  MPDirectionsService,
  MPFilter,
  MPLocation, MPMapConfig,
  MPQuery, MPRoute
} from "@mapsindoors/react-native-maps-indoors-google-maps";
import {Button, NativeEventEmitter, Text, useColorScheme, useWindowDimensions, View} from "react-native";
import SearchBox from "../components/SearchBox";
import BottomSheet from "@gorhom/bottom-sheet";
import NavigationHeader from "../components/NavigationHeader";
import SearchResults from "../components/SearchResults";
import RouteInstructions from "../components/RouteInstructions";
import React, {useEffect, useRef, useState} from "react";


export default function MapScreen({navigation, route}) {

  const [mapControl, setMapControl] = useState<MapControl>()

  const load = async () => {
    try {
      const {apiKey} = route.params;

      console.log('Loading MapsIndoors...');
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

  const clear = () => {
    setMPRoute(undefined);
    setToLocation(undefined);
    setSearchResults(undefined);
    setFromLocation(undefined);
  }

  const livedata = async () => {
    if (!mapControl) {
      console.warn("Must load MapsIndoors before enabling live data");
      return
    }

    await mapControl.enableLiveData('position');
    await mapControl.enableLiveData('availability');
    await mapControl.enableLiveData('occupancy');
  }

  const bottomSheet = useRef<BottomSheet>();

  const search = async (text: string | undefined) => {
    if (text === undefined) {
      console.debug('Cleaning search');
      setSearchResults(undefined);
      return;
    }

    console.debug(`Searching for "${text}"`);

    const query = MPQuery.create({query: text});
    const filter = MPFilter.create();

    const locations = await MapsIndoors.getLocationsAsync(query, filter)

    setSearchResults(locations);
    (bottomSheet.current as BottomSheet).expand();
  };

  const clickResult = (result: MPLocation) => {
    console.debug(result.name, result.buildingName, result.id, result.bounds, result?.position)
    mapControl?.goTo(result);
  };

  const [searchResults, setSearchResults] = useState<MPLocation[]|undefined>(undefined);

  const [fromLocation, setFromLocation] = useState<MPLocation>();
  const [toLocation, setToLocation] = useState<MPLocation>();

  const [mproute, setMPRoute] = useState<MPRoute>();
  const [routeLeg, setRouteLeg] = useState<number>();
  const [directionsRenderer, setDirectionsRenderer] = useState<MPDirectionsRenderer|undefined>(undefined);

  const getRoute = async () => {
    if (!fromLocation || !toLocation) {
      return
    }

    // Query route
    console.debug('Querying Route');
    
    //Creating the directions service, if it has not been created before.
    const directionsService = await MPDirectionsService.create();
    //Setting the travel mode to walking, to ensure instructions are for walking.
    await directionsService.setTravelMode('walking');

    let from = fromLocation.position
    let to = toLocation.position;
    console.debug({from}, {to})

    //Querying the route through the directionsService after 
    const route = await directionsService.getRoute(from, to);
    console.debug({route});
    setMPRoute(route);

    //Creating the directions renderer
    const directionsRenderer = new MPDirectionsRenderer(NativeEventEmitter);
    //Setting the route on the directions renderer, causing it to be rendered onto the map.
    await directionsRenderer.setRoute(route);

    setDirectionsRenderer(directionsRenderer);

    //Listen for leg changes
    directionsRenderer.setOnLegSelectedListener((leg) => {
      setRouteLeg(leg);
    });
  }

  // Load MapsIndoors when the app mounts, i.e. the MapView should be ready.
  useEffect(() => {
    load().catch((reason) => {console.error('MapsIndoors failed to load:', reason)});
  }, []); // NOTE: the second parameter deps: [] is important, otherwise it will load everytime the MapView changes

  useEffect(() => {
    if (!mproute && !searchResults) {
      console.debug('NO route or results')
      bottomSheet.current?.close();
      directionsRenderer?.clear();
    }
  }, [mproute, searchResults])

  const {width, height} = useWindowDimensions();

  return (
      <GestureHandlerRootView style={{flex:1, flexGrow:1}}>
        <MapView style={{
          width: width,
          height: height,
          flex: 1,
        }}/>
        <View style={{position: 'absolute', width: '100%', height: '100%', padding: 10, pointerEvents: 'box-none'}}>
          <SearchBox onSearch={search} onCancel={clear}/>
        </View>
        <View style={{position: 'absolute', bottom: 50, start: 10, flexDirection: 'column-reverse'}}>
          <Button title="livedata" onPress={livedata} />
        </View>
        <BottomSheet ref={bottomSheet} snapPoints={['15%', '60%']} index={-1} enablePanDownToClose={true} onClose={clear}>
          <NavigationHeader searchResults={searchResults}
            fromLocation={fromLocation}
            toLocation={toLocation}
            getRoute={getRoute}/>
          { mproute ?
            <RouteInstructions route={mproute} 
            goToPage={routeLeg} 
            onPrevious={() => directionsRenderer?.previousLeg()} 
            onNext={() => directionsRenderer?.nextLeg()}/>
            :
            <SearchResults searchResults={searchResults}
              setFromLocation={setFromLocation}
              setToLocation={setToLocation}
              clickResult={clickResult}/>
          }

        </BottomSheet>
      </GestureHandlerRootView>
  );
}
