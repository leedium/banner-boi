var src = 'src';
var prevDest = 'dist/';
var bannerConfig = require('./bannerConfig');
var replace = require("replace");
var providerAPIArray = [];
var del = require('del');
var fs = require('fs'),
    path = require('path');



function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}

//ADD CUSTOM STYLES
var gruntSprite = {}
gruntSprite['polite'] = {
    src: src+'/images/sprite-polite/*.png',
    dest: src+'/spritesheet-polite.png',
    destCss: src+'/scss/mixins_sprites-polite.scss',
    imgPath:'spritesheet-polite.png',
    imgOpts: {quality: 2}
}
for (var i = bannerConfig.sizes.length - 1; i >= 0; i--) {
    var size = bannerConfig.sizes[i];
    var name = 'sprite'+size;
    //   var providerFolder = 'temp/src/templates/provider-template/provider-campaign-' + size  + '/';

    gruntSprite[name] = {
        src: src+'/images/'+name+'/*.png',
        dest: src+'/spritesheet-'+name+'.png',
        destCss: src+'/scss/mixins_'+name+'.scss',
        imgPath:'spritesheet.png',
        imgOpts: {quality: 75}
    };

}

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
                    debounceDelay: bannerConfig.reloadDelay
                }
            },
            hbs: {
                files: src+'/**/*.hbs',
                tasks: ['noImageMin'],
                options: {

                    debounceDelay: bannerConfig.reloadDelay
                }
            },
            js: {
                files: src+'/**/*.js',
                tasks: ['noImageMin'],
                options: {

                    debounceDelay: bannerConfig.reloadDelay
                }
            },
            svg: {
                files: src+'/**/*.svg',
                tasks: ['noImageMin'],
                options: {

                    debounceDelay: bannerConfig.reloadDelay
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
                    autoprefixer: {'browsers': ["ie 9", "Firefox < 20", "last 3 versions"]},
                    filter: {'oldIE': false},
                    minifier: bannerConfig.minifyCSS,
                    rem:['12px'],
                    opacity:true
                },
                files: [{
                    src: ['temp/*.css'],
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
                    src: ['dist/**/*.html']
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
            //common: {
            //    files: [
            //        {
            //            src: [src+'/main.js'], dest: 'main.js'
            //
            //        },
            //        {
            //            src: ['temp/styles.css'], dest: 'styles.css'
            //        }
            //    ]
            //
            //},
            imagesToFolders: {
                files: [
                    {
                        expand: true,
                        cwd: 'temp/src/',
                        src: ['*.gif','*.jpg','*.svg'],
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

        },


        clean: {
            build: {
                src: ["temp",'.sass-cache', 'src/spritesheet.png', 'src/*.png','src/scss/*.scss']
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
        sprite:gruntSprite,
        comments: {
            htmls: {
                options: {
                    singleline: true,
                    multiline: true
                },
                src: [ 'dist/**/*.html'] // files to remove comments from
            },
        },

    });



    //COPY SHARED ASSETS
    var gruntCopy = grunt.config.get('copy');
    /*var common = gruntCopy.common.files;
     var providerFolder;
     for (var i = common.length - 1; i >= 0; i--) {
     var fileItem = common[i];
     common.splice(i, 1);
     for (var k = 0; k < bannerConfig.sizes.length; k++) {
     providerFolder = 'temp/src/templates/provider-template/provider-campaign-' + bannerConfig.sizes[k]  + '/';
     common.push({src: fileItem.src, dest: providerFolder + fileItem.dest })
     }
     }*/

    //copy sprites to the
    var imagesToFolders = gruntCopy.imagesToFolders.files;
    for (var i = imagesToFolders.length - 1; i >= 0; i--) {
        var fileItem = imagesToFolders[i];
        imagesToFolders.splice(i, 1);
        for (var k = 0; k < bannerConfig.sizes.length; k++) {
            providerFolder = 'temp/src/templates/provider-template/provider-campaign-' + bannerConfig.sizes[k]  + '/';
            imagesToFolders.push({expand: true, cwd: 'temp/src/', src: '*spritesheet-polite.png', dest: providerFolder });
            imagesToFolders.push({expand: true, cwd: 'temp/src/', rename: function(dest, src){ return dest + 'spritesheet.png'}, src: '*spritesheet-sprite'+bannerConfig.sizes[k]+'.png', dest: providerFolder });
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
    var lis = '';
    for (var k = 0; k < bannerConfig.sizes.length; k++) {
        var size = bannerConfig.sizes[k];
        var dimensions = size.split('x');
        lis += (' <li><h4>'+size+'</h4><h3>FILE SIZE: (inc gzip GSAP,'+ bannerConfig.gsapSize+'KB  )</h3>{FILE_SIZE_'+size+'}<iframe width="'+dimensions[0]+'" height="'+dimensions[1]+'" scrolling="no" src="provider-campaign-'+size+'/index.html"></iframe></li>');

    }

    var bak = '';
    for (var k = 0; k < bannerConfig.sizes.length; k++) {
        size = bannerConfig.sizes[k];
        dimensions = size.split('x');
        bak += (' <li><h4>'+size+'</h4><img width="'+dimensions[0]+'" height="'+dimensions[1]+'" src="provider-campaign-'+size+'/backup'+bannerConfig.backupImageType+'"></li>');
    }

    replaceObj['list'] = {
        src: ['temp/src/templates/provider-template/index.html'],
        overwrite: true,
        replacements: [
            {from:'{LIST}', to: lis},
            {from:'{LIST_BACKUP}', to: bak},

        ]
    }


    for (var k = 0; k < bannerConfig.sizes.length; k++) {
        var size = bannerConfig.sizes[k]
        providerFolder = 'temp/src/templates/provider-template/provider-campaign-' + size  + '/';
        replaceObj['commoncss'+size] = {
            src: [providerFolder+'index.html'],
            overwrite: true,
            replacements: [
                {from:'{SCRIPT_STYLES_COMMON}', to: function(){
                    return grunt.file.read('temp/styles.css');
                }},
                {from:'{SCRIPT_STYLES_CUSTOM}', to: function(s){
                    return function() {
                        return grunt.file.read('temp/sprite'+s+'.css');
                    }
                }(size)},
                {from:'{LOOPS}', to: bannerConfig.loops},
            ]
        }
    }


    //
    for (var i = bannerConfig.providers.length - 1; i >= 0; i--) {
        var provider = bannerConfig.providers[i];
        replaceObj[provider.id] = {
            src: [bannerConfig.dest+ '/' +provider.id+ '/**/*.html'],
            overwrite: true,
            replacements: [
                {from:'{TIME_STAMP}', to: new Date().toString() },
                {from:'{LOOP}', to: bannerConfig.loops },
                {from:'{SCRIPT_HEADER}', to: function() { return providerObj[provider.id].head} },
                {from:'{SCRIPT_FOOTER}', to: providerObj[provider.id].scripts},
                {from:'provider', to: provider.id},
                {from:'{DEFAULT_CLICK_TAG}', to: provider.clickTag},
                {from:'campaign', to: bannerConfig.campaignName}
            ]
        }
    }




    grunt.config.set('copy', gruntCopy);
    grunt.config.set('replace', replaceObj);


    grunt.registerTask('delSizes','remove unused sizes',function(){
        var providerFolder = getDirectories('./temp/src/templates/provider-template/');
        var delArray = [];
        for (var k = 0; k < providerFolder.length; k++) {
            var sizeAvailable = false;
            var folderSize = providerFolder[k].split('-')[2];
            for (var j = 0; j < bannerConfig.sizes.length ; j++) {
                var size = bannerConfig.sizes[j];
                if(folderSize ==  size){
                    sizeAvailable = true;
                    continue;
                }
            }
            if(!sizeAvailable){
                delArray.push('./temp/src/templates/provider-template/provider-campaign-'+folderSize);
            }
        }
        console.log(delArray)
        del(delArray);
    });

    grunt.registerTask('checksize','check the total banner size',function(){
        for (var k = 0; k < bannerConfig.sizes.length; k++) {
            var size = bannerConfig.sizes[k];
            var providerFolder = 'temp/src/templates/provider-template/provider-campaign-' + size  + '/';
            var index = Math.round(fs.statSync(providerFolder+"index.html")['size'] * 0.001);
            var sprite1 = Math.round(fs.statSync("temp/src/spritesheet-polite.png")['size']* 0.001);
            var sprite2 = Math.round(fs.statSync("temp/src/spritesheet-sprite"+size+".png")['size']* 0.001);
            var total = index+sprite1+sprite2+bannerConfig.gsapSize;
            var pass = total < 200 ? 'PASS' : 'FAIL';
            for (i = bannerConfig.providers.length - 1; i >= 0; i--) {
                var provider = bannerConfig.providers[i].id;
                replace({
                    regex: '{FILE_SIZE_' + size + '}',
                    replacement: '<p class="'+pass.toLowerCase()+'">'+total + 'KB '+pass+'</p>',
                    paths: ['dist/'+provider+'/index.html'],
                    recursive: false,
                    silent: false,
                });
            }
        }
    })

    grunt.loadNpmTasks('grunt-spritesmith');
    grunt.loadNpmTasks('grunt-stripcomments');
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


    grunt.registerTask('default',['sprite','sass','pleeease','assemble', 'delSizes','image','replace', 'copy','replace', 'comments', 'htmlmin','checksize','compress', 'clean', 'browserSync','watch']);
    grunt.registerTask('noImageMin',['sprite','sass','pleeease','assemble', 'delSizes','image','replace', 'copy','replace', 'comments', 'htmlmin', 'checksize', 'clean']);
    //grunt.registerTask('default', ['sprite','sass']);
    //grunt.registerTask('noImageMin', ['sprite','sass','pleeease','assemble', 'delSizes','image','replace','copy','replace']);
    //grunt.registerTask('default', ['sprite','sass','pleeease','assemble', 'delSizes','image', 'copy','replace', 'htmlmin',  'compress', 'clean', 'browserSync','watch' ]);
}
