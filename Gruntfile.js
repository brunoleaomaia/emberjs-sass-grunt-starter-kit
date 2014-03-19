"use strict";

module.exports = function(grunt) {

	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	var appConfig = {
		scripts: [
			'app/components/jquery/jquery.js',
			'app/components/handlebars/handlebars.runtime.js',
			'app/components/ember/ember.js',
			'app/components/ember-data/ember-data.js',
			'app/components/bootstrap-sass/dist/js/bootstrap.js'
		],
		styles: [
			'app/components/bootstrap-sass/dist/css/bootstrap.css',
			'app/components/bootstrap-sass/dist/css/bootstrap-theme.css'
		],
		fonts: [
			'app/components/bootstrap-sass/fonts/*'
		],
		dirs: {
			app: 'app',
			static: 'app/static',
			html: 'app/html',
			scripts: 'app/scripts',
			styles: 'app/styles',
			fonts: 'app/fonts',
			templates: 'app/templates',
			images: 'app/images',
			dev: {
				assets: {
					js: 'dev/assets/js',
					css: 'dev/assets/css',
					img: 'dev/assets/images',
					fonts: 'dev/assets/fonts'
				},
				html: 'dev'
			},
			dist: {
				assets: {
					js: 'dist/assets/js',
					css: 'dist/assets/css',
					img: 'dist/assets/images',
					fonts: 'dist/assets/fonts'
				},
				html: 'dist'
			},
			temp: {
				assets: {
					js: 'temp/assets/js',
					css: 'temp/assets/css',
					img: 'temp/assets/images',
					fonts: 'temp/assets/fonts'
				},
				html: 'temp',
				trash: 'temp/trash'
			},
			bootstrap: {
				sass: 'app/components/bootstrap-sass/lib',
				fonts: 'app/components/bootstrap-sass/fonts',
				js: 'app/components/bootstrap-sass/js'
			}
		},
		connect: {
			options: {
				port: 9000,
				hostname: 'localhost'
			},
			temp: {
				options: {
					base: '<%= dirs.temp.html %>'
				}
			}
		},
		open: {
			server: {
				path: 'http://localhost:<%= connect.options.port %>'
			}
		},
		clean: {
			temp: 'temp',
			dev: 'dev',
			dist: 'dist'
		},
		watch: {
			options: {
				livereload: true
			},
			compass: {
				files: ["<%= dirs.styles %>/sass/{,*/}*.{scss,sass}"],
				tasks: ["compass", "concat:css"]
			},
			css: {
				files: ["<%= dirs.styles %>/*.css"],
				tasks: ["concat:css"]
			},
			html: {
				files: ["<%= dirs.html %>/{,*/}*.{html,htm}"],
				tasks: ['copy:html']
			},
			js: {
				files: ["<%= dirs.scripts %>/{,*/}*.js"],
				tasks: ['concat:js']
			},
			hbs: {
				files: ["<%= dirs.templates %>/{,*/}*.hbs"],
				tasks: ['emberTemplates']
			}
		},
		jshint: {
			options: {
				jshintrc: ".jshintrc"
			},
			all: [
				"Gruntfile.js"
			]
		},
		emberTemplates: {
			options: {
				templateName: function(sourceFile) {
					var templatePath = appConfig.dirs.app + '/templates/';
					return sourceFile.replace(templatePath, '');
				}
			},
			dist: {
				files: {
					'<%= dirs.temp.assets.js %>/templates.js': '<%= dirs.app %>/templates/{,*/}*.hbs'
				}
			}
		},
		neuter: {
			options: {
				filepathTransform: function(filepath) {
					return appConfig.dirs.app + '/' + filepath;
				}
			},
			application: {
				src: '<%= dirs.scripts %>/app.js',
				dest: '<%= dirs.temp.assets.js %>/app.js'
			}
		},
		concat: {
			js: {
				files: [{
					"<%= dirs.temp.assets.js %>/components.js": "<%= scripts %>"
				}, {
					"<%= dirs.temp.assets.js %>/custom.js": ["<%= dirs.scripts %>/custom/*.js"]
				}]
			},
			css: {
				files: [{
					"<%= dirs.temp.assets.css %>/components.css": ["<%= styles %>"]
				}, {
					"<%= dirs.temp.assets.css %>/custom.css": ["<%= dirs.styles %>/*.css"]
				}]
			}
		},
		uglify: {
			options: {
				mangle: false
			},
			dist: {
				files: {
					"<%= dirs.dist.assets.js %>/components.js": ["<%= dirs.temp.assets.js %>/components.js"],
					"<%= dirs.dist.assets.js %>/templates.js": ["<%= dirs.temp.assets.js %>/templates.js"],
					"<%= dirs.dist.assets.js %>/app.js": ["<%= dirs.temp.assets.js %>/app.js"]
				}
			}
		},
		cssmin: {
			dist: {
				files: [{
					'<%= dirs.dist.assets.css %>/components.css': ['<%= dirs.temp.assets.css %>/components.css']
				}, {
					'<%= dirs.dist.assets.css %>/custom.css': ['<%= dirs.temp.assets.css %>/custom.css']
				}]
			}
		},
		compass: {
			styles: {
				options: {
					force: true,
					config: "config.rb",
					sassDir: "<%= dirs.styles %>/sass",
					cssDir: "<%= dirs.styles %>",
					specify: "<%= dirs.styles %>/sass/*.scss"
				}
			}
		},
		copy: {
			static: {
				files: [{
					expand: true,
					cwd: "<%= dirs.static %>",
					src: ['**'],
					dest: '<%= dirs.temp.html %>',
					filter: 'isFile'
				}]
			},
			fonts: {
				files: [{
					expand: true,
					flatten: true,
					src: '<%= fonts %>',
					dest: '<%= dirs.temp.assets.fonts %>',
					filter: 'isFile'
				}, {
					expand: true,
					flatten: true,
					src: ['<%= dirs.fonts %>/*'],
					dest: '<%= dirs.temp.assets.fonts %>',
					filter: 'isFile'
				}]
			},
			html: {
				files: [{
					expand: true,
					cwd: "<%= dirs.html %>",
					src: ['**'],
					dest: '<%= dirs.temp.html %>',
					filter: 'isFile'
				}]
			},
			dist: {
				files: [{
					expand: true,
					cwd: "<%= dirs.temp.html %>",
					src: ['**'],
					dest: '<%= dirs.dist.html %>',
					filter: 'isFile'
				}]
			}
		},
		imagemin: {
			dist: {
				options: {
					optimizationLevel: 3,
					progressive: true
				},
				files: [{
					expand: true,
					cwd: "<%= dirs.images %>/",
					src: "**/*.{png,jpg,gif,ico}",
					dest: "<%= dirs.temp.assets.img %>/"
				}]
			}
		},
		notify: {
			compass: {
				options: {
					title: "SASS - <%= pkg.title %>",
					message: "Compilado e minificado com sucesso!"
				}
			},
			js: {
				options: {
					title: "Javascript - <%= pkg.title %>",
					message: "Minificado e validado com sucesso!"
				}
			},
			image: {
				options: {
					title: "<%= pkg.title %>",
					message: "Imagens otimizadas com sucesso!"
				}
			}
		},
		"ftp-deploy": {
			build: {
				auth: {
					host: "ftp.dominio.com.br",
					port: 21,
					authKey: "key1"
				},
				src: "/dist/",
				dest: "/caminho/para/meu-projeto",
				exclusions: [
					".DS_Store",
					"**/.DS_Store",
					"**/Thumbs.db",
					".git/*",
					".gitignore"
				]
			}
		}

	};
	grunt.initConfig(appConfig);
	grunt.registerTask("default", [
		"temp",
		"connect",
		"open",
		"watch"
	]);
	grunt.registerTask("temp", [
		"clean",
		"compass",
		"copy:static",
		"copy:fonts",
		"copy:html",
		"emberTemplates",
		"neuter",
		"concat",
		"imagemin"
	]);
	grunt.registerTask("build", [
		"temp",
		"copy:dist",
		"uglify",
		"cssmin"
	]);
	grunt.registerTask("deploy", [
		"ftp-deploy"
	]);
};