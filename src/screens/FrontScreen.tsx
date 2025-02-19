import {Button} from "react-native";
import React from "react";

const API_KEY = 'd876ff0e60bb430b8fabb145';

export default function FrontScreen({navigation}) {
  return (
      <>
        <Button title={'Go to the map'} onPress={() => navigation.navigate('Map', { apiKey: API_KEY })}/>
      </>
  )
}
