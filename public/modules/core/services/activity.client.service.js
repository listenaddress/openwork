'use strict';

//Sockets service used to communicate Sockets REST endpoints
angular.module('core').factory('Activities', ['$resource',
	function($resource) {
		return $resource('activities/:activitiesId', { activityId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);