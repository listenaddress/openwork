'use strict';

angular.module('core')

.factory('momentCreator', ['moment', '$q',
	function (moment, $q) {
		var MomentC = {};

		MomentC.momentify = function(someMessages) {
			var momentDefer = $q.defer();
			var momentPromise = momentDefer.promise;

			for (var r = 0; r < someMessages.length; r ++) {
				someMessages[r].momentDate = moment(someMessages[r].created).fromNow();
				var Com = (someMessages[r].momentDate.search('a minute')) + 1;
				var Cm = (someMessages[r].momentDate.search('minutes')) + 1;
				var Chour = (someMessages[r].momentDate.search('an hour')) + 1;
				var Chours = (someMessages[r].momentDate.search('hours')) + 1;
				var Cday = (someMessages[r].momentDate.search('an hour')) + 1;
				var day = (someMessages[r].momentDate.search('a day')) + 1;
				var days = (someMessages[r].momentDate.search('days')) + 1;

				if (Cm) {
					someMessages[r].momentDate = someMessages[r].momentDate.slice(0, Cm);
					someMessages[r].momentDate = someMessages[r].momentDate.replace(/\s/g, '');
				} else if (Com) {
					someMessages[r].momentDate = '1m';
				} else if (Chour) {
					someMessages[r].momentDate = '1h';
				} else if (Chours) {
					someMessages[r].momentDate = someMessages[r].momentDate.slice(0, Chours);
					someMessages[r].momentDate = someMessages[r].momentDate.replace(/\s/g, '');
				} else if (day) {
					someMessages[r].momentDate = '1d';
				} else if (days) {
					someMessages[r].momentDate = someMessages[r].momentDate.slice(0, days);
				    someMessages[r].momentDate = someMessages[r].momentDate.replace(/\s/g, '');
				}

				if ((r + 1) === someMessages.length) {
					momentDefer.resolve();
				}
			}

			return momentPromise;
		};

		return MomentC;
	}
]);