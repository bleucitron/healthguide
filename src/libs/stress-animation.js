const trackPosition = 0.2;
const trackWidth = 0.15;

function wave(t, scale) {return 1 - (Math.cos(t * 2 * Math.PI / scale) * 0.5 + 0.5);}

function createWave(options) {
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
        update: function(time, period) {
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

function createBlob(options) {
    const amplitude = options.to - options.from;
    const blob = Shape.Circle(new Point(), 1);
    console.log(blob);
    blob.fillColor = options.color;
    blob.data = {
        update: function(time, period) {
            const scale = view.size.width;
            const x = options.x * view.size.width;
            this.radius = options.size * view.size.height;
            this.position.x = x;
            this.position.y = options.from * view.size.height + wave(time * scale / period + x, scale) * amplitude * view.size.height;
        }.bind(blob)
    };
    blob.data.update(0, 1);
    // blob.fullySelected = true
    return blob;
}


const paths = [];
paths.push(createWave({
    from: trackPosition,
    to: 1 - trackPosition,
    width: 2 * trackWidth,
    color: '#DF9D3E'
}));
paths.push(createWave({
    from: trackPosition,
    to: 1 - trackPosition,
    width: trackWidth,
    color: '#268FAE'
}));
paths.push(createBlob({
    from: trackPosition,
    to: 1 - trackPosition,
    size: 0.5*trackWidth + 0.02,
    color: '#AAE0E3',
    x: 0.5
}));


function onFrame(event) {
    paths.forEach(path => {
        path.data.update(event.time, 10);
    });
}
