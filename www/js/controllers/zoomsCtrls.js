var doctorsCtrl = angular.module('doctorsCtrl', ['AppointmentCtrl']);

doctorsCtrl.service('DoctorService', function($http, Doctappbknd) {
    var service = this;        
        //path = '/doctors/';
        //tableUrl = '/1/objects/',

    function getUrl(urlPath) {
        //return Backand.getApiUrl() + tableUrl + path;
        return Doctappbknd.tableUrl + urlPath;
    }

    service.all = function (path) {
        //return $http.get(getUrl(path));        
        var req = { method: 'GET',
                      url : getUrl(path),
                   headers: {'Content-Type'  : 'application/json'},
                     data : {token: 'teste'}

                   };   
                      //,'x-access-token' : 'MenegatTeste'            
                
     return $http(req);        
    };

}) // Service


/* Função para busca de Medico para popular zooms.. Doctappbknd */
doctorsCtrl.controller('doctorsSearchZoom', function($scope, appointmentVO, $http, DoctorService){
	$scope.appointmentVO = appointmentVO;

    var path                = '/doctors/',
        doctorsZomm         = this;
        doctorsZomm.doctors = {};

    // Criar uma lib com isso .... :     
    String.prototype.toProperCase = function () {
        return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
    // =====================================================================================================================
    $scope.getDoctors = function() {
        //console.log('loading......');        
        DoctorService.all(path)
            .then(function (result) {                
                $scope.doctors = result.data;
            });         
    }

})

//Realizar busca de especialidades junto ao medico
doctorsCtrl.controller('specialitySearchZoom', function($scope, appointmentVO, $http, DoctorService, Doctappbknd){
    var controller = this,
              path = '/specialities';

    // Criar uma lib com isso .... :     
    String.prototype.toProperCase = function () {
        return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
  

    $scope.getSpecialities = function() {
        //console.log('loading......');        
        DoctorService.all(path)
            .then(function (result) {                
                $scope.specialities = result.data;
             });             
    }

})

doctorsCtrl.controller('citySearchZoom', function($scope, appointmentVO, $http, DoctorService){
    var controller = this,
              path = '/city';


    $scope.getCities = function() {
        //console.log('loading......');        
        DoctorService.all(path)
            .then(function (result) {                
                $scope.cities = result.data;
            });                 
    }

    

})
