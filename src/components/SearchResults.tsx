import {MPLocation} from "@mapsindoors/react-native-maps-indoors-mapbox";
import React from "react";
import SearchResultItem from "./SearchResultItem";
import {BottomSheetFlatList} from "@gorhom/bottom-sheet";

type SearchResultsProps = {
  searchResults: MPLocation[] | undefined;
  setFromLocation: (location: MPLocation) => void;
  setToLocation: (location: MPLocation) => void;
  clickResult: (location: MPLocation) => void;
}

export default function SearchResults({searchResults, setFromLocation, setToLocation, clickResult}: SearchResultsProps) {

  return (
      <BottomSheetFlatList data={searchResults} keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => <SearchResultItem item={item} clickResult={clickResult} setFromLocation={setFromLocation} setToLocation={setToLocation} />}
      />
  )
}
