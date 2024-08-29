const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, '#C96480');
gradient.addColorStop(0.5, '#B47978');  
gradient.addColorStop(1, '#99D17B');
ctx.fillStyle = gradient;
ctx.strokeStyle = '#B1AE91';


class Particle {
    constructor(effect) {
        this.effect = effect;
        this.radius = Math.random() * 10 + 5;
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2); 
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2); 
        this.vx = Math.random() * 2 - 0.5; 
        this.vy = Math.random() * 2 - 0.5;  
    }

    draw(context) { 
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
       // context.stroke();
    }

    update() {
        this.x += this.vx;
        if (this.x > this.effect.width - this.radius || this.x < this.radius) this.vx *= -1;

        this.y += this.vy;
        if (this.y > this.effect.height - this.radius || this.y < this.radius) this.vy *= -1;
    }
}

class Effect {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numberofParticles = 200;
        this.createParticles();
    }

    createParticles() {
        for (let i = 0; i < this.numberofParticles; i++) {
            this.particles.push(new Particle(this));
        }
    }

    handleParticles(context) {
        this.particles.forEach(particle => {
            particle.draw(context);
            particle.update();
        });
        this.connectParticles(context);
    }
    connectParticles(context){
        const maxDistance =100;
        for(let a=0 ; a < this.particles.length ; a++){
            for(let b = a; b < this.particles.length ; b++){
                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;
                const distance = Math.hypot(dx ,dy);
                if(distance < maxDistance){
                    context.save();
                    const opacity = 1 - (distance/maxDistance);
                    context.globalAlpha = opacity;
                    context.beginPath();
                    context.moveTo(this.particles[a].x , this.particles[a].y);
                    context.lineTo(this.particles[b].x , this.particles[b].y);
                    context.stroke();
                    context.restore();
        }
    }
}
}}
const effect = new Effect(canvas);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  
    effect.handleParticles(ctx);
    requestAnimationFrame(animate);
}

animate();
