import router from '../libs/router';
import {hideElement, setDisplayed, showElement} from '../libs/dom-tools';
import {warmUp, cancelWait, wait} from "../libs/app-helpers";
import {paper} from 'paper/dist/paper-core';
import co from 'co';

const exerciseDuration = 5 * 60 * 1000; // ms
const splashScreenDuration = 2 * 1000; // ms
const endFadeDuration = 3 * 1000; // ms

let timeout;

function* exercise() {
    yield* warmUp();

    setDisplayed('.app-page-warm-up', false);
    setDisplayed('#splashscreen', true);

    const audio = document.querySelector('.app-audio');
    audio.volume = 0;
    audio.play();

    fadeAudio(audio, 1, splashScreenDuration);
    yield wait(splashScreenDuration);
    setTimeout(() => hideElement(document.getElementById('splashscreen')), 100);
    setDisplayed('.canvas-container', true);

    paper.setup('paper-canvas');
    drawAnimation(paper);

    yield wait(exerciseDuration); // 5 minutes

    setDisplayed('#splashscreen h1', false);
    showElement(document.getElementById('splashscreen'));

    fadeAudio(audio, 0, splashScreenDuration);
    yield wait(endFadeDuration);

    router.gotoHome();
}

function fadeAudio(audio, value, duration) {
    const delta = 100; // in ms ~ 10Hz update

    value = Math.max(0, Math.min(1, value));
    const increment = (value - audio.volume) / (duration / delta);
    const clamp = (value > audio.volume)
        ? v => Math.max(0, Math.min(value, v))
        : v => Math.max(value, Math.min(1, v));

    function update() {
        if (audio.volume !== value) {
            audio.volume = clamp(audio.volume + increment);
            timeout = setTimeout(update, delta);
        }
    }
    timeout = setTimeout(update, delta);
}

function drawAnimation(paper) {
    const {Shape, Point, Path, PointText, Group, view, project} = paper;

    const period = 10;
    const trackPosition = 0.25;
    const trackWidth = 0.15;
    const blobSize = 0.19;
    const blobSpacing = 0.33;
    const blobSizeDecay = 0.6;
    const blobSpacingDecay = 0.7;
    const blobCount = 4;

    function wave(t, scale) {
        return 1 - (Math.cos(t * 2 * Math.PI / scale) * 0.5 + 0.5);
    }

    function waveGrad(t, scale) {
        return Math.sin(t * 2 * Math.PI / scale) * Math.PI / scale;
    }

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function easeSin(a, b, t) {
        return a + (b - a) * wave(t, 2);
    }

    function repeat(t, period) {
        return t - Math.floor(t / period) * period;
    }

    function gaussian() {
        const x0 = 1.0 - Math.random();
        const x1 = 1.0 - Math.random();

        return Math.sqrt(-2.0 * Math.log(x0)) * Math.cos(2.0 * Math.PI * x1);
    }

    function createTrack(options) {
        const n = 9;
        const pad = 1;
        const smoothOptions = {type: 'continuous'};
        const amplitude = options.to - options.from;
        const path = new Path();
        path.strokeColor = options.color;
        for (let i = -pad; i < n + pad; i++) {
            path.add(new Point());
        }
        path.data = {
            update: function (time) {
                this.strokeWidth = options.width * view.size.height;
                const scale = view.size.width;
                for (let i = -pad; i < n + pad; i++) {
                    const point = this.segments[i + pad].point;
                    const x = (i / (n - 1)) * view.size.width;
                    point.x = x;
                    point.y = options.from * view.size.height + wave(time * scale / period + x, scale) * amplitude * view.size.height;
                }
                this.smooth(smoothOptions);
            }.bind(path)
        };
        path.data.update(0, 1);
        // path.fullySelected = true
        return path;
    }

    function createBlob(options, previous) {
        const amplitude = options.to - options.from;
        const blob = Path.Circle(new Point(), options.size * view.size.height);

        blob.fillColor = options.color;
        blob.data = {
            update: function (time) {
                const scale = view.size.width;
                const previousX = previous ? previous.position.x : (0.5 * view.size.width);
                const gradY = waveGrad(time * scale / period + previousX, scale) * amplitude * view.size.height;
                const angle = Math.atan2(gradY, 1);
                const x = previousX - options.spacing * Math.cos(angle) * view.size.height;
                const currentRadius = this.bounds.width / 2;
                const radius = options.size * view.size.height;
                this.scale(radius / currentRadius);
                this.position.x = x;
                this.position.y = options.from * view.size.height + wave(time * scale / period + x, scale) * amplitude * view.size.height;
            }.bind(blob),
        };
        // blob.fullySelected = true
        return blob;
    }

    function createBlobWithMouth(options, previous) {
        const mouthParams = {
            offsetX: [0.65, 1.15],
            radius: [0.62, 0.5]
        };
        const rotation = [-20, 20];
        const rotationPhase = period / 4;
        const rotationBias = 15;
        const amplitude = options.to - options.from;
        const compounds = new Group({insert: false});
        const body = Path.Circle({
            center: new Point(),
            radius: options.size * view.size.height,
            parent: compounds,
            fillColor: options.color
        });
        const mouth = Path.Circle({
            center: new Point(options.size * view.size.height * 0.6, 0.01),
            radius: options.size * view.size.height * 0.7,
            parent: compounds
        });
        compounds.pivot = body.position;
        let blob;
        compounds.data = {
            update: function (time) {
                const scale = view.size.width;
                const previousX = previous ? previous.position.x : (0.5 * view.size.width);
                const gradY = waveGrad(time * scale / period + previousX, scale) * amplitude * view.size.height;
                const angle = Math.atan2(gradY, 1);
                const x = previousX - options.spacing * Math.cos(angle) * view.size.height;
                const currentRadius = body.bounds.width / 2;
                const radius = options.size * view.size.height;
                const t = wave(time * scale / period + x, scale);
                // update body
                this.rotation = 0;
                this.scale(radius / currentRadius);
                this.position.x = x;
                this.position.y = options.from * view.size.height + t * amplitude * view.size.height;

                // update mouth
                mouth.position = compounds.position.add([radius * lerp(mouthParams.offsetX[0], mouthParams.offsetX[1], t), 0]);
                mouth.scale((radius * lerp(mouthParams.radius[0], mouthParams.radius[1], t)) / (mouth.bounds.width / 2));

                this.rotation = rotationBias + lerp(rotation[0], rotation[1], wave((time + rotationPhase) * scale / period + x, scale));
                if (blob) {
                    blob.remove();
                }
                blob = body.subtract(mouth);
                blob.parent = project.activeLayer;
            }.bind(compounds),
        };
        //compounds.fullySelected = true;
        return compounds;
    }

    const vertical = Path.Line({
        from: new Point(0, -2000),
        to: new Point(0, 4000),
        insert: false
    });
    // const hit = Path.Circle({
    //     center: new Point(),
    //     radius: 20,
    //     fillColor: 'blue'
    // })
    //vertical.fullySelected = true;
    function evalPathY(x, path) {
        const bounds = path.bounds;
        vertical.position.x = bounds.left + bounds.width * x;
        const points = vertical.getIntersections(path);
        // hit.position = points[0].point;
        return points[0].point.y;
    }

    function createGround(options) {
        options = options || {};
        const smoothOptions = {type: 'continuous'};
        const amplitude = (options.height || 0.2);
        const baseY = (options.base || 0);
        const length = (options.length || 1);
        const n = Math.round((options.frequency || 3) * (options.length || 1));
        const scrollPeriod = (options.period || 1) * period * (options.length || 1);

        const randoms = [];
        for (let i = 0; i < n; i++) {
            randoms.push(Math.random());
        }
        const refCurve = new Path({insert: false});
        for (let i = 0; i < n; i++) {
            refCurve.add(new Point());
        }

        function updateRefCurve() {
            for (let i = 0; i < n; i++) {
                const x = (i / (n - 1)) * length * view.size.width;
                const y = (view.size.height - baseY * view.size.height) - randoms[i] * amplitude * view.size.height;
                refCurve.segments[i].point.x = x;
                refCurve.segments[i].point.y = y;
            }
            refCurve.smooth(smoothOptions);
            // make seemless
            refCurve.firstSegment.point.y = refCurve.lastSegment.point.y;
            refCurve.firstSegment.handleOut = -refCurve.lastSegment.handleIn;
        }

        updateRefCurve();

        const res = (options.frequency || 3) * 9;
        const pad = 2;
        const path = new Path();
        path.fillColor = options.color || '#000000';
        path.add(new Point(), new Point());

        function updateFillSegment() {
            let point = path.segments[0].point;
            point.x = view.bounds.right + 50;
            point.y = view.bounds.bottom + 50;
            point = path.segments[1].point;
            point.x = view.bounds.left - 50;
            point.y = view.bounds.bottom + 50;
        }

        updateFillSegment();
        for (let i = -pad; i < res + pad; i++) {
            path.add(new Point());
        }

        function updatePath(time) {
            for (let i = -pad; i < res + pad; i++) {
                const t = repeat(time, scrollPeriod) / scrollPeriod;
                const point = path.segments[i + 2 + pad].point;
                const relX = i / (res - 1);
                point.x = refCurve.bounds.left + refCurve.bounds.width * relX;
                point.y = evalPathY(repeat(relX + t + 1, 1), refCurve);
            }
            path.smooth(smoothOptions);
        }

        updatePath(0);
        path.data.update = function (time) {
            updateRefCurve();
            updateFillSegment();
            updatePath(time);
        };

        return path;
    }

    function createCloud(options) {
        const sizeMin = 0.05;
        const sizeMax = 0.1;
        const rad = 0.02;
        const n = 19;
        const cloud = new Group();

        const timeScale = 1;

        const bubleDriftSpeed = 3 * timeScale;
        for (let i = 0; i < n; i++) {
            const buble = new Shape.Circle({
                center: new Point(gaussian() * rad * 2 * view.size.height, gaussian() * rad * view.size.height),
                radius: lerp(sizeMin, sizeMax, Math.random()) / 2 * view.size.height,
                fillColor: 'white'
            });
            buble.data.freq = 2 * Math.PI / lerp(10, 30, Math.random());
            buble.data.direction = Point.random().add(-0.5).multiply(2);
            buble.data.update = function (event) {
                const delta = bubleDriftSpeed * Math.sin(event.time * this.data.freq * timeScale) * event.delta;
                this.translate(this.data.direction.multiply(delta));
            }.bind(buble);
            cloud.addChild(buble);
        }

        cloud.position = options.position.multiply(view.size);
        let totalDrift = new Point(0, 0);

        const driftSpeed = 3 * timeScale;
        cloud.data.direction = new Point((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 0.1);
        cloud.data.speed = (Math.random() / 2 + 0.5) * driftSpeed;
        cloud.data.update = function (event) {
            this.children.forEach(buble => {
                buble.data.update(event);
            });
            totalDrift.add(this.data.direction.multiply(event.delta * this.data.speed));
            this.position = options.position.multiply(view.size).add(totalDrift);
        }.bind(cloud);

        //cloud.fullySelected = true;
        return cloud;
    }

    function createText(options) {
        const position = 0.1;
        const size = 0.15;
        const text = new PointText({
            point: new Point(view.bounds.width / 2, (1 - position) * view.bounds.height),
            content: "INSPIREZ",
            fillColor: 'white',
            fontFamily: 'Segoe UI',
            fontWeight: 'bold',
            justification: 'center',
            fontSize: Math.round(size * view.bounds.height)
        });

        text.data.update = function (time) {
            this.position.x = view.bounds.width / 2;
            this.position.y = (1 - position) * view.bounds.height;
            this.fontSize = Math.round(size * view.bounds.height);
            const t = repeat(time, period) / period;
            if (t <= 0.25) {
                this.content = "INSPIREZ";
                this.opacity = easeSin(0, 1, t / 0.25);
            } else if (t <= 0.5) {
                this.content = "INSPIREZ";
                this.opacity = easeSin(1, 0, (t - 0.25) / 0.25);
            } else if (t <= 0.75) {
                this.content = "EXPIREZ";
                this.opacity = easeSin(0, 1, (t - 0.5) / 0.25);
            } else {
                this.content = "EXPIREZ";
                this.opacity = easeSin(1, 0, (t - 0.75) / 0.25);
            }
        }.bind(text);

        return text;
    }

    function createSky() {
        const rect = Shape.Rectangle({
            rectangle: view.bounds,
            fillColor: {
                gradient: {
                    stops: [
                        '#87edf2',
                        '#e7fcfe',
                        '#eafcfe'
                    ]
                },
                origin: new Point(view.bounds.width / 2, view.bounds.top),
                destination: new Point(view.bounds.width / 2, view.bounds.bottom),
            }
        });
        rect.data.update = function () {
            rect.scale(view.bounds.size.divide(rect.bounds.size));
            rect.position = view.bounds.center;
        };
        return rect;
    }

    const sky = createSky();

    const clouds = [];
    for (let i = 0; i < 9; i++) {
        const cloud = createCloud({
            position: Point.random().multiply([1, 0.4]).add([0, 0.1])
        });
        clouds.push(cloud);
    }
    const background = [];

    background.push(createGround({
        base: 0.35,
        height: 0.1,
        frequency: 3.5,
        length: 3,
        period: 7.8,
        color: '#efff7a'
    }));

    background.push(createGround({
        base: 0.25,
        height: 0.1,
        frequency: 3.5,
        length: 3,
        period: 7.4,
        color: '#d3f346'
    }));

    background.push(createGround({
        base: 0.13,
        height: 0.16,
        frequency: 4.5,
        length: 3,
        period: 6.8,
        color: '#bae927'
    }));

    background.push(createGround({
        base: 0.11,
        height: 0.16,
        frequency: 4.5,
        length: 3,
        period: 6.2,
        color: '#a9da0c'
    }));

    background.push(createGround({
        base: 0.09,
        height: 0.11,
        frequency: 4.5,
        length: 3,
        period: 5.3,
        color: '#85c002'
    }));

    background.push(createGround({
        base: 0.04,
        height: 0.11,
        frequency: 3.5,
        length: 3,
        period: 4.1,
        color: '#74ae04'
    }));

    background.push(createGround({
        base: 0.01,
        height: 0.1,
        frequency: 2.5,
        length: 3,
        period: 2,
        color: '#669d01'
    }));

    const elements = [];
    elements.push(createTrack({
        from: trackPosition,
        to: 1 - trackPosition,
        width: 2 * trackWidth,
        color: '#DF9D3E'
    }));
    elements.push(createTrack({
        from: trackPosition,
        to: 1 - trackPosition,
        width: trackWidth,
        color: '#268FAE'
    }));

    let size = blobSize;
    let spacing = blobSpacing;
    let blob = createBlobWithMouth({
        from: trackPosition,
        to: 1 - trackPosition,
        size: 0.5 * size,
        color: '#AAE0E3',
        spacing: 0
    });
    elements.push(blob);
    for (let i = 1; i < blobCount; i++) {
        size *= blobSizeDecay;
        spacing *= blobSpacingDecay;
        blob = createBlob({
            from: trackPosition,
            to: 1 - trackPosition,
            size: 0.5 * size,
            color: '#AAE0E3',
            spacing: spacing
        }, blob);
        elements.push(blob);
    }

    elements.push(createText());

    view.onFrame = function (event) {
        sky.data.update();
        background.forEach(path => {
            if (path.data.update) {
                path.data.update(event.time);
            }
        });
        elements.forEach(path => {
            if (path.data.update) {
                path.data.update(event.time);
            }
        });
        clouds.forEach(cloud => {
            cloud.data.update(event);
        });
    };
}

const app = {
    title: "Réduction du stress",
    content: require('../views/app-exercise-stress-2.html'),
    setup: function () {
        co(exercise());
    },
    exit: function () {
        cancelWait();
        paper.clear();
        if (timeout) {
            clearTimeout(timeout);
        }
    }
};

export default app;
