angular.module('chat.services', [])
    .factory('ChatFactory', ['$http', function ($http){
        return {
            login: function (login_information){
                return $http.post('/api/login', login_information).then(function (suc){
                    return suc.data;
                }, function (err){
                    return err;
                });
            },
            create: function (User){
                return $http.post('/api/users', User).then(function (suc){
                    return suc.data;
                }, function (err){
                    return err;
                });
            }
        }
    }]);
