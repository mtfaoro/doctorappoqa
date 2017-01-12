angular.module('cmServices', [])

.service('checkmobiService', function($http, Checkmobi) {
    var service = this;

    var req = { method: 'POST',
                url :  '',
                headers: { 'Content-Type' : 'application/json',
                           'Authorization' : Checkmobi.key },
                data : {}};

    this.getCountry = function(){
    	var url = Checkmobi.url + 'countries';
    	return $http.get(url);
    }

    this.checkNumber = function(cellphoneNumber, type){
        req.url = Checkmobi.url + 'validation/request';
        req.data  = {};
        req.data.number = "+55" + cellphoneNumber;
        req.data.type  = type;
        return $http(req);
    }

    this.validateCode = function(id, code){
        req.url = Checkmobi.url + 'validation/verify';
        req.data  = {};
        req.data.id = id;
        req.data.pin = code;
        return $http(req);
    } 
})

.service('profileService', function($http, Doctappbknd) {
    var service = this,
        route = '/person/';
    function getUrl(path){
        return Doctappbknd.tableUrl + path;
    };
    service.all = function (param){
        return $http.get(getUrl(route));
    };
    service.getById = function(value){
      return $http.get(getUrl(route+value));
    }    
    service.save = function(param){
      return $http.post(getUrl(route), param );
    };

    service.update = function(valueId, param){
      return $http.put(getUrl(route+valueId), param );
    };
})


.service('ScheduleService', function($http, Doctappbknd) {
    var service = this,
        route = '/schedule/';
    function getUrl(path){
        return Doctappbknd.tableUrl + path;
    };
    service.all = function (param){
        return $http.post(getUrl(route), param);
    };
    service.getById = function(param1, param2){
      return $http.get(getUrl(route + param1 + '/' + param2));
    };
    service.getHistoryById = function(param){
      var histRoute = '/scheduleold/' + param;
      return $http.get(getUrl(histRoute));
    };
    
    service.allBySpeCity = function(param){
        var docRoute = '/doctorsByIds/' + param;                
        return $http.get(getUrl(docRoute));
    };
        
    service.save = function(param){
      return $http.put(getUrl(route), param );
    };
    service.update = function(param){
      return $http.put(getUrl('/appointment/'), param);
    };
  
})

.factory('appointmentVO', function(){
  var appointmentVO            = {};  
      appointmentVO.doctorId       = "";
      appointmentVO.doctorName     = "";
      appointmentVO.specialityId   = 0;
      appointmentVO.specialityDesc = "";
      appointmentVO.cityId     = 0;
      appointmentVO.cityDesc   = "";
      appointmentVO.perIni     = '';
      appointmentVO.perEnd     = '';
      appointmentVO.monthIni   = 0;
      appointmentVO.monthEnd   = 0; 
      appointmentVO.convenioId = 0;

  return appointmentVO;
})


.factory('Appointments', function(){
  var Appointments = {}
      Appointments.data = []; 


  Appointments.getList = function(){
    return Appointments.data;
  }
  Appointments.addList = function(list){
    Appointments.data = list;
  }
  Appointments.delItem = function(hIndex, dIndex){
    Appointments.data.splice(hIndex,1);
  }
  return Appointments;
})

.factory('RatingFactory', function(){
    var rateObj = {};

  rateObj.setRate =  function(value){
    rateObj.rate = value;
  }  

  rateObj.getRate = function(){
    return rateObj.rate;
  }

  return rateObj;
})

.factory('PersonFactory', function(){
  var personObj = {};

  personObj.setPerson =  function(value){
     personObj = value;
  }  

  personObj.getPerson = function(){
    return  personObj;
  }

  return personObj;
})

.factory('ScheduleFactory', function(){
  var scheduleObj      = {}
      scheduleObj.List = [];

  scheduleObj.getList = function (){
    return scheduleObj.List;
  }
  scheduleObj.addList = function(list){
    scheduleObj.List = list;
  }  
  scheduleObj.delList = function (){
    scheduleObj.List = []; //melhorar isso ahahha
  }  
  return scheduleObj; 
})