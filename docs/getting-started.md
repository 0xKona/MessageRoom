# Getting Started

- [NodeJS](https://nodejs.org/en/download/package-manager/current)
- [GO version 1.23.1 or higher](https://go.dev/doc/install)

- [Follow React Native setup guide](./react-native-setup.md)

## Once Setup

- run `npm install` at the root of the project
- run `npm start` to start the metro server and follow instruction to run on android.

## Running backend

Create a `.env` file in the root of the backend directory with the following variables:

```env
MONGO_DB=mongodb://127.0.0.1:27017
MONGO_DB_NAME=ws_chat_database-1
HTTP_PORT=8080
WEBSOCKET_PORT=8090 
```
    

The backend is written in GO and can be started either by:

- Running `cd backend` and then `go run main.go`

or by running 

- Running `npm run server` from the root of the project

## Setting server url

You can set the serverUrl and port for the frontend here [here](../app/config/config.json)

If running on emulators (Android) or simulator (iOS) localhost / 127.0.0.1 should work okay.

- Android physical device: If running on physical devices and using localhost remember to foward the port by running `adb reverse tcp:PORTNUMBERHERE tcp:PORTNUMBERHERE`

- You can also just use the host computers public ip address to let other devices not connected have access to the server.