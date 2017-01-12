angular.module('cmFunctions', [])

.service('LoadingService', function($ionicLoading, ionicToast, $ionicPopup){
  var service = this;

  //Loading
  service.show = function() {
    $ionicLoading.show({
       template: 'Buscando Informações...'
    });
  };

  service.refresh = function() {
    $ionicLoading.show({
       template: 'Atualizando dados'
    });
  };

  service.hide = function(){
    $ionicLoading.hide();
  };

  service.toast = function(msg, duration, position){
     ionicToast.show(msg, 'top', false, 1500);           
  };

  service.verifyError = function(title){
    //todo - check connection 
    var message = 'Falha na conexão com o servidor, verifique sua conexão com a internet e tente novamente!';
    var alertPopup = $ionicPopup.alert({title: title,
                                     template: message });
  }

})
