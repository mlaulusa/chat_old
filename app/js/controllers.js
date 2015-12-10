angular.module('chat.controllers', ['chat.services', 'ui-notification'])
    .controller('SignInCtrl', ['$scope', 'Notification', 'ChatFactory', function ($scope, Notification, ChatFactory){

        $scope.signin = function (){
            ChatFactory.login($scope.user).then(function (data){
                if(data.confirmation){
                    Notification.success("Welcome");
                } else {
                    Notification.error(data.data.data.msg);
                }
            });
        };

    }])

    .controller('SignUpCtrl', ['$scope', 'ChatFactory', 'Notification', function($scope, ChatFactory, Notification){
        $scope.adduser = function(){
            ChatFactory.create($scope.user).then(function(data){
                if(data.confirmation){
                    Notification.success("Welcome");
                } else {
                    Notification.error(data.data.data.msg);
                }
            });
        };

    }]);
