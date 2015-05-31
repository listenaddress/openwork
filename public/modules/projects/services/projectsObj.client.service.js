'use strict';

angular.module('projects')

.factory('projectsObj', ['Projects', '$location', '$q', '$stateParams', 'momentCreator', 'mySocket',
	function(Projects, $location, $q, $stateParams, momentCreator, mySocket) {
		var projectsObj = {};

		// Create project
		projectsObj.create = function(project) {
			var createDefer = $q.defer();
			var createPromise = createDefer.promise;

			project.$save(function(response) {
				console.log(response);
				$location.path('projects/' + response._id);
				return createDefer.resolve(response);
			}, function(errorResponse) {
				return createDefer.reject(errorResponse.data.message);
			});

			return createPromise;
		};

		// Remove project
		projectsObj.remove = function(project) {
			project.$remove(function() {
				$location.path('projects');
			});
		};

		// Update project
		projectsObj.update = function(project) {
			var updateDefer = $q.defer();
			var updatePromise = updateDefer.promise;
			var updatedNote = project.updatedNote;
			var newNote = project.newNote;
			var updatedChat = project.updatedChat;
			var parentComment = project.parentComment;

			var testObj = new Projects(project);

			testObj.$update(function() {
				console.log(testObj);
				// if (updatedNote) {
				// 	project.updatedNote = updatedNote;
				// } else if (newNote) {
				// 	$location.path('projects/' + project._id + '/notes/' + project.notes[(project.notes.length - 1)]._id);
				// } else if (updatedChat) {
				// 	$location.path('projects/' + project._id + '/chat');
				// } else {
				// 	console.log('in here');
				// 	console.log(project._id);
				// 	$location.path('projects/' + project._id);
				// }
				// $location.path('projects/' + project._id);
				mySocket.emit('project updated', testObj);
				updateDefer.resolve();
			}, function(errorResponse) {
				updateDefer.reject(errorResponse.data.message);
			});

			return updatePromise;
		};

		// Find project
		projectsObj.find = function(findParams) {
			var findDefer = $q.defer();
			var findPromise = findDefer.promise;

			var project = Projects.get({
				projectId: $stateParams.projectId,
				noteId: $stateParams.noteId
			}, function() {
				if (findParams && findParams.chat) {
					angular.forEach(project.comments, function(comment, key) {
						comment.userPic = comment.user.providerData.profile_image_url_https;

						angular.forEach(comment.comments, function(comment, key) {
							comment.userPic = comment.user.providerData.profile_image_url_https;
						});
						momentCreator.momentify(comment.comments);

						if ((key + 1) === project.comments.length) {
							findDefer.resolve(project);
						}
					});


					momentCreator.momentify(project.comments)
						.then(function() {
							findDefer.resolve(project);
						});
					if (project.comments.length < 1) {
						findDefer.resolve(project);
					}
				} else if (findParams && findParams.note) {
					var theNote = project.notes.filter(function(obj) {
						return obj._id === $stateParams.noteId;
					});

					project.note = theNote[0];
					angular.forEach(project.note.comments, function(comment, key) {
						comment.userPic = comment.user.providerData.profile_image_url_https;
						angular.forEach(comment.comments, function(comment, key) {
							comment.userPic = comment.user.providerData.profile_image_url_https;
						});
						if ((key + 1) === project.note.comments.length) {
							findDefer.resolve(project);
						}
					});
					momentCreator.momentify(project.note.comments);

					findDefer.resolve(project);
				} else {
					findDefer.resolve(project);
				}
			});

			return findPromise;
		};
	
		return projectsObj;
	}
]);