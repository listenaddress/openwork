'use strict';

angular.module('core')

.controller('ActivityController', [ '$scope', 'Activities',
	function($scope, Activities) {
		console.log(Activities);
		$scope.find = function() {
			console.log(Activities);
			$scope.activities = Activities.query();
		};
		$scope.find();

	}
]);