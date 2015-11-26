angular.module('chat.controllers', ['chat.services', 'ui-notification'])
.controller('SignInCtrl', ['$scope', '$http', 'Notification', function($scope, $http, Notification){

	$scope.signin = function(){
		$http.post('/signin', $scope.user).then(function(res) {
			if(res.data.type == "error") {
				Notification.error(res.data.message);
			} else {
				Notification.success(res.data.message);
			}
		}, function(res) {
			console.log(res.data);
		});
	};

}]);
