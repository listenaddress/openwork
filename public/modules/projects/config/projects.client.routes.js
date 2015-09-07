'use strict';

//Setting up route
angular.module('projects').config(['$stateProvider',
	function($stateProvider) {
		// Projects state routing
		$stateProvider.
		state('listProjects', {
			url: '/projects',
			templateUrl: 'modules/projects/views/list-projects.client.view.html'
		}).
		state('createProject', {
			url: '/projects/create',
			templateUrl: 'modules/projects/views/create-project.client.view.html'
		}).
		state('viewProject', {
			url: '/projects/:projectId',
			templateUrl: 'modules/projects/views/view-project.client.view.html'
		}).
		state('editProject', {
			url: '/projects/:projectId/edit',
			templateUrl: 'modules/projects/views/edit-project.client.view.html'
		}).
		state('createNote', {
			url: '/projects/:projectId/notes/create',
			templateUrl: 'modules/projects/views/create-note.client.view.html'
		}).
		state('listNotes', {
			url: '/projects/:projectId/notes',
			templateUrl: 'modules/projects/views/list-notes.client.view.html'
		}).
		state('viewNote', {
			url: '/projects/:projectId/notes/:noteId',
			templateUrl: 'modules/projects/views/view-note.client.view.html'
		}).
		state('editNote', {
			url: '/projects/:projectId/notes/:noteId/edit',
			templateUrl: 'modules/projects/views/edit-note.client.view.html'
		});
	}
]);