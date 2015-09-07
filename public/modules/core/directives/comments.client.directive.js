'use strict';

angular.module('core')

.directive('owComments', function () {
	return {
		restrict: 'EA',
		scope: { 
			obj: '=obj',
			project: '=project',
			note: '=note'
		},
		templateUrl: '/modules/core/views/comments.client.view.html'
	};
});