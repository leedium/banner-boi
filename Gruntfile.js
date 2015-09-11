var src = 'src';
var prevDest = 'dist/';
var bannerConfig = require('./bannerConfig');
var providerAPIArray = [];

module.exports = function(grunt){
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserSync: {
            dev:{
                bsFiles: {
                    src : [
                            prevDest+'/**/*.css',
                            prevDest+'**/*.html',
                            prevDest+'**/*.js'
                    ]
                },
                options: {
                    reloadDelay:bannerConfig.reloadDelay,
                    watchTask: true,
                    server: prevDest,
                    open:false
                }
            }
        },
        watch: {
            css: {
                files: src+'/**/*.scss',
                tasks: ['noImageMin'],
                options: {
                    debounceDelay: 1000
                }
            },
            hbs: {
                files: src+'/**/*.hbs',
                tasks: ['noImageMin'],
                options: {

                    debounceDelay: 1000
                }
            },
            js: {
                files: src+'/**/*.js',
                tasks: ['noImageMin'],
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
                    cwd: src,
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
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: false
                },
                files: [{
                    expand: true,
                    src: ['temp/**/*.html']
                }]
            }
        },
        image: {
            dynamic: {
                options: {
                    pngquant: true,
                    optipng: false,
                    advpng: false,
                    zopflipng: false,
                    pngcrush: true,
                    pngout: true,
                    mozjpeg: true,
                    jpegRecompress: false,
                    jpegoptim: true,
                    gifsicle: true,
                    svgo: false
                },
                files: [{
                    expand: true,
                    cwd: src+'/',
                    src: ['**/*.{png,jpg,gif,svg}'],
                    dest: 'temp/src/'
                }]
            }
        },
        assemble: {
            options: {
                partials: [src+'/templates/partials/**/*.hbs'],
                src: ['!src/templates/partials/*.hbs' ],
                helpers: ['templates/helpers/helper-*.js']
            },
            copyTo:{
                files:{
                    'temp/': [src+'/templates/provider-template/**/*.hbs' ]
                }
            }

        },
        copy: {
            common: {
                files: [
                    {
                        src: [src+'/main.js'], dest: 'main.js'

                    },
                    {
                        src: ['temp/styles.css'], dest: 'styles.css'
                    }
                ]

            },
            imagesToFolders: {
                files: [
                    {
                        expand: true,
                        cwd: 'temp/src/',
                        src: ['*.gif','*.jpg','*.png'],
                        dest: 'temp/src/templates/provider-template'
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
                processTemplates:true
            }
        },
        clean: {
            build: {
                src: ["temp",'.sass-cache', 'src/spritesheet.png', 'src/spritesheet-polite.png']
            }
        },
        // make a zipfile
        compress: {
            main: {
                options: {
                    archive: bannerConfig.campaignName + '-banners.zip'
                },
                files: [
                    {expand: true, cwd: 'dist/', src: ['**'], dest: './'}
                ]
            }
        },
        sprite:{
            polite: {
                src: src+'/images/sprites-polite/*.png',
                dest: src+'/spritesheet-polite.png',
                destCss: src+'/scss/_sprites-polite.scss',
                imgPath:'spritesheet-polite.png'
            },
            all: {
                src: src+'/images/sprites/*.png',
                dest: src+'/spritesheet.png',
                destCss: src+'/scss/_sprites.scss',
                imgPath:'spritesheet.png',
                cssOpts:{functions:false}
            }
        }
    });

    //COPY SHARED ASSETS
    var gruntCopy = grunt.config.get('copy');
    var common = gruntCopy.common.files;
    var providerFolder;
    for (var i = common.length - 1; i >= 0; i--) {
        var fileItem = common[i];
        common.splice(i, 1);
        for (var k = 0; k < bannerConfig.sizes.length; k++) {
            providerFolder = 'temp/src/templates/provider-template/provider-campaign-' + bannerConfig.sizes[k]  + '/';
            common.push({src: fileItem.src, dest: providerFolder + fileItem.dest })
        }
    }
    var imagesToFolders = gruntCopy.imagesToFolders.files;
    for (var i = imagesToFolders.length - 1; i >= 0; i--) {
        var fileItem = imagesToFolders[i];
        imagesToFolders.splice(i, 1);
        for (var k = 0; k < bannerConfig.sizes.length; k++) {
            providerFolder = 'temp/src/templates/provider-template/provider-campaign-' + bannerConfig.sizes[k]  + '/';
            imagesToFolders.push({expand: true, cwd: 'temp/src/', src: fileItem.src, dest: providerFolder });
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
                dest: bannerConfig.dest +'/' + provider  + '/',
                rename: function(p) {
                    return  function (dest, src) {
                        var name = src.replace('provider', p).replace('campaign', bannerConfig.campaignName);
                        return dest + name;
                    }
                }(provider)
            })
        }
    }

    var providerObj = {};
    //get provider header and footers;
    for (var i = bannerConfig.providers.length - 1; i >= 0; i--) {

        var provider = bannerConfig.providers[i].id;
        console.log(provider);
        var providerPath = src+'/templates/includes/provider-api/'+provider;
        providerObj[provider] = {head: grunt.file.read(providerPath +'/header.hbs'), scripts: grunt.file.read(providerPath+'/scripts.js')};
    }

    var replaceObj = grunt.config.get('replace');
    for (var i = bannerConfig.providers.length - 1; i >= 0; i--) {
        var provider = bannerConfig.providers[i];
        replaceObj[provider.id] = {
            src: [bannerConfig.dest+ '/' +provider.id+'/**/*.html'],
            overwrite: true,
            replacements: [
                {from:'{SCRIPT_HEADER}', to: providerObj[provider.id].head},
                {from:'{SCRIPT_FOOTER}', to: providerObj[provider.id].scripts},
                {from:'provider', to: provider.id},
                {from:'campaign', to: bannerConfig.campaignName}
            ]
        }
    }



    grunt.config.set('copy', gruntCopy);
    grunt.config.set('replace', replaceObj);
    grunt.loadNpmTasks('grunt-spritesmith');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-rename');
    grunt.loadNpmTasks('grunt-assemble');
    grunt.loadNpmTasks('grunt-pleeease');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');


    //grunt.registerTask('default',['sass','pleeease','assemble','image','copy','replace',]);
    grunt.registerTask('noImageMin', ['sprite','sass','pleeease','assemble','copy','replace', 'htmlmin', 'clean','browserSync','watch' ]);
    grunt.registerTask('default', ['sprite','sass','pleeease','assemble','image','copy','replace', 'htmlmin', 'clean', 'compress', 'browserSync','watch' ]);
}
