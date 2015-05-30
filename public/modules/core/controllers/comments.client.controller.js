'use strict';

angular.module('core')

.controller('CommentsController', [ '$scope', 'Authentication', 'projectsObj', 'mySocket', 'Projects', '$stateParams', '$modal',
	function($scope, Authentication, projectsObj, mySocket, Projects, $stateParams, $modal) {
		$scope.authentication = Authentication;

		$scope.toggleCommenting = function() {
			if (this.obj.commenting) {
				this.obj.commenting = false;
			} else {
				this.obj.commenting = true;
				$scope.commenting = this.obj._id;
			}
		};

		$scope.startEditing = function() {
			this.obj.editing = true;
			this.obj.commentEdit = this.obj.text;
			$scope.editing = this.obj._id;
			$scope.commentEdit = this.commentEdit;
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
					console.log(project.notes);
					
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
						console.log(project);
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
								$scope.$parent.project = result;
							});
					}
				}
			 });
			
		};

		$scope.addNestedComment = function() {
			this.obj.comments.push({
				text: this.nestedCommentInput,
				user: Authentication.user._id
			});

			if ($stateParams.noteId) {
				$scope.project.updatedNote = $scope.$parent.note._id;
				projectsObj.update($scope.project);
			} else if ($stateParams.projectId) {
				$scope.project.updatedChat = true;
				projectsObj.update($scope.project);
			}
		};

		$scope.removeNestedComment = function() {
			var index = this.$parent.obj.comments.indexOf(this.obj);
			this.$parent.obj.comments.splice(index, 1);
			if (!$stateParams.noteId) {
				$scope.project.updatedChat = true;
			} 
			projectsObj.update($scope.project)
				.then(function(result) {
					$scope.project = result;
					$scope.$parent.project = result;
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
		};

		// mySocket.on('update project', function(data) {


		// 	if (($scope.$parent.project) && ($scope.$parent.project._id === data._id)) {
		// 		$scope.$parent.project = new Projects(data);
		// 		$scope.project = new Projects(data);
		// 		angular.forEach($scope.$parent.project.comments, function(comment, val) {
		// 			comment.userPic = comment.user.providerData.profile_image_url_https;
		// 			angular.forEach(comment.comments, function(comment, val) {
		// 				comment.userPic = comment.user.providerData.profile_image_url_https;
		// 			});
		// 		});
		// 	}

		// 	if (($scope.$parent.note) && ($scope.$parent.note._id === data.updatedNote)) {
		// 		var note = data.notes.filter(function(obj) {
		// 			return obj._id === data.updatedNote;
		// 		});
		// 		if ($scope.commenting) {
		// 			var commentingObj = note[0].comments.filter(function(comment) {
		// 				return $scope.commenting === comment._id;
		// 			});
		// 			commentingObj[0].commenting = true;
		// 		}
		// 		if ($scope.editing) {
		// 			var editingObj = $scope.$parent.note.comments.filter(function(comment) {
		// 				return $scope.editing === comment._id;
		// 			});
		// 			console.log(editingObj[0]);
		// 			var newEditingObj = note[0].comments.filter(function(comment) {
		// 				return $scope.editing === comment._id;
		// 			});
		// 			newEditingObj[0].editing = true;
		// 			newEditingObj[0].commentEdit = editingObj[0].commentEdit;
		// 		}
		// 		$scope.$parent.note = note[0];
		// 		angular.forEach($scope.$parent.note.comments, function(comment, val) {
		// 			comment.userPic = comment.user.providerData.profile_image_url_https;
		// 			angular.forEach(comment.comments, function(comment, val) {
		// 				comment.userPic = comment.user.providerData.profile_image_url_https;
		// 			});
		// 		});
		// 	}
		// });

	}
]);