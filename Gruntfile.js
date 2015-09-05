var src = 'src';
var dest = 'build';

var bannerConfig = require('./bannerConfig');
var mozjpeg = require('imagemin-mozjpeg');

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
			        dest: 'temp',
			        ext: '.css'
			      }]
	        }
    	},
		pleeease: {
		    custom: {
		      options: {
		        autoprefixer: {'browsers': ["Firefox < 20", "last 4 versions", "ios 6"]},
		        filter: {'oldIE': true},
		        minifier: true,
		        rem:['12px'],
		        opacity:true
		      },
		      files: [{
			        src: ['temp/**/*.css'],
			        dest: 'temp',
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
		          //cwd: 'build/',
		          src: ['temp/**/*.html'],
		          //dest: 'dck/'   // Destination path prefix.
		        }]
		    }
		 },
        assemble: {
            options: {
              //  assets: 'dist/assets',
                partials: ['src/templates/partials/*.hbs'],
                src: ['!src/templates/partials/*.hbs' ],
               // layoutdir: 'src/templates/layouts/',

                helpers: ['templates/helpers/helper-*.js']

               // layout: 'default.hbs'
               // data: ['templates/data/*.{json,yml}']
            },
            dck:{
                files:{
                    'temp/': ['src/templates/provider-template/**/*.hbs' ]
                }
            }
        },
        imagemin: {                          // Task
            static: {                          // Target
                options: {                       // Target options
                    optimizationLevel: 3,
                    svgoPlugins: [{ removeViewBox: false }],
                    use: [mozjpeg()]
                },
                files: [{
                    expand: true,                  // Enable dynamic expansion
                    cwd: 'src/',                   // Src matches are relative to this path
                    src: ['src/*.{png,jpg,gif}'],   // Actual patterns to match
                    dest: 'temp/'                  // Destination path prefix
                }]            }
        },
        copy: {
            common: {
                files: [
                    {
                        src: ['src/main.js'], dest: 'main.js'

                    },
                    {
                        src: ['temp/styles.css'], dest: 'styles.css'
                    }
                ]

            },
            images: {
                files: [
                    {
                        expand: true,     // Enable dynamic expansion.
                        cwd: 'src/',      // Src matches are relative to this path.
                        src: ['**/*.gif','**/*.jpg','**/*.png'], // Actual pattern(s) to match.
                        dest: 'temp/src'   // Destination path prefix.
                    }
                ]

            },
            folders:{

                files:[
                    {
                        expand:true,
                        cwd:'temp/src/templates/provider-template/',
                        src: ['**','**/*.*'],
                        dest: bannerConfig.providers
                    }
                ]
            }
        }
	});

    var gruntCopy = grunt.config.get('copy');
    var common = gruntCopy.common.files;
    for (var i = common.length - 1; i >= 0; i--) {
        var fileItem = common[i];
                common.splice(i, 1);
                for (var k = 0; k < bannerConfig.sizes.length; k++) {
                    common.push({src: fileItem.src, dest: 'temp/src/templates/provider-template/provider-campaign-' + bannerConfig.sizes[k]  + '/' + fileItem.dest })
                }
    }

    var folders = gruntCopy.folders.files;
    for (var i = folders.length - 1; i >= 0; i--) {
        var fileItem = folders[i];
        folders.splice(i, 1);
        for (var k = 0; k < fileItem.dest.length; k++) {
            var provider = fileItem.dest[k];
            folders.push({
                expand:true,
                cwd:'temp/src/templates/provider-template/',
                src: fileItem.src,
                dest: 'dist/' + provider  + '/',
                rename: function(p) {

                 return  function (dest, src) {
                            console.log(dest, src)
                            var name = src.replace('provider', p).replace('campaign', bannerConfig.campaignName);
                            return dest + name;
                        }
                }(provider)
            })
        }
    }



    grunt.config.set('copy', gruntCopy);

	//grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-contrib-rename');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-assemble');
	grunt.loadNpmTasks('grunt-pleeease');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-browser-sync');



	grunt.registerTask('default', ['sass','pleeease','assemble','copy','htmlmin']);
	//grunt.registerTask('default', ['assemble', 'concat','sass','pleeease','uglify','htmlmin','browserSync','watch']);
}