# Volunteam App

## About the project

**Volunteam** is a mobile app where users can find events that need volunteers, apply to those events and become part of the events’ teams.

### Technologies

Libraries and frameworks used in this application:

-   [React Native](https://reactnative.dev/)
-   [Expo](https://expo.dev/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [React Native Maps](https://github.com/react-native-maps/react-native-maps)
-   [JSON Server](https://github.com/typicode/json-server)
-   [Axios](https://github.com/axios/axios)
-   [UUID](https://github.com/uuidjs/uuid)
-   [JWT Decode](https://github.com/uuidjs/uuid)

## Getting started

**Clone the project and access the folder**

```bash
$ git clone https://github.com/bvc-mobile-dev/volunteam && cd volunteam
```

**Install dependencies**

```bash
$ yarn
```

**Start fake API and authentication server**

```bash
$ npx json-server --watch db.json --port 3333 --host your_ip_address_here -m ./node_modules/json-server-auth
```

**Add image API key and start metro**

```bash
$ IMGBB_API_KEY="insert_your_api_key_here" npx expo start
```

### Well done, project is started!

---

## Setting up the fake API (json-server)

Update the file `src/services/api.ts`.

Before running your 'json-server', get your computer's IP address and update your baseURL to `http://your_ip_address_here:3333` and then run:

```
npx json-server --watch db.json --port 3333 --host your_ip_address_here -m ./node_modules/json-server-auth
```

To access your server online without running json-server locally, you can set your baseURL to:

```
https://my-json-server.typicode.com/<your-github-username>/<your-github-repo>
```

To use `my-json-server`, make sure your `db.json` is located at the repo root.

## Setting up the image upload API

Update the file `src/services/imageApi.ts`.

You can use any hosting service of your preference. In this case, we will use ImgBB API: https://api.imgbb.com/.
Sign up for free at https://imgbb.com/signup, get your API key and add it to the .env file in your root folder.

To run the app in your local environment, you will need to set the IMGBB_API_KEY when starting the app using:

```
IMGBB_API_KEY="insert_your_api_key_here" npx expo start
```

When creating your app build or publishing, import your secret values to EAS running:

```
eas secret:push
```
