angular.module('chat.controllers', ['chat.services'])
.controller('SignInCtrl', ['$scope', '$http', function($scope, $http){
	$scope.signin = function(){
		$http.post('/signin', $scope.user).then(function(res) {
			console.log('Success');
			console.log(res);
		}, function(res) {
			console.log('Fail');
			console.log(res);
		});
	};
}]);
