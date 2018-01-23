const trackPosition = 0.2;
const trackWidth = 0.15;
const blobSize = 0.19;
const blobSpacing = 0.2;
const blobSizeDecay = 0.6;
const blobSpacingDecay = 0.7;
const blobCount = 4;

function wave(t, scale) {return 1 - (Math.cos(t * 2 * Math.PI / scale) * 0.5 + 0.5);}
function waveGrad(t, scale) {return Math.sin(t * 2 * Math.PI / scale) * Math.PI / scale;}

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

function createBlob(options, previous) {
    const amplitude = options.to - options.from;
    const blob = Path.Circle(new Point(), options.size * view.size.height);
    
    blob.fillColor = options.color;
    blob.data = {
        update: function(time, period) {
            const scale = view.size.width;
            const previousX = previous ? previous.position.x : (0.5 * view.size.width);
            const gradY = waveGrad(time * scale / period + previousX, scale) * amplitude * view.size.height;
            const angle = Math.atan2(gradY, 1);
            const x = previousX - options.spacing * Math.cos(angle) * view.size.width;
            const rad = this.bounds.width / 2;
            const radius = options.size * view.size.height;
            this.scale(radius / rad);
            this.position.x = x;
            this.position.y = options.from * view.size.height + wave(time * scale / period + x, scale) * amplitude * view.size.height;
        }.bind(blob),
    };
    //blob.data.update(0, 1);
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

let size = blobSize;
let spacing = blobSpacing;
let blob = createBlob({
        from: trackPosition,
        to: 1 - trackPosition,
        size: 0.5 * size,
        color: '#AAE0E3',
        spacing: 0
    });
paths.push(blob);
for (let i=1; i < blobCount; i++) {
    size *= blobSizeDecay;
    spacing *= blobSpacingDecay;
    blob = createBlob({
        from: trackPosition,
        to: 1 - trackPosition,
        size: 0.5 * size,
        color: '#AAE0E3',
        spacing: spacing
    }, blob);
    paths.push(blob);
}

function onFrame(event) {
    paths.forEach(path => {
        path.data.update(event.time, 10);
    });
}
