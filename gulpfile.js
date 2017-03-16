
const
    package = require("./package.json")
    gulp = require("gulp"),
    del = require("del"),
    tsc = require("gulp-typescript"),
    sourcemaps = require('gulp-sourcemaps'),
    runSequence = require('run-sequence'),
    gulpMocha = require('gulp-mocha'),
    merge = require('merge2'),
    plumber = require('gulp-plumber'),
    rollup = require('gulp-better-rollup'),
    typescript = require('rollup-plugin-typescript')
    nodeResolve = require('rollup-plugin-node-resolve')
    commonjs = require('rollup-plugin-commonjs')

const moduleName = 'dots-schema',
    sourceFolder = 'src',
    distFolder = 'dist',
    testsFolder = 'tests'

const config = {
    moduleName: moduleName,
    sourceFolder: sourceFolder,
    distFolder: distFolder,
    testsFolder: testsFolder,
    files: [
        `${sourceFolder}/${moduleName}/**/*.ts`
    ],
    production: {
        main: 'dist/es6/index.js',
        bundle: 'dist/',
        tsConfig: {
            isolatedModules: false,
            declaration: true,
            module: 'es2015'
        },
    },
    development: {
        main: 'dist/dots-schema/index.js',
        bundle: 'dist/dots-schema/',
        tsConfig: {
            isolatedModules: true,
            module: 'es2015'
        },
    },
    tests: {
        tsConfig: {
            isolatedModules: true,
            module: 'commonjs'
        },
        files: [
            `${sourceFolder}/${testsFolder}/**/*.ts`
        ],
        dest: `${distFolder}/${testsFolder}`
    }
}

const env = process.env.NODE_ENV || 'development'

gulp.task('clean', (callback) => {
    return del(['dist'], callback)
})

gulp.task('build:tests', () => {
    const tsProject = tsc.createProject('tsconfig.json', config.tests.tsConfig)
    const tsResult = gulp.src(config.tests.files)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(tsProject())
    return tsResult.js
        .pipe(plumber())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.tests.dest))

})

gulp.task('build:development', () => {
    const tsProject = tsc.createProject('tsconfig.json', config.development.tsConfig)
    const tsResult = gulp.src(config.files)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(tsProject())
    return tsResult.js
        .pipe(plumber())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(`${config.distFolder}/${moduleName}`))
})

gulp.task('build:production', () => {
    const tsProject = tsc.createProject('tsconfig.json', config.production.tsConfig)
    const tsResult = gulp.src(config.files)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(tsProject())
    return merge([
        tsResult.js
            .pipe(plumber())
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(`${config.distFolder}/es6`)),
        tsResult.dts
            .pipe(plumber())
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(`${config.distFolder}/dts`))
    ])
})

gulp.task('build:bundle', () => {
    return gulp.src(config[env].main)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(rollup({
            external: Object.keys(package.dependencies),
            plugins: [
                nodeResolve({
                    jsnext: true,
                    main: true,
                    skip: Object.keys(package.dependencies)
                }),
                commonjs()
            ]
        },'umd'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config[env].bundle))
})

gulp.task('build:dts', () => {
    const tsProject = tsc.createProject('tsconfig.json', config.production.tsConfig)
    const tsResult = gulp.src(config.production.files)
        .pipe(plumber())
        .pipe(tsProject())
    return tsResult.dts
            .pipe(plumber())
            .pipe(gulp.dest(config.distFolder))
})

gulp.task('start:tests', () => {
    return gulp.src(`${config.distFolder}/${config.testsFolder}/**/*.js`)
        .pipe(plumber())
        .pipe(gulpMocha({ reporter: 'spec' }))
})

gulp.task('watch:tests', () => {

    gulp.watch(['src/**/*.ts'], gulp.series('test'))
        .on('change', (event) => {
            console.log(`File ${event.path} changed. Restarting unit tests`)
        })

})

gulp.task('build', gulp.series('clean', `build:${env}`, 'build:bundle'))
gulp.task('test', gulp.series('build', 'build:tests', 'start:tests'))
gulp.task('default', gulp.series('test', 'watch:tests'))
