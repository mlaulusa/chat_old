angular.module('chat.controllers', ['chat.services', 'ui-notification'])
    .controller('SignInCtrl', ['$scope', 'Notification', 'ChatFactory', function ($scope, Notification, ChatFactory){

        $scope.signin = function (){
            ChatFactory.signin($scope.user).then(function (data){
                console.log(data);
                if(data.confirmation){
                    Notification.success("Welcome");
                } else {
                    Notification.error(data.data.data.msg);
                }
            });
        };

    }]);
