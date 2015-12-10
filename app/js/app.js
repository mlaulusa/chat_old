angular.module('chat', ['chat.services', 'chat.controllers', 'ui.router', 'ui-notification'])
    .config(['$stateProvider', '$urlRouterProvider', 'NotificationProvider', function ($stateProvider, $urlRouterProvider, NotificationProvider){
// Angular UI routes
        $urlRouterProvider.otherwise('/signin');
        $stateProvider
            .state('tabs', {
                url: '/',
                abstract: true,
                templateUrl: 'templates/template.html'
            })
            .state('tabs.signin', {
                url: 'signin',
                templateUrl: 'templates/signin.html',
                controller: 'SignInCtrl'
            })
            .state('tabs.signup', {
                url: 'signup',
                templateUrl: 'templates/signup.html',
                controller: 'SignUpCtrl'
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
    .run([function (){
        // run is ran when the app kicks off
        console.log("Now running");
    }]);
