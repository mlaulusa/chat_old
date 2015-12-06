angular.module('chat', ['chat.services', 'chat.controllers', 'ui.router', 'ui-notification'])
.config(['$stateProvider', '$urlRouterProvider', 'NotificationProvider', function($stateProvider, $urlRouterProvider, NotificationProvider){
// Angular UI routes
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
				},
				'signUp@signin': {
					templateUrl: 'templates/signup.html',
					controller: 'SignUpCtrl'
				}
			}
		});

	NotificationProvider.setOptions({
		delay: 10000,
		startTop: 20,
		startRight: 10,
		verticalSpacing: 20,
		horizontalSpacing: 20,
		positionX: 'center',
		positionY: 'top'
	});
}])
.run([function(){
	// run is ran when the app kicks off
	console.log("Now running");
}]);
