'use strict';

angular.module('projects')

.controller('removeProjectController', [ '$scope', 'projectsObj', '$modalInstance',
	function ($scope, projectsObj, $modalInstance) {
		console.log('yo');
		$scope.remove = function() {
			$modalInstance.close('yep');
		};

		$scope.nevermind = function() {
			$modalInstance.dismiss('nevermind');
		};
	}
]);