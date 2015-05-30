'use strict';

// Projects controller
angular.module('projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects', 'projectsObj',
	function($scope, $stateParams, $location, Authentication, Projects, projectsObj) {
		$scope.authentication = Authentication;

		// Create new Project
		$scope.create = function() {
			var project = new Projects({
				name: this.name,
				description: this.description,
				contributors: this.contributors
			});

			console.log(project);

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
			console.log('here');
			console.log(project);


			projectsObj.update($scope.project)
				.then(function(result) {
					return;
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
	}
]);
