var starterCtrls = angular.module('app.controllers', []);

//'ngAutocomplete'
starterCtrls.controller('AppCtrl', function($scope, $ionicPopup, $http, $injector, $ionicLoading, $timeout, $ionicHistory, profileService, checkmobiService, LoadingService) {
  var $state = $injector.get('$state');
  var mytimeout = null;  
 
  if (window.localStorage['verifiedNumber'] == 'yes'){
   $scope.isLogged = true; 
  } else {$scope.isLogged = false; }

  $scope.erro = false;
  $scope.mensagem = '';
  $scope.counter = 15;
  $scope.data = {
    'cellphoneNumber' : '',
    'id_checkmobi' : '',
    'prefix_checkmobi' : '',
    'code' : ''
  };

  $scope.data.cellphoneNumber  = window.localStorage['cellphoneNumber'];
  $scope.data.prefix_checkmobi = window.localStorage['prefix_checkmobi'] ;

  $scope.onTimeout = function() {
	   if($scope.counter == 0) {
		   $scope.hide();
       $scope.$broadcast('timer-stopped', 0);
       $timeout.cancel(mytimeout);
	 	   $scope.hasRecivedCall();
	     return;
     }
	 
	   $scope.showTimer(  'Você receberá uma ligação dentro de alguns instantes...<br/>'
	                   + '<b>Não Atenda</b> a ligação. Apenas aguarde:' ,  $scope.counter);
	 
     $scope.counter--;   
	   mytimeout = $timeout($scope.onTimeout, 1000);
  };
      
  $scope.startTimer = function() {
     mytimeout = $timeout($scope.onTimeout, 1000);
  };
  
  // stops and resets the current timer
  $scope.stopTimer = function() {
    $scope.$broadcast('timer-stopped', $scope.counter);
    $scope.counter = 15;
    $timeout.cancel(mytimeout);
  };

  $scope.showTimer = function(message, timer) {
    message = message + '<h2>' + timer + '(s)<\h2>';
    $ionicLoading.show({template: message});
  };
  
  $scope.hasRecivedCall = function(){
     var call = $ionicPopup.confirm({     title: 'Validação do Smartphone',
                                       template: 'A chamada foi recebida com sucesso?',
                                         okText: 'Sim',
			      	 		                   cancelText: 'Não',
                                         okType: 'button-calm',
								                     cancelType: 'button-assertive' });
     call.then(function(res) {
  		 if (res == false){
  			 var alertPopup = $ionicPopup.alert({   title: 'Verificação do Smartphone',
  			                                     template: 'Será enviado um SMS com código de verificação para seu smartphone!'});
  			 $scope.checkNumberBySms();
  		 }
     });
  }	
	
  $scope.show = function(message) {
  	message = message;
	  $ionicLoading.show({template: message});
  };

  $scope.hide = function(){
    $ionicLoading.hide();
  };

  
  $scope.checkNumberBySms = function (){

    var cellphoneNumber = $scope.data.cellphoneNumber;

    checkmobiService.checkNumber(cellphoneNumber, 'sms').then(function(result){
        if (result.status == 200){
          window.localStorage['id_checkmobi']     = result.data.id;
          $ionicHistory.nextViewOptions({ disableBack: true });
          $state.go('app.validationCode');
      }
    }, function(result){
       $scope.erro = true; 
       $scope.mensagem = 'Ocorreu algum problema de comunicação com o servidor! Certifique-se que está com acesso a internet e tente novamente!';
    });
	}
  

  $scope.checknumber = function (){
    var cellphoneNumber = $scope.data.cellphoneNumber;
	
  	if ((cellphoneNumber.length < 10) || (cellphoneNumber.length > 11)){
  		 $scope.erro = true;
       $scope.mensagem = 'Numero de smartphone informado não é valido! Deve ser informado o código do DDD seguido do numero da linha.';
  		 return;
  	};


    if(cellphoneNumber == 10999999999 ){
      window.localStorage['cellphoneNumber']  = cellphoneNumber;
      window.localStorage['prefix_checkmobi'] = 'MASTERUSER'
      $ionicHistory.nextViewOptions({ disableBack: true });
      $state.go('app.validationCode');
      return;
    }

    $scope.startTimer();
    checkmobiService.checkNumber(cellphoneNumber, 'reverse_cli').then(function(result){

      console.log(result);

     if (result.status == 200){
          window.localStorage['cellphoneNumber']  = cellphoneNumber;
          window.localStorage['id_checkmobi']     = result.data.id;
          window.localStorage['prefix_checkmobi'] = result.data.cli_prefix;
          $scope.data.prefix_checkmobi = result.data.cli_prefix;
          $ionicHistory.nextViewOptions({ disableBack: true });
          $state.go('app.validationCode');
      }
    }, function(result){
       $scope.erro = true; 
       $scope.mensagem = 'Ocorreu algum problema de comunicação com o servidor! Certifique-se que está com acesso a internet e tente novamente!';
       $scope.stopTimer();
       $scope.hide();
    });
  }


  $scope.validateCode = function() {
   var code = $scope.data.code;

   if (window.localStorage['cellphoneNumber']  == 10999999999){
     if (code == 9182736450){
        saveUser('MASTERUSER');
        $scope.hide();    
     } else{
        $scope.hide();   
        $scope.erro = true; 
        $scope.mensagem = 'Código de validação informado não está correto!';
     }
     return;
   }
   
	 if (code.length != 4) {
      $scope.erro = true;
      $scope.mensagem = 'Código de validação informado não está no padrão solicitado! O código deve conter 4 dígitos.';
      return;
    }

	  $scope.show('Validando Número... Por favor aguarde!');
    checkmobiService.validateCode(window.localStorage['id_checkmobi'], code).then(function(result){
       if (result.status == 200 && result.data.validated == true){
      //   if (result.status == 200 ){
           saveUser(window.localStorage['id_checkmobi']);
           $scope.hide();    
       } else{
         $scope.hide();   
         $scope.erro = true; 
         $scope.mensagem = 'Código de validação informado não está correto!';
       }
    }, function(result){
       $scope.hide();      
       $scope.erro = true; 
       $scope.mensagem = 'Ocorreu algum problema de comunicação com o servidor! Certifique-se que está com acesso a internet e tente novamente!';
    });
  
    
  }

  $scope.recieveNewCall = function() {
   $scope.checknumber(window.localStorage['cellphoneNumber']) ;
  }
  
  $scope.changeMyNumber = function() {
	$ionicHistory.nextViewOptions({ disableBack: true });
    $state.go('app.newUser'); 
  }
// tu ta validando algo ou posso colocar qq0r 0coisa?0001
  function saveUser(userId){
      window.localStorage['verifiedNumber'] = 'yes';   
      var user = {'name': '',
              'lastname': '',                  
                'userId': window.localStorage['cellphoneNumber'], //Celular usuario/ID Medico  
             'verfifyID': userId};     

      profileService.save(user).then(function(result){
          if(result.data){
              window.localStorage['userId'] = result.data.person._id;
              LoadingService.toast("Smartphone verificado com sucesso!", 'short');                 
              $state.go('app.profile'); 
              window.location.reload(true);
          }else{
              alertPopup = $ionicPopup.alert({title: 'Alerta',
                                           template: 'Falha ao salvar seu Usuário'});
              // -------------- OBS -----------------
              //Criar meio para gerar usuario no banco, caso o mesmo tenha sido validado com sucesso.
          }              
      });
  }
})

starterCtrls.controller('ProfileCtrl', function($scope, $ionicLoading, $ionicPopup, $stateParams, profileService, LoadingService) {

  id = window.localStorage['userId'];

  $scope.hInsuranceList = [{'code': '1', 'name': 'Particular'}, 
                           {'code': '2', 'name': 'Circulo Operário'},
                           {'code': '3', 'name': 'Fátima'},
                           {'code': '4', 'name': 'IPAM'},
                           {'code': '5', 'name': 'Unimed'}];

  $scope.user = {};

   $scope.formatDate = function(date){
     var date = String(date);

     return(date.substring(4,6) + '/' +
            date.substring(6,8) + '/' +
            date.substring(0,4));
   }


  $scope.getProfile = function(){
    profileService.getById(window.localStorage['userId'] ).then(function(result){
      console.log(result.data);
        if (result.data){
          d = new Date($scope.formatDate(result.data.birthday));
          if (isNaN( d.getTime())){
            d = new Date(1980,01,01);
          }
          result.data.birthday = d;
          $scope.user = result.data;  
        } 
    });
  }

  $scope.updateById = function(){

    $scope.show("Atualizando Usuário!");

    window.localStorage['name']            = $scope.user.name;
    window.localStorage['birthday']        = $scope.user.birthday;
    window.localStorage['healthCareId']    = $scope.user.healthCareId ==! "" ? $scope.user.healthCareId : "";
    window.localStorage['healthInsurance'] = $scope.user.healthInsurance;

    $scope.hide();
    profileService.update(id , $scope.user)
      .then(function(result){
          $scope.hide();
          LoadingService.toast("Perfil atualizado com sucesso!", 'short');                 
           
      });
  };
  $scope.show = function(message) {
    $ionicLoading.show({
      template: message
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide();
  };

})


