var appointmentCtrl = angular.module('AppointmentCtrl', ['ionic-toast']);


//DoctorFactory

appointmentCtrl.controller('newAppointmentCtrl', function($scope, $ionicModal, $ionicPopup, $state, $ionicHistory, appointmentVO, ScheduleFactory, ScheduleService, LoadingService, statusEnum ) {
  
  $scope.appointmentVO = appointmentVO;  
  $scope.schdlFreeTime = ScheduleFactory.getList();
  $scope.mensagem = "";

  // Form data for the Appointments
  $scope.loginData = {};
  var _ctrl               = this,
      setAppointmentVO    = {};

  /* ----------------------------------------------------------------------------------------- */
  /* ----------------------------------- RATING DEFINITION ----------------------------------- */
  /* ----------------------------------------------------------------------------------------- */
  $scope.max = 5;
  $scope.setRate = function(value){
    $scope.rate = value;
  }
  $scope.setHidden = function(value){
    if(value > 0) {return false;}
    else {return true;}    
  }
  $scope.isReadonly = true;

  /* ----------------------------------------------------------------------------------------- */
  /* --------------------------------- AGRUPADOR ACCORDION ----------------------------------- */
  /* ----------------------------------------------------------------------------------------- */
  $scope.toggleGroup = function(day) {
    if ($scope.isGroupShown(day)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = day;
    }
  };
  $scope.isGroupShown = function(day) {
    return $scope.shownGroup === day;
  };
  //Seta horario escolhido para marcar a consulta.
  $scope.setChange = function(id, hour, day){
    setAppointmentVO._hourId = id;
    setAppointmentVO.hour    = hour;
    setAppointmentVO.eventDate = day;
  }

  $scope.verifyButton = function(hourChk){
    if (setAppointmentVO._hourId == hourChk._id){
      return true;
    }
    return false;
  }

  /* ----------------------------------------------------------------------------------------- */
  /* ----------------------------------- ZOOM DEFINITIONS ------------------------------------ */
  /* ----------------------------------------------------------------------------------------- */
  $ionicModal.fromTemplateUrl('templates/doctorsZoom.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.docZmodal = modal;
  }); 
  $ionicModal.fromTemplateUrl('templates/doctors.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.docLmodal = modal;
  });
  $ionicModal.fromTemplateUrl('templates/specialityZoom.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.specZmodal = modal;
  });
  $ionicModal.fromTemplateUrl('templates/cityZoom.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.cityZmodal = modal;
  });


  // Triggered in the login modal to close it
  $scope.closeZoom = function(zoomId) {
    switch(zoomId){
      case "dz":
        $scope.docZmodal.hide();      
        //console.log(zoomId);
        break;  
      case "ct":
        $scope.cityZmodal.hide();        
        break;
      case "sp":  
        $scope.specZmodal.hide();
        break;
      case "dl":
        $scope.docLmodal.hide();
      default:
        $scope.specZmodal.hide();
        //console.log(zoomId);
        break;
    }    
  };
  // Open the doctors modal
  $scope.doctorZoom = function() {        
    $scope.docZmodal.show();
  };
  // Open the specialities modal
  $scope.specialityZoom = function() {    
    $scope.specZmodal.show();
  };
// Open the specialities modal
  $scope.cityZoom = function() {    
    $scope.cityZmodal.show();
  };

  /* ----------------------------------------------------------------------------------------- */
  /* ----------------------------------------------------------------------------------------- */
  // Set fields on the Appointment form with zoom datas
  $scope.setDoctorChoice = function(doctor) {    
    $scope.appointmentVO.doctorId   = doctor._id;
    $scope.appointmentVO.doctorName = doctor.name;
  };
  $scope.setSpecChoice = function(speciality){
    $scope.appointmentVO.specialityId   = speciality._id;
    $scope.appointmentVO.specialityDesc = speciality.description;
  };
  $scope.setCityChoice = function(city){
    $scope.appointmentVO.cityId   = city.city_ibge;
    $scope.appointmentVO.cityDesc = city.description + ' - ' + city.state;
  };
  $scope.clearForm = function(){
    $scope.appointmentVO ={};
    appointmentVO = $scope.appointmentVO;
  }

  function verifyData(){
    
    if ((appointmentVO.perIni == "") || (appointmentVO.perEnd == "")){
      $scope.mensagem = 'É obrigatorio a informação do período inicial e final para realização da consulta!';
      return;
    }
    
    if (appointmentVO.doctorId == ""){
      if ((appointmentVO.specialityId == "") || (appointmentVO.cityId == "")) {
         $scope.mensagem = 'É obrigatorio a informação do "medico" ou "especialidade + cidade!"';
         return;
      }
    }
    
    dataInicial = new Date(appointmentVO.perIni);
    dataFinal   = new Date(appointmentVO.perEnd);
    today       = new Date();
    
    if (dataInicial > dataFinal){
      $scope.mensagem = 'Data Final deve ser maior do que a Data Inicial!';
      return;
    }
   
    if ((today >= dataInicial)){
      $scope.mensagem = 'Período Inicial deve ser maior do que o dia atual!';
      return;
    }
    
      
    return true;
  }
  /**
   Chama tela de disponibilidade de horarios de acordo com os parametros introduzidos na tela de Nova Consulta
   **/
  $scope.goToVerify = function(comeFrom) {


    if (!verifyData()){
      return;
    }

    switch(comeFrom){
      case 'dl':
          //closeZoom('dl');
           $scope.docLmodal.hide();
          break;
      default:
        break;
    }

    //Limpa lista anterior para descartar eventuis 'lixos'
    ScheduleFactory.delList();

    var reqParam = {};
    reqParam.iniPer = appointmentVO.perIni;
    reqParam.endPer = appointmentVO.perEnd;

   if (appointmentVO.doctorId != ""){
      reqParam.doctorId  = appointmentVO.doctorId;
      reqParam.getOption = 2;
   } else {
      reqParam.cityCode     = appointmentVO.cityId;
      reqParam.specialityId = appointmentVO.specialityId;
      reqParam.getOption    = 1;
   }

   LoadingService.show();
   ScheduleService.all(reqParam)      
    .then(function (result) {
      LoadingService.hide();    

      if(result.data.length > 0){
        if (reqParam.getOption == 1){
          $scope.doctorsList = result.data;                 
          $scope.docLmodal.show();
        } else {
          ScheduleFactory.addList(result.data);     
          $scope.schdlFreeTime = {}        
          openAppointmentFree(ScheduleFactory.getList());                    
        }
      }else{
        var alertPopup = $ionicPopup.alert({
            title: 'Busca horários',
            template: 'Não existem horários disponiveis para os dados informados.' });
      }
    }, function errorCallback(response) {
         LoadingService.hide(); 
         LoadingService.verifyError('Busca horários');
       
    });
       
  };
  // Marca consulta conforme horário selecionado.
  $scope.hitAppoint = function(){
    LoadingService.refresh();
    var alertPopup          = '',
        userId              = window.localStorage['userId'];
    
    //Seta usuario que vai marcar a consulta.
    setAppointmentVO._userId = userId; 

    var param       = { updOption : 1,
                         _id      : setAppointmentVO._hourId,
                        appmtTime : setAppointmentVO.hour,
                        eventDate : setAppointmentVO.eventDate,
                      onesignalId : window.localStorage['oneSignalId'],
                        status    : statusEnum.HIT,
                        patientId : userId };

    ScheduleService.save(param)
            .then(function(result){
              LoadingService.hide();
              if(result.data){
                 LoadingService.toast("Consulta agendada com sucesso.", 'short');                 
                 $state.go('app.appointment');
                // $ionicHistory.nextViewOptions({ disableBack: true });
                // $state.go('app.schedules');
              }
          }, function errorCallback(response) {
               LoadingService.hide(); 
               LoadingService.verifyError('Agendamento Consulta');   
          });

  }

  $scope.cancelAppoint  = function(){
      $scope.appointmentVO ={};
      appointmentVO = $scope.appointmentVO;
      $ionicHistory.nextViewOptions({ disableBack: true });
      $state.go('app.appointment');
  }


  // Abre tela com horários livres a escolha
  function openAppointmentFree(scdhlFreeTime) {             
    $scope.appointmentVO = appointmentVO,
    $scope.schdlFreeTime = scdhlFreeTime; 
    $ionicHistory.nextViewOptions({ disableBack: true });   
    $state.go('app.setAppointment');
    
  } //Function

  function getDateApi(dateStamp){
    dateStamp = new Date(dateStamp);
    var date  = dateStamp.getDate(),
        month = appointmentVO.perIni.getMonth() + 1,
        year  = appointmentVO.perIni.getFullYear();          
    if(month < 10)     
        month = 0 +''+ month;

    return date+''+month+''+year;
  }

})
/*------------------------------------------------------------------------------------*/
/*--------------------------- TELA MINHAS CONSULTAS ----------------------------------*/
/*------------------------------------------------------------------------------------ */
appointmentCtrl.controller('SchedulesCtrl', function($scope, $state, $ionicPopup,  $cordovaGeolocation, ScheduleService, Appointments,LoadingService, statusEnum, RatingFactory, PersonFactory) {

 $scope.mensagem = "";
 $scope.data  = {rate : 0,
                  max : 5 };
  var param = {};

  $scope.showMap = function(){
    LoadingService.show();
    var person = PersonFactory.getPerson();
    var doctorRoute =  new google.maps.LatLng(person.doctor.address.lat, person.doctor.address.lng);

    var mapOptions = {
      center: doctorRoute,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    //Wait until the map is loaded
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
     
      var doctorMarker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: doctorRoute
      });      
     
      var infoWindow = new google.maps.InfoWindow({
          content: "Doutor(a): " + person.name
      });

      infoWindow.open($scope.map, doctorMarker);

      LoadingService.hide();
  
    });
  }

  $scope.verifyRoute = function(){
    var options = {timeout: 10000, enableHighAccuracy: true};
    var person = PersonFactory.getPerson();
    LoadingService.show();

    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
       var myLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
       var doctorRoute = new google.maps.LatLng(person.doctor.address.lat, person.doctor.address.lng);

       var mapOptions = { center: myLocation,
                          zoom: 15,
                          mapTypeId: google.maps.MapTypeId.ROADMAP
                        };
       var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        marker = new google.maps.Marker({
          map: map,
          draggable: true,
          position: myLocation
        });

        doctorMarker = new google.maps.Marker({
          map: map,
          draggable: true,
          position: doctorRoute
        });

        var infowindow = new google.maps.InfoWindow({
             content: "Minha localização"
        });

        infowindow.open(map,marker);
  
        var markerwindow = new google.maps.InfoWindow({
             content: "Doutor(a): " + person.name
        });

        markerwindow.open(map,doctorMarker);

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });

        $scope.map = map;
        
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();

        var request = {
            origin : myLocation,
            destination : doctorRoute,
            travelMode : google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function(response, status) {
            LoadingService.hide();
            if (status == google.maps.DirectionsStatus.OK) {

                directionsDisplay.setDirections(response);
            }
        });
        directionsDisplay.setMap(map); 
        google.maps.event.addDomListener(window, 'load', $scope.verifyRoute);

    }, function(error){
      console.log("Could not get location");
    });
  }

  $scope.update = function() {
    var path = [marker1.getPosition(), marker2.getPosition()];
    poly.setPath(path);
    geodesicPoly.setPath(path);
    var heading = google.maps.geometry.spherical.computeHeading(path[0], path[1]);
    document.getElementById('heading').value = heading;
    document.getElementById('origin').value = path[0].toString();
    document.getElementById('destination').value = path[1].toString();
  }



  $scope.getMap = function(person) {
    PersonFactory.setPerson(person);
    $state.go('app.map');
  }

  $scope.returnToSchedule = function(){
    $state.go('app.schedules');
  }

  //Avaliar consulta/Medico
  $scope.avalueteDoctor = function(dIndex, appointment) {

      var avaluateOperation = $ionicPopup.confirm({title: 'Confirmar Avaliação?',
                                                subTitle: 'Atribua a quantiade de estrelas ao médico conforme o atendimento recebido:',
                                                template: '<h1><rating ng-model="rate" max="5" readonly="false" on-hover="null" on-leave="overStar = null"></h1>', 
                                              cancelText: 'Cancelar',
                                                  okText: 'Sim',
                                              cancelType: 'button-assertive',
                                                  okType: 'button-calm'});

      
      avaluateOperation.then(function(res) {        
       
       if (res){
        LoadingService.refresh();
        param = {updOption : 2,   
                        _id: appointment._id,  
                    _hourId: appointment.timeID , 
                     status: statusEnum.REALIZED, //Realizada
                        score: RatingFactory.getRate(),
                     doctorId: appointment.doctor._id}; 

        ScheduleService.save(param)
          .then(function(result){              
              Appointments.delItem(dIndex);
              LoadingService.hide();
        }, function errorCallback(response) {
         LoadingService.hide(); 
         LoadingService.verifyError('Busca Agendamentos');
       
        });
        }
        
      });
  };  
 
 // Cancelamento de consulta
  $scope.cancelAppointment = function(dIndex, appointment) {

    var cancelOperation = $ionicPopup.confirm({title: 'Cancelar consulta?',
                                            template: 'Ao clicar nesta opção a consulta será cancelada, liberando o horário na agenda do médico para outro paciente! Confirmar Cancelamento?', 
                                          cancelText: 'Não',
                                              okText: 'Sim',
                                          cancelType: 'button-assertive',
                                              okType: 'button-calm'});     
      cancelOperation.then(function(res) {

      if (res){
      LoadingService.refresh();
       param = {updOption : 2,   
                       _id: appointment._id,  
                   _hourId: appointment.timeID , 
                    status: statusEnum.CANCELED, //Realizada
                     score: 0}; 

        ScheduleService.save(param)
          .then(function(result){              
              Appointments.delItem(dIndex);
              LoadingService.hide();
        }, function errorCallback(response) {
         LoadingService.hide(); 
         LoadingService.verifyError('Atualização Perfil');
       
          });
        }
      });
  };  
  

   
  $scope.setHidden = function(type, value, hour){
      var currentDate     = new Date(),
          returnvisible   = true,
          hourAux         = String(hour),
          year            = parseInt(String(value).substring(0,4)),
          month           = parseInt(String(value).substring(4,6)) - 1,
          day             = parseInt(String(value).substring(6,8)),
          hour            = parseInt(hourAux.substring(0, hourAux.length - 3)),
          minutes         = parseInt(hourAux.substring(hourAux.length - 2, hourAux.length));

      var appointmentDate = new Date(year, month, day,hour, minutes, 0, 0);

      if ( (appointmentDate < currentDate) && (type == "past")){
          returnvisible = false; 
      }
      if ( (appointmentDate > currentDate) && (type == "future")){
          returnvisible = false; 
      }    
      return returnvisible; 
  }

   $scope.formatDate = function(date){
     var date = String(date);

     return(date.substring(6,8) + '/' +
            date.substring(4,6) + '/' +
            date.substring(0,4));
   }

   // chamada banco
   $scope.getAppointments = function(){
      var userId = window.localStorage['userId'];
      //Pegar ID do localStorage
  
      ScheduleService.getById(userId, 1)
        .then(function(result){
          if(result.data.events.length > 0){
            Appointments.addList(result.data.events); 
            $scope.schedules     = Appointments.getList(); // result.data;   
            $scope.mensagem = '';
          }else{
              $scope.mensagem = 'Você não possui nenhuma consulta agendada.';
          }          
      },  function errorCallback(response) {
         
         LoadingService.verifyError('Lista Agendamentos');
       
    }).finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
        //@aki
        LoadingService.toast("Lista de consultas atualizada", 'short');
      });      
   }   

})

starterCtrls.controller('hisotryCtrl', function($scope, $ionicPopup, ScheduleService, LoadingService, statusEnum){
  
  $scope.max = 5;

   $scope.formatDate = function(date){
     var date = String(date);

     return(date.substring(6,8) + '/' +
            date.substring(4,6) + '/' +
            date.substring(0,4));
   }


  $scope.setRate = function(value){
    $scope.rate = value;
  }

  $scope.getStatusDescription = function(value){
    return statusEnum.props[value];
  }

  $scope.setHidden = function(value){
    if(value == 3) {return false;}
    else {return true;}    
  }
  $scope.toggleGroup = function(day) {
    if ($scope.isGroupShown(day)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = day;
    }
  }
  $scope.isGroupShown = function(day) {
    return $scope.shownGroup === day;
  }

  $scope.isReadonly = true;

  $scope.getHistory = function(){
     var userId = window.localStorage['userId'];
      //Pegar ID do localStorage
      ScheduleService.getById(userId, 2)
        .then(function(result){          
          if(result.data.events.length > 0){
            $scope.history = result.data.events;            
            $scope.mensagem = "";
          }else{
            $scope.mensagem = "Você não possui nenhuma consulta em histórico.";
          }          
      }, function errorCallback(response) {
         LoadingService.verifyError('histórico');
       
    }).finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
	     LoadingService.toast("Lista de consultas atualizada", 'short');	
      });      
   }

});
