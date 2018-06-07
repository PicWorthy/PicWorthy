 # PicWorthy
by Team Picworthy
 
## Link

http://picworthy.herokuapp.com/

## Team

- __Product Owner__: [William Cory](https://github.com/roninjin10)
- __Scrum Master__: [Christina Yuen](https://github.com/ceyuen)
- __Development Team Members__: [William Ha](https://github.com/wvha), [Sam Rosenblum](https://github.com/slrosenblum)

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Getting Started](#getting-started)
    1. [Installing](#installing)
    1. [Running](#running)
    1. [Overall Flow](#overall-flow)
    1. [Deployment](#deployment)

## Usage

Link: PicWorthy.herokuapp.com

Local: http://localhost:3000/

## Requirements

- Node 8.9.4
- React 16.3.1
- MongoDB 3.0.6
- Express 4.16.3

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

From within the root directory:

```
npm install
```

### Running

To start server: 

```
npm run server-dev
```

To start webpack: 

```
npm run react-dev
```

### Overall Flow 

After logging in, the page renders locations.jsx. A map will be displayed where the user can search for locations or click on a cluster. This is done within worthymap.jsx and uses [react-google-maps](https://tomchentw.github.io/react-google-maps/).

The user can scroll through pictures, click on them to see details, and favorite the place. This is separated into a few different components: picrow.jsx, card.jsx, and details.jsx. 

Any information sent to the server is sent using [Axios](https://github.com/axios/axios). Once the information gets to the server, [React-Router](https://reacttraining.com/react-router/web/guides/basic-components) is used to direct it to the proper controller method. 

The database consists of two schemas. One stores the image information and the other stores the user information. 

### Deployment 

Merge with mater branch of [PicWorthy](https://github.com/PicWorthy/PicWorthy) and Heroku will process updates automatically. 

