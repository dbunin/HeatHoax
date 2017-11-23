# Heat-Hoax Front End

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them


* NodeJS must be installed
* Yarn must be installed [Link](https://yarnpkg.com/lang/en/docs/install/)


### Installing

To install dependencies run:

```
yarn install
```

## Development
To run the project locally run: 
```
gulp dev
```
it will start a local server and serve the app on your browser

## Deployment

On deployment a dist folder containing the bootstrapped app must be created, to do this, run:
```
gulp build
```
Serve the "dist" folder in the server

to test the build locally run
```
gulp serve:dist
```

## Built With

* [AngularJS](https://angularjs.org/) - Web framework used
* [Leaflet](http://leafletjs.com/) - Map rendering framework
