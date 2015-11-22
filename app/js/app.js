angular.module('chat', ['chat.services', 'chat.controllers', 'ui.router'])
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/');
	$stateProvider
		.state('signin', {
			url: '/',
			views: {
				'': {
					templateUrl: 'templates/signin.html',
					controller: 'SignInCtrl'
				},
				'forgotPassword@signin': {
					templateUrl: 'templates/forgot.html',
					controller: 'ForgotCtrl'
				}
			}
		});
}]);
