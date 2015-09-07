'use strict';

angular.module('projects')

.controller('removeNoteController', [ '$scope', '$modalInstance',
	function ($scope, $modalInstance) {
		$scope.remove = function() {
			$modalInstance.close('yep');
		};

		$scope.nevermind = function() {
			$modalInstance.dismiss('nevermind');
		};
	}
]);