angular.module('chat.controllers', ['chat.services', 'ui-notification'])
.controller('SignInCtrl', ['$scope', 'Notification', 'ChatFactory', function($scope, Notification, ChatFactory){

	$scope.signin = function(){
		ChatFactory.signin($scope.user).then(function(data){
			if(data.foundMatch){
				Notification.success("Welcome");
			} else {
				Notification.error("Not a valid Username/Password combination");
			}
		});
	};

}]);
