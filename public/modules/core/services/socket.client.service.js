'use strict';

//Sockets service used to communicate Sockets REST endpoints
angular.module('core').factory('Sockets', ['$resource',
	function($resource) {
		return $resource('sockets/:socketId', { socketId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);