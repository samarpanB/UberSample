app.controller('HomeCtrl', ['$scope', 'sessionService',
    function ($scope, SessionService) {

    	$scope.loginWithUber = function () {
    		SessionService.uberLogin();
    	};
        
	}
]);