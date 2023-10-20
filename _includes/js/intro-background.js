'use strict';

/*!
 * ML in PL Jekyll Theme - Intro animation
 * This script animates the intro background
 */

const canvas = document.getElementById("intro-background"),
      ctx = canvas.getContext("2d"),
      fps = 30,  // To make it less cpu intensive, we only update the canvas every 30 frames
      framesInterval = 1000 / 30;

let then = 0,
    width = 0,
    height = 0,
    bgParticles = [], // Background particles
    mgParticles = [], // Middle ground particles
    fgParticles = [], // Foreground particles
    connectionDistanceThreshold = 125,
    backgroundColor = "{{ site.color.background }}",
    bgParticlesCfg = {
        colors: "#DDD",
        lineColors: "#DDD",
        sizeMin: 4,
        sizeRange: 3,
        speedMax: 0.4,
        groups: [[0, 1], [0, 2], [1, 2]],
        density: 0.0002
    },
    mgParticlesCfg = {
        colors: "#AAA",
        lineColors: "#AAA",
        sizeMin: 2,
        sizeRange: 2,
        speedMax: 0.6,
        groups: [[]], // This group of particles has no connecting lines
        density: 0.0002
    },
    fgParticlesCfg = {
        colors: {"{{ site.color.main }}": 0.3, "#222": 0.3, "#666": 0.4},
        lineColors: {"#222": 0.3, "#444": 0.3, "#666": 0.3},
        sizeMin: 2,
        sizeRange: 5,
        speedMax: 0.8,
        groups: [[0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4], [0], [1], [2], [3], [4], [0], [1], [2], [3], [4]],
        density: 0.0004
    };

// Helper functions
function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function rulletChoice(dict){
    let total = 0;
    for (let key in dict) total += dict[key];
    let r = Math.random() * total;
    for (let key in dict){
        r -= dict[key];
        if (r < 0) return key;
    }
}

// Standard Normal variate using Box-Muller transform.
function gaussianRandom(mean=0, stdev=1) {
    let u = 1 - Math.random(); //Converting [0,1) to (0,1)
    let v = Math.random();
    let z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}

function distVec2d(vec1, vec2){
    return Math.sqrt(Math.pow(vec1.x - vec2.x, 2) + Math.pow(vec1.y - vec2.y, 2));
}

function wrappedDistVec2d(vec1, vec2){
    let dist = distVec2d(vec1, vec2);
    if (dist > width / 2) dist = width - dist;
    return dist;
}

function drawParticle(ctx, p){
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI, false);
    ctx.fill();
}

function drawLine(ctx, p1, p2){
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineWidth = 1;
    ctx.strokeStyle = p1.lineColor;
    ctx.stroke();
}

function updateParticle(p){
    let prevSinVal = Math.sin(p.x / p.freq) * p.amp;
    p.x += p.velX;
    let nextSinVal = Math.sin(p.x / p.freq) * p.amp;
    p.y += p.velY * (prevSinVal - nextSinVal);

    // Wrap around the left and right
    if(p.x < -connectionDistanceThreshold) p.x = width + connectionDistanceThreshold; 
    else if(p.x > width + connectionDistanceThreshold) p.x = -connectionDistanceThreshold;
    if(p.y + p.size >= height) p.velY *= -1;
}

function drawParticles(ctx, particles){
    // Update position of particles
    for (let p of particles) updateParticle(p);

    // Draw lines between particles in the same group
    for (let i = 0; i < particles.length - 1; i++){
        // Skip particles that are not in any group - can't connect to any other particle
        if (particles[i].groups.length === 0) continue;

        for(let j = i + 1;  j < particles.length; j++){
            const p1 = particles[i],
                  p2 = particles[j];

            // This part can be done faster by creating indexes for groups, but I'm too lazy to implemt it
            if(distVec2d(p1, p2) > connectionDistanceThreshold) continue;

            for (let g of p1.groups){  
                if (p2.groups.includes(g)){
                    drawLine(ctx, p1, p2);
                    break;
                }
            }
        }
    }

    // Draw all particles
    for (let p of particles) drawParticle(ctx, p);
}

var imgMap = new Image;
imgMap.src = "{{ site.url }}/images/misc/countries-of-europe.png";

var imgMapStroke = new Image;
imgMapStroke.src = "{{ site.url }}/images/misc/countries-of-europe-stroke.png";

function createOffscreenCanvas(width, height){
    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}
    
function draw(){
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    drawParticles(ctx, bgParticles);

    let helperCanvas = createOffscreenCanvas(width, height),
        helperCtx = helperCanvas.getContext("2d");

    // Draw right, fit
    // let imgH = imgMap.height,
    //     imgW = imgMap.width,
    //     ratio = height / imgMap.height,
    //     drawImgH = imgH * ratio,
    //     drawImgW = imgW * ratio;
    // ctx.drawImage(imgMap, 0, 0, imgW, imgH, width - drawImgW, 0, drawImgW, drawImgH);

    // Draw right, croped
    let imgH = imgMap.height,
        imgW = imgMap.width,
        ratio = Math.max(width / 2 / imgW, height / imgH),
        drawImgH = imgH * ratio,
        drawImgW = imgW * ratio;
    
    helperCtx.fillStyle = "#EEE";
    helperCtx.fillRect(0, 0, width, height);

    helperCtx.drawImage(imgMapStroke, 0, 0, imgW, imgH, width - drawImgW, height / 2 - drawImgH / 2, drawImgW, drawImgH);
    drawParticles(helperCtx, mgParticles);
    drawParticles(helperCtx, fgParticles);
    
    helperCtx.globalCompositeOperation = 'destination-in';
    helperCtx.drawImage(imgMap, 0, 0, imgW, imgH, width - drawImgW, height / 2 - drawImgH / 2, drawImgW, drawImgH);
    ctx.drawImage(helperCanvas, 0, 0);
}
    
function createParticles(x, y, width, height, particlesCfg) {
    let newParticlesCount = width * height * particlesCfg.density,
        newParticles = [];

    // Create new particles
    for(let i = 0; i < newParticlesCount; i++){
        newParticles.push({
            x: Math.random() * (width + 2 * connectionDistanceThreshold) + x - connectionDistanceThreshold,
            y: gaussianRandom(0, 1) * 2/3 * height + y,
            velX: (Math.random() * 2 - 1) * particlesCfg.speedMax,
            velY: (Math.random() * 2 - 1) * particlesCfg.speedMax,
            freq: Math.random() * 100 + 100,
            amp: Math.random() * 100,
            size: Math.random() * particlesCfg.sizeRange + particlesCfg.sizeMin,
            color: typeof particlesCfg.colors === "string" ? particlesCfg.colors : rulletChoice(particlesCfg.colors),
            lineColor: typeof particlesCfg.lineColors === "string" ? particlesCfg.lineColors : rulletChoice(particlesCfg.lineColors),
            groups: randomChoice(particlesCfg.groups),
        });
    }

    return newParticles;
}

function spawnParticles(x, y, width, height) {
    bgParticles.push(...createParticles(x, y, width, height, bgParticlesCfg));
    mgParticles.push(...createParticles(x, y, width, height, mgParticlesCfg));
    fgParticles.push(...createParticles(x, y, width, height, fgParticlesCfg));
}

function removeOutOfBoundsParticles(particles) {
    return particles.filter(function(p){
        return !(p.x < 0 || p.x > width || p.y < 0 || p.y > height);
    });
}
    
function resize() {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    // Reset and generate new particles 
    // (this is easier than trying to resize the existing ones)
    bgParticles = [];
    mgParticles = [];
    fgParticles = [];
    spawnParticles(0, 0, width, height);
}

function render() {
    const now = Date.now();
    let timeElapsed = now - then;

    // Stop animation when tab is not visible to save resources
    if(document.hidden){
        then = now;
        timeElapsed = 0;
    }

    // Limit framerate
    if (timeElapsed >= framesInterval){
        // Get ready for next frame by setting then=now,
        // also, adjust for screen refresh rate
        then = now - (timeElapsed % framesInterval);

        // Check if resize is needed
        if(width !== canvas.offsetWidth || height !== canvas.offsetHeight) resize();

        // Update animation
        draw();
    }
    requestAnimationFrame(render);
}

render();
    
