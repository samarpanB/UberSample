app = angular.module('uberSample', [
  'ui.router',
  'ngStorage',
  'datatables'
])
.run(['$rootScope', '$state', '$stateParams',
    function ($rootScope,   $state,   $stateParams) {

    }
  ]
)
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function ($stateProvider,   $urlRouterProvider, $locationProvider) {

      // $locationProvider.html5Mode({
      //   enabled: true,
      //   requireBase: false
      // });

      // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
      $urlRouterProvider
        // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
        .otherwise('/home');

      // Use $stateProvider to configure your states.
      $stateProvider
        .state("home", {
          url: "/home",
          templateUrl: 'scripts/modules/home/home.html',
          controller: 'HomeCtrl'
        })
        .state("auth", {
          url: "/authenticate",
          templateUrl: 'scripts/modules/auth/auth.html',
          controller: 'AuthCtrl'
        })
        .state("rides", {
          url: "/rides",
          templateUrl: 'scripts/modules/rides/rides.html',
          controller: 'RidesCtrl'
        });
    }
  ]
);