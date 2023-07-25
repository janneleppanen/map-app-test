import {Button, TextInput, View} from "react-native";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {useState} from "react";
import React from "react";


export default function FrontScreen({navigation}) {
  const [apiKeyString, setApiKeyString] = useState(''); // The API key entered into the TextInput

  return (
      <>
        <Button title={'White House demo'} onPress={() => navigation.navigate('Map', {apiKey: 'd876ff0e60bb430b8fabb145'})}/>
        <View style={{flexDirection: 'row'}}>
          <TextInput placeholder={'Enter an API key for your solution'} placeholderTextColor={'#AAA'} onChangeText={setApiKeyString} style={{flex: 1, backgroundColor: Colors.white}}/>
          <Button title={'Go to map'} onPress={() => navigation.navigate('Map', {apiKey: apiKeyString})}/>
        </View>
      </>
  )
}
