angular.module('chat.controllers', [])
.controller('SignInCtrl', ['$scope', function($scope){
	$scope.signin = function(){
		console.log($scope.user);
	};
}]);
