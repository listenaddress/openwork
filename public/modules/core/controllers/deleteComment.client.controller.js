'use strict';

angular.module('core')

.controller('deleteCommentController', [ '$scope', '$modalInstance',
	function($scope, $modalInstance) {
		$scope.confirm = function() {
			$modalInstance.close('delete');
		};

		$scope.nevermind = function() {
			$modalInstance.close();
		};
	}
]);