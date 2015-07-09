'use strict';

angular.module('core')

.controller('CommentsController', [ '$scope', 'Authentication', 'projectsObj', 'mySocket', 'Projects', '$stateParams', '$modal',
	function($scope, Authentication, projectsObj, mySocket, Projects, $stateParams, $modal) {
		$scope.authentication = Authentication;
		$scope.commenting = false;
		$scope.editing = false;

		$scope.toggleCommenting = function() {
			if (this.obj.commenting) {
				this.obj.commenting = false;
				$scope.commenting = false;
				$scope.nestedCommentInput = false;
			} else {
				this.obj.commenting = true;
				$scope.commenting = this.obj._id;
				$scope.nestedCommentInput = this.nestedCommentInput;
			}
		};

		// maybe set a watcher to obj.commentEdit?
		$scope.startEditing = function() {
			this.obj.editing = true;
			this.obj.commentEdit = this.obj.text;
			$scope.editing = this.obj._id;
		};

		$scope.startNestedEditing = function() {
			this.obj.editing = true;
			this.obj.commentEdit = this.obj.text;
		};

		$scope.addComment = function() {
			var project = $scope.project;
			if (false) {
				console.log('other stuff in the future');
			} else if ($stateParams.noteId) {
				console.log(project);
				if ($stateParams.noteId) {
					console.log($scope);
					var note = $scope.note;
					note.comments.push({
						text: $scope.commentInput,
						user: Authentication.user._id
					});
					console.log(note);
					
					// var noteIndex = project.notes.indexOf(note);
					// console.log(noteIndex);
					// if (!project.notes[noteIndex].comments) {
					// 	project.notes[noteIndex].comments = [];
					// }
					// project.notes[noteIndex].comments.push({
					// 	text: $scope.commentInput,
					// 	user: Authentication.user._id
					// });
					project.updatedNote = $stateParams.noteId;
					projectsObj.update(project);
					console.log(project);
				}

			} else {
				if (!project.comments) {
					project.comments = [];
				}
				project.comments.push({
					text: $scope.commentInput,
					user: Authentication.user._id
				});
				project.updatedChat = true;
				projectsObj.update(project)
					.then(function(result) {
						$scope.commentInput = '';
					});
			}
		};

		$scope.removeComment = function() {
			var modalInstance = $modal.open({
			    templateUrl: '/modules/core/views/deleteComment.client.view.html',
			    controller: 'deleteCommentController'
			});

			var that = this;

			modalInstance.result.then(function (result) {
			 	if (result === 'delete') {
			 		$scope.editing = false;
			 		var project = $scope.$parent.project;
					var index;
					if ($stateParams.noteId) {
						index = $scope.note.comments.indexOf(that.obj);
						$scope.note.comments.splice(index, 1);
						project.updatedNote = $stateParams.noteId;
						projectsObj.update(project)
							.then(function(result) {
								$scope.$parent.project = result;
							});
					} else {
						index = project.comments.indexOf(that.obj);
						project.comments.splice(index, 1);
						project.updatedChat = true;
						projectsObj.update(project)
							.then(function(result) {
								// $scope.$parent.project = result;
							});
					}
				}
			 });

		};

		$scope.addNestedComment = function() {
			this.obj.comments.push({
				text: this.obj.nestedCommentInput,
				user: Authentication.user._id
			});
			var that = this;

			if ($stateParams.noteId) {
				$scope.project.updatedNote = $scope.$parent.note._id;
				projectsObj.update($scope.project);
			} else if ($stateParams.projectId) {
				$scope.project.updatedChat = true;
				projectsObj.update($scope.project)
					.then(function() {
						that.obj.nestedCommentInput = '';
					});
			}
		};

		$scope.removeNestedComment = function() {
			var index = this.$parent.obj.comments.indexOf(this.obj);
			this.$parent.obj.comments.splice(index, 1);
			if (!$stateParams.noteId) {
				$scope.project.updatedChat = true;
			}
			$scope.editing = false;
			projectsObj.update($scope.project)
				.then(function(result) {
					// $scope.project = result;
					// $scope.$parent.project = result;
				});
		};

		$scope.saveCommentEdit = function() {
			this.obj.text = this.obj.commentEdit;
			this.obj.editing = false;
			$scope.editing = false;
			if ($stateParams.noteId) {
				$scope.project.updatedNote = $scope.note._id;
			} else {
				$scope.project.updatedChat = true;
			}
			projectsObj.update($scope.project);
		};

		$scope.cancelEdit = function() {
			this.obj.editing = false;
			$scope.editing = false;
		};

		mySocket.on('updated project', function(data) {
			var project = new Projects(data),
				obj,
				viewing;

			if ($scope.note) {
				viewing = 'note';
				obj = $scope.note.comments;
			} else if (($scope.$parent.project) && ($scope.$parent.project._id === data._id)) {
				viewing = 'project';
				obj = $scope.$parent.project.comments;
			}

			if ($scope.commenting) {
				var commenting = obj.filter(function(comment) {
					return $scope.commenting === comment._id;
				});

				if (viewing === 'note') {
					var commentingNote = data.notes.filter(function(note) {
						return $scope.note._id === note._id;
					});
					var newNoteCommentingObj = commentingNote[0].comments.filter(function(comment) {
						return $scope.commenting === comment._id;
					});
					newNoteCommentingObj[0].commenting = true;
					newNoteCommentingObj[0].nestedCommentInput = commenting[0].nestedCommentInput;

				} else if (viewing === 'project') {
					var newProjectCommentingObj = data.comments.filter(function(comment) {
						return $scope.commenting === comment._id;
					});
					newProjectCommentingObj[0].commenting = true;
					newProjectCommentingObj[0].nestedCommentInput = commenting[0].nestedCommentInput;
				}

			}

			if ($scope.editing) {
				if (viewing === 'note') {
					var editingNoteObj = $scope.note.comments.filter(function(comment) {
						return $scope.editing === comment._id;
					});
					var note = project.notes.filter(function(projectNote) {
						return $scope.note._id === projectNote._id;
					});
					console.log(note);
					var newEditingNoteObj = note[0].comments.filter(function(comment) {
						return $scope.editing === comment._id;
					});
					newEditingNoteObj[0].editing = true;
					newEditingNoteObj[0].commentEdit = editingNoteObj[0].commentEdit;
				} else if (viewing === 'project') {
					var editingObj = $scope.$parent.project.comments.filter(function(comment) {
						return $scope.editing === comment._id;
					});
					var newEditingObj = project.comments.filter(function(comment) {
						return $scope.editing === comment._id;
					});
					newEditingObj[0].editing = true;
					newEditingObj[0].commentEdit = editingObj[0].commentEdit;
				}
			}

			// If people are commenting, editing a comment, or viewing nested comments, keep their state.
			// if (($scope.$parent.project) && ($scope.$parent.project._id === data._id)) {

			// }

			// if (($scope.$parent.note) && ($scope.$parent.note._id === data.updatedNote)) {

			// }

			// if ($scope.commenting) {
			// 	var commenting = project.comments.filter(function(comment) {
			// 		return $scope.commenting === comment._id;
			// 	});
			// 	var scopeComment = $scope.$parent.project.comments.filter(function(comment) {
			// 		return $scope.commenting === comment._id;
			// 	});
			// 	commenting[0].nestedCommentInput = scopeComment[0].nestedCommentInput;
			// 	commenting[0].commenting = true;
			// }

			$scope.$parent.project = new Projects(data);

			console.log(data);

			if ($stateParams.noteId === data.updatedNote) {
				console.log('looking at updated note');
				var newNote = data.notes.filter(function(note) {
					return $stateParams.noteId === note._id;
				});

				console.log(newNote[0]);

				$scope.$parent.note = newNote[0];
			}
	
			// angular.forEach($scope.$parent.project.comments, function(comment, val) {
			// 	comment.userPic = comment.user.providerData.profile_image_url_https;
			// 	angular.forEach(comment.comments, function(comment, val) {
			// 		comment.userPic = comment.user.providerData.profile_image_url_https;
			// 	});
			// });


			// if ($scope.editing) {
			// 	console.log($scope.editing);
			// 	var editingObj = $scope.$parent.project.comments.filter(function(comment) {
			// 		return $scope.editing === comment._id;
			// 	});
			// 	console.log(editingObj[0]);
			// 	var newEditingObj = project.comments.filter(function(comment) {
			// 		return $scope.editing === comment._id;
			// 	});
			// 	newEditingObj[0].editing = true;
			// 	console.log(newEditingObj[0]);
			// 	console.log($scope.commentInput);
			// 	newEditingObj[0].commentInput = editingObj[0].commentInput;
			// }

			// if (($scope.$parent.note) && ($scope.$parent.note._id === data.updatedNote)) {
			// 	console.log('in here too');
			// 	var note = data.notes.filter(function(obj) {
			// 		return obj._id === data.updatedNote;
			// 	});
			// 	if ($scope.commenting) {
			// 		var commentingObj = note[0].comments.filter(function(comment) {
			// 			return $scope.commenting === comment._id;
			// 		});
			// 		commentingObj[0].commenting = true;
			// 	}
			// 	if ($scope.editing) {
			// 		var editingObj = $scope.$parent.note.comments.filter(function(comment) {
			// 			return $scope.editing === comment._id;
			// 		});
			// 		console.log(editingObj[0]);
			// 		var newEditingObj = note[0].comments.filter(function(comment) {
			// 			return $scope.editing === comment._id;
			// 		});
			// 		newEditingObj[0].editing = true;
			// 		newEditingObj[0].commentEdit = editingObj[0].commentEdit;
			// 	}
			// 	$scope.$parent.note = note[0];
			// 	angular.forEach($scope.$parent.note.comments, function(comment, val) {
			// 		comment.userPic = comment.user.providerData.profile_image_url_https;
			// 		angular.forEach(comment.comments, function(comment, val) {
			// 			comment.userPic = comment.user.providerData.profile_image_url_https;
			// 		});
			// 	});
			// }
		});

	}
]);