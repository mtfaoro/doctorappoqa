angular.module('starter', ['ionic','ionic.rating', 'app.routes', 'app.controllers','doctorsCtrl', 'AppointmentCtrl', 'ionic-toast', 'cmServices', 'cmFunctions', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    
    var notificationOpenedCallback = function(jsonData) {
      console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
    };

                                      
    window.plugins.OneSignal.init("6941af11-bdad-4204-b8da-472b5e1172a5",
                                  {googleProjectNumber: "678621984564"},
                                  notificationOpenedCallback);
    
    // Show an alert box if a notification comes in when the user is in your app.
    window.plugins.OneSignal.enableInAppAlertNotification(true);

    window.plugins.OneSignal.getIds(function(ids) {
       window.localStorage['oneSignalId'] = ids.userId;
    });


    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
  });


})
.constant('Doctappbknd', {
  tableUrl: 'https://oquantoantes.herokuapp.com/api'
  //tableUrl: 'https://doctorappbknd.herokuapp.com/api'
  //tableUrl: 'http://localhost:3000/api'
})
.constant('Checkmobi', {
  url : 'https://api.checkmobi.com/v1/',
  key : 'AAFA04B3-698B-47FF-9CEA-F3B759CC5C74'
  /*email: 'caremobbr@gmail.com',
  password : 'caremob@BR1'*/
})
.constant('statusEnum', {
  HIT: 0,
  CONFIRMED: 1,
  CANCELED: 2,
  REALIZED: 3,
  NOTREALIZED: 4, 
  props: ["Marcada", 
          "Confirmada", 
          "Cancelada",
          "Realizada",
          "Não Realizada"]
})

.constant('rates', {
  ratingStates : [
      {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
      {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
      {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
      {stateOn: 'glyphicon-heart'},
      {stateOff: 'glyphicon-off'}
    ]
})
.directive('tabsSwipable', ['$ionicGesture', function($ionicGesture){
  //
  // make ionTabs swipable. leftswipe -> nextTab, rightswipe -> prevTab
  // Usage: just add this as an attribute in the ionTabs tag
  // <ion-tabs tabs-swipable> ... </ion-tabs>
  //
  return {
    restrict: 'A',
    require: 'ionTabs',
    link: function(scope, elm, attrs, tabsCtrl){
      var onSwipeLeft = function(){
        var target = tabsCtrl.selectedIndex() + 1;
        if(target < tabsCtrl.tabs.length){
          scope.$apply(tabsCtrl.select(target));
        }
      };
      var onSwipeRight = function(){
        var target = tabsCtrl.selectedIndex() - 1;
        if(target >= 0){
          scope.$apply(tabsCtrl.select(target));
        }
      };
        
        var swipeGesture = $ionicGesture.on('swipeleft', onSwipeLeft, elm).on('swiperight', onSwipeRight);
        scope.$on('$destroy', function() {
            $ionicGesture.off(swipeGesture, 'swipeleft', onSwipeLeft);
            $ionicGesture.off(swipeGesture, 'swiperight', onSwipeRight);
        });
    }
  };
}])
;



