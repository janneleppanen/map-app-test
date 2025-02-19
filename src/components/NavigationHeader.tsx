import {MPLocation} from "@mapsindoors/react-native-maps-indoors-mapbox";
import {Button, Text, View} from "react-native";
import {Colors} from "react-native/Libraries/NewAppScreen";
import React from "react";

const BoldText = (props: React.PropsWithChildren) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>

type NavigationHeaderProps = {
  searchResults: MPLocation[] | undefined;
  fromLocation: MPLocation | undefined;
  toLocation: MPLocation | undefined;
  getRoute: () => void;
}
export default function NavigationHeader({searchResults, fromLocation, toLocation, getRoute}: NavigationHeaderProps) {
  return (
    <View style={{flexDirection: 'column'}}>
      <View style={{
          flexDirection: 'row',
          backgroundColor: '#FFA8',
          marginVertical: 10,
          borderColor: Colors.dark,
          borderWidth: 1,
          display: fromLocation || toLocation || searchResults ? 'flex' : 'none'
        }}>
        <View style={{flex: 1, paddingHorizontal: 5}}>
          <Text style={{color: Colors.dark}}>
            <BoldText>From</BoldText> {fromLocation?.name} ({fromLocation?.venueName})
          </Text>
          <Text style={{color: Colors.dark}}>
            <BoldText>To</BoldText> {toLocation?.name} ({toLocation?.venueName})
          </Text>
        </View>
        <Button title={'Query'} onPress={() => {
          getRoute();
        }}/>
      </View>
    </View>
  )
}
