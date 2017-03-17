/*jshint node: true*/
/*global module, require*/
module.exports = function (grunt) {

    'use strict';

    grunt.initConfig({

        // Meta data.
        meta: {

            // Package information.
            pkg: grunt.file.readJSON('package.json'),

            source: {
                plugin: {
                    less: 'src/bootstrap-xl-columns/less/bootstrap-xl-columns.less',
                    demo: 'src/bootstrap-xl-columns/demo'
                },
                vendor: {
                    bootstrap: {
                        less: 'src/vendor/bootstrap/less/bootstrap.less'
                    }
                }
            },

            // Directories.
            dir: {
                source: 'src',
                release: 'dist',
                temp: 'temp',
                demo: 'demo'
            },

            // Put some credentials on top of generated output files.
            // Usage: "<%= meta.banner.join('\\n') %>".
            banner: [
                '/*!',
                ' * Project: <%= meta.pkg.name %> (<%= meta.pkg.title %>)',
                ' * Author: <%= meta.pkg.author.name %>',
                ' * Version: <%= meta.pkg.version %>',
                ' * Date: <%= grunt.template.today("mmmm dS, yyyy") %>',
                ' * Copyright (C) <%= grunt.template.today("yyyy") %>',
                ' */'
            ]
        },

        // Cleaning directories as temporary and release folder.
        //
        // @see https://github.com/gruntjs/grunt-contrib-clean
        clean: {
            release: '<%= meta.dir.release %>',
            temp: '<%= meta.dir.temp %>',
            demo: '<%= meta.dir.demo %>'
        },

        // Prepend banner.
        //
        // @see https://github.com/gruntjs/grunt-contrib-concat
        concat: {
            release: {
                src: '<%= meta.dir.temp %>/<%= meta.pkg.name %>.css',
                dest: '<%= meta.dir.release %>/<%= meta.pkg.name %>.css',
                options: {
                    banner: '<%= meta.banner.join("\\n") %>\n'
                }
            },
            releasemin: {
                src: '<%= meta.dir.temp %>/<%= meta.pkg.name %>.min.css',
                dest: '<%= meta.dir.release %>/<%= meta.pkg.name %>.min.css',
                options: {
                    banner: '<%= meta.banner.join("\\n") %>\n'
                }
            },
            releasesourcemap: {
                src: '<%= meta.dir.temp %>/<%= meta.pkg.name %>.min.css.map',
                dest: '<%= meta.dir.release %>/<%= meta.pkg.name %>.min.css.map',
                options: {
                    banner: '<%= meta.banner.join("\\n") %>\n'
                }
            }
        },

        copy: {
            demo: {
                files: [
                    // CSS.
                    {src: '<%= meta.dir.release %>/<%= meta.pkg.name %>.min.css', dest: '<%= meta.dir.demo %>/css/<%= meta.pkg.name %>.min.css'},
                    {src: '<%= meta.dir.release %>/<%= meta.pkg.name %>.min.css.map', dest: '<%= meta.dir.demo %>/css/<%= meta.pkg.name %>.min.css.map'},
                    // HTML.
                    {expand: true, cwd: '<%= meta.source.plugin.demo %>', src: '**', dest: '<%= meta.dir.demo %>/'},
                ]
            }
        },

        // @see https://github.com/gruntjs/grunt-contrib-less
        less: {
            release: {
                options: {},
                plugins: [
                    new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]}),
                    new (require('less-plugin-clean-css'))({})
                ],
                files: {
                    '<%= meta.dir.temp %>/<%= meta.pkg.name %>.css': '<%= meta.source.plugin.less %>'
                }
            },
            releasemin: {
                options: {
                    cleancss: true,
                    compress: true,
                    sourceMap: true
                },
                plugins: [
                    new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]})
                ],
                files: {
                    '<%= meta.dir.temp %>/<%= meta.pkg.name %>.min.css': '<%= meta.source.plugin.less %>'
                }
            },
            bootstrap: {
                options: {
                    cleancss: true,
                    compress: true,
                    sourceMap: true
                },
                plugins: [
                    new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]})
                ],
                files: {
                    '<%= meta.dir.demo %>/css/bootstrap.min.css': '<%= meta.source.vendor.bootstrap.less %>'
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('concat-release', ['concat:release', 'concat:releasemin', 'concat:releasesourcemap']);
    grunt.registerTask('less-release', ['less:release', 'less:releasemin']);
    grunt.registerTask('demo', ['clean:demo', 'less:bootstrap', 'copy:demo']);
    grunt.registerTask('release', ['clean:release', 'less-release', 'concat-release', 'demo', 'clean:temp']);

};