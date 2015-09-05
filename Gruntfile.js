var src = 'src';
var dest = 'dist/dck';
var bannerConfig = require('./bannerConfig');
var mozjpeg = require('imagemin-mozjpeg');

module.exports = function(grunt){
	require('load-grunt-tasks')(grunt);
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		browserSync: {
			dev:{
			    bsFiles: {
			        src : [
                        dest+'/**/*.css',
                        dest+'**/*.html',
                        dest+'**/*.js'
			        	]
			    },
			    options: {
                    reloadDelay:bannerConfig.reloadDelay,
			    	watchTask: true,
			        server: dest,
                    open:false
			    }
			}
		},
		watch: {
		  css: {
		    files: 'src/**/*.scss',
		    tasks: ['default'],
		    options: {
		      debounceDelay: 1000
		    }
		  },
		  hbs: {
		    files: 'src/**/*.hbs',
		    tasks: ['default'],
		    options: {

		      debounceDelay: 1000
		    }
		  },
		  js: {
		    files: 'src/**/*.js',
		    tasks: ['default'],
		    options: {

		      debounceDelay: 1000
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
		        autoprefixer: {'browsers': ["ie 8", "Firefox < 20", "last 4 versions", "ios 6"]},
		        filter: {'oldIE': true},
		        minifier: bannerConfig.minifyCSS,
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
  		htmlmin: {
		    dist: {
		      options: {
		        removeComments: true,
		        collapseWhitespace: false
		      },
		      files: [{
		          expand: true,
		          //cwd: 'build/',
		          src: ['temp/**/*.html']
		        }]
		    }
		 },
        assemble: {
            options: {
                partials: ['src/templates/partials/*.hbs'],
                src: ['!src/templates/partials/*.hbs' ],
                helpers: ['templates/helpers/helper-*.js']
            },
            dck:{
                files:{
                    'temp/': ['src/templates/provider-template/**/*.hbs' ]
                }
            }
        },
        imagemin: {
            static: {
                options: {
                    optimizationLevel: 3,
                    svgoPlugins: [{ removeViewBox: false }],
                    use: [mozjpeg()]
                },
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['src/*.{png,jpg,gif}'],
                    dest: 'temp/'
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
                        expand: true,
                        cwd: 'src/',
                        src: ['**/*.gif','**/*.jpg','**/*.png'],
                        dest: 'temp/src'
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
        },
        replace: {
            options:{
                processTemplates:false
            }
        },
        clean: {
            build: {
                src: ["temp",'.sass-cache']
            }
        }
	});

    //COPY SHARED ASSETS
    var gruntCopy = grunt.config.get('copy');
    var common = gruntCopy.common.files;
    for (var i = common.length - 1; i >= 0; i--) {
        var fileItem = common[i];
                common.splice(i, 1);
                for (var k = 0; k < bannerConfig.sizes.length; k++) {
                    common.push({src: fileItem.src, dest: 'temp/src/templates/provider-template/provider-campaign-' + bannerConfig.sizes[k]  + '/' + fileItem.dest })
                }
    }

    //FOLDER RENAME
    var folders = gruntCopy.folders.files;
    for (var i = folders.length - 1; i >= 0; i--) {
        var fileItem = folders[i];
        folders.splice(i, 1);
        for (var k = 0; k < fileItem.dest.length; k++) {
            var provider = fileItem.dest[k].id;
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

    //
    var replaceObj = grunt.config.get('replace');
    for (var i = bannerConfig.providers.length - 1; i >= 0; i--) {
        var provider = bannerConfig.providers[i];
        replaceObj[provider.id] = {
            src: ['dist/'+provider.id+'/**/*.html'],
            overwrite: true,
            replacements: [
                {from:'{SCRIPT_HEADER}', to: provider.headerScript},
                {from:'{SCRIPT_FOOTER}', to: provider.footerScript},
                {from:'provider', to: provider.id},
                {from:'campaign', to: bannerConfig.campaignName}
            ]
        }
    }

    grunt.config.set('copy', gruntCopy);
    grunt.config.set('replace', replaceObj);

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-text-replace');
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


    grunt.registerTask('process',['sass','pleeease','assemble','copy','replace','browserSync','watch']);
	grunt.registerTask('default', ['sass','pleeease','assemble','copy','replace', 'htmlmin', 'clean','browserSync','watch' ]);
	//grunt.registerTask('default', ['assemble', 'concat','sass','pleeease','uglify','htmlmin','browserSync','watch']);
}