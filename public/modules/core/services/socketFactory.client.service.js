'use strict';

angular.module('core')

.factory('mySocket', function(socketFactory) {
	return socketFactory();
});