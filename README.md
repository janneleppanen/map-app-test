# Getting started projects

Set mapbox keys `<PK_KEY>`, `<SK_KEY>`  
`android/app/source/main/res/values/mapbox_access_token.xml`  
`ios/GettingStartedProject/Info.plist`


From the root of the project, open up a terminal and run `npm install`

```bash
npm install
```

If using iOS, Navigate inside the iOS folder in the terminal and run `pod install``

```bash
pod install
```

You should now be able to run the project by starting metro, and running either an android or iOS version. Theese commands should be run from root of the project

```bash
npm start #Starts metro
#Specific to running on android
npm run android
```

To start the application on iOS. Open the folder and open the .xcworkspace and run the application from xcode.
