'use strict';

// Projects controller
angular.module('projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects', 'projectsObj', 'mySocket', '$modal',
	function($scope, $stateParams, $location, Authentication, Projects, projectsObj, mySocket, $modal) {
		$scope.authentication = Authentication;

		// Create new Project
		$scope.create = function() {
			var project = new Projects({
				name: this.name,
				description: this.description
			});

			projectsObj.create(project)
				.then(function(result) {
					return;
				}, function(reason) {
					$scope.error = reason;
				});
		};

		// Update existing Project
		$scope.update = function() {
			var project = $scope.project;

			projectsObj.update($scope.project)
				.then(function(result) {
					$location.path('projects/' + $scope.project._id);
				}, function(reason) {
					$scope.error = reason;
				});
		};

		// Remove existing Project
		$scope.remove = function(project) {
			if ( project ) { 
				project.$remove();

				for (var i in $scope.projects) {
					if ($scope.projects [i] === project) {
						$scope.projects.splice(i, 1);
					}
				}
			} else {
				$scope.project.$remove(function() {
					$location.path('projects');
				});
			}
		};

		// Find a list of Projects
		$scope.find = function() {
			$scope.projects = Projects.query();
		};

		// Find existing Project
		$scope.findOne = function() {
			$scope.project = Projects.get({ 
				projectId: $stateParams.projectId
			});
		};

		// Publish note
		$scope.publishNote = function() {
			var project = $scope.project;
			var newNote = {
				title: $scope.noteTitle,
				content: $scope.noteContent,
				user: Authentication.user._id
			};
			project.notes.push(newNote);
			project.newNote = true;
			projectsObj.update(project)
				.then(function(result) {
					$location.path('projects/' + result._id + '/notes/' + result.notes[project.notes.length - 1]._id);
				}, function(reason) {
					$scope.error = reason;
					console.log($scope.error);
				});
		}; 

		// Find project note
		$scope.findNote = function() {
			var findParams = { note: true };

			projectsObj.find(findParams)
				.then(function(result) {
					$scope.project = result;
					$scope.note = result.note;
				});
		};

		// Update note
		$scope.updateNote = function() {
			var project = $scope.project;
			var noteIndex = project.notes.indexOf($scope.note);
			project.notes[noteIndex].title = $scope.note.title;
			project.notes[noteIndex].content = $scope.note.content;
			project.updatedNote = $scope.note._id;
			projectsObj.update(project)
				.then(function(result) {
					$location.path('projects/' + $scope.project._id + '/notes/' + $scope.note._id);
				}, function(reason) {
					$scope.error = reason;
					console.log($scope.error);
				});
		};

		// Remove project
		$scope.openRemoveModal = function() {
			var modalInstance = $modal.open({
			    templateUrl: '/modules/projects/views/remove-project-modal.client.view.html',
			    controller: 'removeProjectController'
			});


			modalInstance.result.then(function(answer) {
				projectsObj.remove($scope.project);
			});
		};

		// Remove note
		$scope.openRemoveNoteModal = function() {
			var modalInstance = $modal.open({
			    templateUrl: '/modules/projects/views/remove-note-modal.client.view.html',
			    controller: 'removeNoteController'
			});

			modalInstance.result.then(function(answer) {
				var index = $scope.project.notes.indexOf($scope.note);
				$scope.project.notes.splice(index, 1);
				projectsObj.update($scope.project);
				$location.path('projects/' + $scope.project._id + '/notes');
			});
		};

		// View next note
		$scope.nextNote = function() {
			var currentIndex = $scope.project.notes.indexOf($scope.note);
			$location.path('projects/' + $scope.project._id + '/notes/' + $scope.project.notes[(currentIndex + 1)]._id);
			$scope.findNote();
		};

		// View previous note
		$scope.previousNote = function() {
			var currentIndex = $scope.project.notes.indexOf($scope.note);
			$location.path('projects/' + $scope.project._id + '/notes/' + $scope.project.notes[(currentIndex - 1)]._id);
			$scope.findNote();
		};

		// Socket logic
		mySocket.on('updated project', function(data) {
			// if($stateParams.projectId === data._id) {
			// 	$scope.project = data;
			// }
		});

	}
]);