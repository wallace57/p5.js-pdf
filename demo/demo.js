var queue = [];

var pdf;

function setup() {
    // init frame
    createCanvas(400, 400);
    frameRate(40);
    background(0xee);

    // init tree
    queue.push({
        x: width / 2,
        y: height,
        length: height / 4,
        angle: Math.PI / 2
    });

    // init PDF
    pdf = new p5.PDF({ppi: 100}); // should be called after #defaultCanvas is ready

    document.getElementById('open').onclick = function() {
        window.location.href = pdf.toObjectURL();
    };

    document.getElementById('download').onclick = function() {
        pdf.save({filename: 'perlin-noise-tree.pdf'});
    };

    document.getElementById('open-cols-rows').onclick = function() {
        window.location.href = pdf.toObjectURL({columns: 3, rows: 4});
    };

    document.getElementById('open-landscape').onclick = function() {
        window.location.href = pdf.toObjectURL({landscape: true});
    };

    document.getElementById('open-custom-image-margin').onclick = function() {
        window.location.href = pdf.toObjectURL({imageMargin: {top: 5, right: 5, bottom: 5, left: 5}});
    };
}

var perlinNoiseSeed = 1.101;

function drawTree(tree) {
    var x = tree.x,
        y = tree.y,
        length = tree.length,
        angle = tree.angle;

    var x2 = x - length * Math.cos(angle),
        y2 = y - length * Math.sin(angle);

    var minLength = width / 24;

    if(length > minLength) {
        strokeWeight(4);
        stroke(222, 185, 135); // branches
    } else {
        strokeWeight(2);
        stroke(167, 202, 165); // leaves
    }

    line(x, y, x2, y2);

    if(length < minLength) {
        return;
    }

    // next
    perlinNoiseSeed += 0.000001;

    // left
    queue.push({
        x: x2,
        y: y2,
        length: length / 1.414,
        angle: angle + noise(perlinNoiseSeed) * 0.5 - Math.PI / 4
    });
    // right
    queue.push({
        x: x2,
        y: y2,
        length: length / 1.414,
        angle: angle + noise(perlinNoiseSeed) * 0.5 + Math.PI / 4
    });
}

function draw() {
    var tree = queue.shift();
    if(tree) {
        drawTree(tree);
        pdf.capture();
    } else {
        noLoop();
    }
}

