angular.module('chat.services', [])
.factory('ChatFactory',['$http', function($http){
  return {
    signin: function(login_information){
      return $http.post('/signin', login_information).then(function(suc){
        return suc.data;
      }, function(err){
        console.log(err);
        return err;
      })
    }
  }
}]);
