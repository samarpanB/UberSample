app.controller('AuthCtrl', ['$scope', '$http', '$state', '$location', 'sessionService',
    function ($scope, $http, $state, $location, SessionService) {
    	var code = $location.search() ? $location.search().code : null;

    	$scope.isAuthenticating = true;
    	SessionService.login(code).then(function (){
			$state.go("^.rides");
		}, function () {
			$scope.isError = true;
		}).finally(function () {
			$scope.isAuthenticating = false;
		});
        
	}
]);