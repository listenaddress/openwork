'use strict';

angular.module('core')

.controller('SocketsController', [ 'mySocket', 'Sockets', '$scope',
	function(mySocket, Sockets, $scope) {
		console.log('in sockets');

		// Create new Socket
		var create = function(socketID) {
			var socket = new Sockets();
			socket.socketID = socketID;
			socket.$save(function(response) {
				console.log(response);
			});
		};

		mySocket.on('socketCon', function(sock) {
			console.log(sock);
			create(sock);	
		});
	}
]);