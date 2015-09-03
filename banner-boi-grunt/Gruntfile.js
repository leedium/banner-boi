var src = 'src';
var dest = 'build';

module.exports = function(grunt){
	require('load-grunt-tasks')(grunt);
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		requirejs: {
		    compile: {
		      options: {
		        baseUrl: "path/to/base",
		        mainConfigFile: "path/to/config.js",
		        out: "path/to/optimized.js"
		      }
		    }
		},
		browserSync: {
			dev:{
			    bsFiles: {
			        src : [
			        		'build/css/**/*.css',
			        		'build/*.html'
			        	]
			    },
			    options: {
			    	watchTask: true,
			        server: "./build"
			    }

			}
		},
		watch: {
		  css: {
		    files: 'src/**/*.scss',
		    tasks: ['sass','pleeease'],
		    options: {
		      debounceDelay: 500
		    }
		  },
		  html: {
		    files: 'src/**/*.html',
		    tasks: ['htmlmin'],
		    options: {
		      debounceDelay: 500
		    }
		  },
		  js: {
		    files: 'src/**/js/*.js',
		    tasks: ['uglify'],
		    options: {
		      debounceDelay: 500
		    }
		  }

		},
		sass: {
	        options: {
	            sourceMap: false
	        },
	        dist: {
	             files: [{
			        expand: true,
			        cwd: 'src',
			        src: ['**/*.scss'],
			        dest: 'build/',
			        ext: '.css'
			      }]
	        }
    	},
		pleeease: {
		    custom: {
		      options: {
		        autoprefixer: {'browsers': ["last 4 versions", "ios 6"]},
		        filter: {'oldIE': true},
		        minifier: true,
		        rem:['12px'],
		        opacity:true 
		      },
		      files: [{
			        src: ['build/css/**/*.css'],
			        dest: 'build/css',
			        ext: '.css'
			      }]
		    }	
  		},
  		uglify: {
		  my_target: {
		  	options: {
		        beautify: {
		          width: 80,
		          beautify: true
		        }
		    },
		    files: [{
		          expand: true,
		          cwd: 'src',
		          src: '**/*.js',
		          dest: 'build/'
		      }]
	      	}
  		},
  		concat: {
	    	options: {
			      separator: ';'
			},
			vendor: {
			      src: [
			      		'bower_components/jquery/dist/jquery.min.js',
			      		'bower_components/jquery/dist/jquery.min.map'

			      	],
			      dest: 'build/js/vendor.js'
			}
			
		},
  		htmlmin: {                                     // Task
		    dist: {                                      // Target
		      options: {                                 // Target options
		        removeComments: true,
		        collapseWhitespace: false
		      },
		      files: [{
		          expand: true,     
		          cwd: 'src/',      
		          src: ['**/*.html'], 
		          dest: 'build/'   // Destination path prefix.
		        }]
		    }
		 },
        assemble: {
            options: {
              //  flatten: true,
              //  assets: 'dist/assets',
                partials: ['src/templates/partials/*.hbs'],
                src: ['!src/templates/partials/*.hbs' ]
               // layoutdir: 'src/templates/layouts/'
              //  helpers: ['templates/helpers/helper-*.js'],

               // layout: 'default.hbs'
               // data: ['templates/data/*.{json,yml}']
            },
            dck:{
                files:{
                    'dck/': ['src/templates/layouts/dck/**/*.hbs' ]
                }
            },
            sizmek:{
                files:{
                    'sizmek/': ['src/templates/layouts/sizmek/**/*.hbs' ]
                }
            },
            pages: {
                src: src + '/templates/**/*.hbs',
                dest: dest
            }
        },
        copy: {
            main: {
                files: [
                    // includes files within path
                    //{expand: true, src: ['src/js/*'], dest: 'dest/', filter: 'isFile'},
                    {cwd:'', src: ['src/js/main.js'], dest: 'dck/src/templates/layouts/dck/main.js'}
                ]
            }
        }

	});
	
	//grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('assemble' );
	grunt.loadNpmTasks('grunt-pleeease');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-browser-sync');
	

	grunt.registerTask('default', ['assemble','copy']);
	//grunt.registerTask('default', ['assemble', 'concat','sass','pleeease','uglify','htmlmin','browserSync','watch']);
}