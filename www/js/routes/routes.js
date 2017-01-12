angular.module('app.routes', []).config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.navBar.alignTitle('left');
  

  $stateProvider
  .state('app', {
    url: "/app",
     templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.schedules', {
      url: "/schedules",
      views: {
        'tab-schedule': {
          templateUrl: "templates/schedules.html",
          controller: 'SchedulesCtrl'
        }
      }
    })

  .state('app.map', {
      url: "/map",
      views: {
        'tab-schedule': {
          templateUrl: "templates/map.html",
          controller: 'SchedulesCtrl'
        }
      }
    })

  .state('app.setAppointment', {
    url: "/setAppointment/",
    views: {
      'tab-appointment': {
        templateUrl: "templates/setAppointment.html",
        controller: "newAppointmentCtrl"        
      }
    }
  })

  .state('app.appointment', {
    url: "/appointment",
    views: {
      'tab-appointment': {
        templateUrl: "templates/appointment.html",
        controller: 'newAppointmentCtrl'
      }
    }
  })

  .state('app.history', {
    url: "/history",
    views: {
      'tab-history': {
        templateUrl: "templates/history.html",
        controller: 'hisotryCtrl'
      }
    }
  })

  .state('app.newUser', {
    url: "/newUser",
    views: {
      'tab-settings': {
        templateUrl: "templates/newUser.html",
        controller: 'AppCtrl'
      }
    }
  })

  .state('app.profile', {
    url: "/profile",
    views: {
      'tab-profile': {
        templateUrl: "templates/profile.html",
        controller: 'ProfileCtrl'
      }
    }
  })

   .state('app.validationCode', {
    url: "/validationCode",
    views: {
      'tab-settings': {
        templateUrl: "templates/validationCode.html",
        controller: 'AppCtrl'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise("/app");
});