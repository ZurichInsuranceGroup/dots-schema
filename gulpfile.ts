import 'source-map-support/register'

const gulp = require("gulp"),
    del = require("del"),
    tsc = require("gulp-typescript"),
    sourcemaps = require('gulp-sourcemaps'),
    runSequence = require('run-sequence'),
    gulpMocha = require('gulp-mocha'),
    merge = require('merge2'),
    plumber = require('gulp-plumber')

const builds = {
    deploy: {
        tsConfig: {
            module: 'commonjs',
            declaration: true
        },
        files: [
            "src/dots-schema/**/*.ts",
        ],
        dest: 'dist'
    },
    development: {
        tsConfig: {
            isolatedModules: true,
            module: 'commonjs'
        },
        files: [
            "src/**/*.ts",
        ],
        dest: 'build/module'
    },
    unitTests: {
        tsConfig: {
            isolatedModules: true,
            module: 'commonjs'
        },
        files: [
            'tests/unit/**/*.spec.ts'
        ],
        dest: 'build/tests'
    }
}

gulp.task('clean', (cb: Function) => {
    return del(["build"], cb)
})

gulp.task('clean:dist', (cb: Function) => {
    return del(["dist"], cb)
})

gulp.task('build:development', () => {
    const tsProject = tsc.createProject('tsconfig.json', builds.development.tsConfig)
    const tsResult = gulp.src(builds.development.files)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(tsProject())
    return tsResult.js
        .pipe(plumber())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(builds.development.dest))
})

gulp.task('build:deploy', () => {
    const tsProject = tsc.createProject('tsconfig.json', builds.deploy.tsConfig)
    const tsResult = gulp.src(builds.deploy.files)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(tsProject())
    return merge([
        tsResult.js
            .pipe(plumber())
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(builds.deploy.dest + '/es5')),
        tsResult.dts
            .pipe(plumber())
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(builds.deploy.dest + '/dts'))
    ])
})

gulp.task('start:unitTests', ['build'], () => {
    const tsProject = tsc.createProject('tsconfig.json', builds.unitTests.tsConfig)
    const tsResult = gulp.src(builds.unitTests.files)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(tsProject())
    return tsResult.js
        .pipe(plumber())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(builds.unitTests.dest))
        .pipe(gulpMocha({ reporter: 'spec' }))

})

gulp.task('watch:unitTests', () => {

    gulp.watch(['src/**/*.ts', builds.unitTests.files], ['start:unitTests'])
        .on('change', (event: any) => {
            console.log(`File ${event.path} changed. Restarting unit tests`)
        })

})

gulp.task("build", (callback: Function) => {
    runSequence('clean', 'build:development', callback)
})

gulp.task('default', (callback: Function) => {
    runSequence('test:unit', callback)
})

gulp.task('test:unit', (callback: Function) => {
    runSequence('watch:unitTests', 'start:unitTests', callback)
})

gulp.task('deploy', (callback: Function) => {
    runSequence('clean:dist', 'build:deploy')
})
