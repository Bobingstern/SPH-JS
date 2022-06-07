
let particles = []
let cSize = 8
let cols
let rows
let useLerp = true
let mouseDown = false
let meta = false
let lockChamber = []
function cornersBinaryToDecimal(corner0, corner1, corner2, corner3) {
  return corner0 * 8 + corner1 * 4 + corner2 * 2 + corner3 * 1
}

function LERP(value1, value2, amount) {
  amount = amount < 0 ? 0 : amount
  amount = amount > 1 ? 1 : amount
  return value1 + (value2 - value1) * amount
}
function vecLine(a,b,v){
  
  // if (a.y > height/1.5 && b.y > height/1.5){
  //   fill(0,0,255)
  //   beginShape()
  //   vertex(a.x,a.y)
  //   vertex(b.x,b.y)
  //   vertex(b.x,height)
  //   vertex(a.x,height)
  //   endShape(CLOSE)
  // }
  if (v != undefined){
    vertex(a.x,a.y)
    vertex(b.x,b.y)
  }
  else{
    line(a.x,a.y,b.x,b.y)
  }
}

function setup() {
  createCanvas(600, 600);
  G = createVector(0,50)
  cols = width/cSize
  rows = height/cSize
  for (let y=height/9;y<height/1.5;y+=H){
    for (let x=150;x<250;x+=H){
      particles.push(new Particle(x+random(-3,3),y)) 
    }
  }
  densityPressure()
  forces()
}

function draw() {
  background(232);
  stroke(0)
  fill(0)
  text("FPS:"+frameRate(),20,20)
  text("Press R to toggle Render and Space to add particles. You can drag stuff too",20,40)
  densityPressure()
  forces()
  integrate()
  if (meta){
    let corners = []
    let samples = []
    for (let i=0;i<cols;i++){
      samples.push([])
      corners.push([])
      for (let j=0;j<rows;j++){
        let x = i*cSize
        let y = j*cSize
        let sum = 0
        for (let b of particles){
          let dx = b.pos.x-x
          let dy = b.pos.y-y
          let d2 = dx*dx + dy*dy
          sum +=  b.radius**2 / d2
        }
        samples[i].push(sum)
        corners[i].push(samples[i][j] > 1)
        
        if (j>0 && i > 0){
          let I = i-1
          let J = j-1
          let a
          let b
          let c 
          let d

          if (useLerp){
            const aVal = samples[I][J]
            const bVal = samples[I + 1][J]
            const cVal = samples[I + 1][J + 1]
            const dVal = samples[I][J + 1]

            let amt = (1 - aVal) / (bVal - aVal)

            a = createVector(LERP(x, x + cSize, amt), y)

            amt = (1 - bVal) / (cVal - bVal)
            b = createVector(
              x + cSize,
              LERP(y, y + cSize, amt),
            )

            amt = (1 - dVal) / (cVal - dVal)
            c = createVector(
              LERP(x, x + cSize, amt),
              y + cSize,
            )

            amt = (1 - aVal) / (dVal - aVal)
            d = createVector(x, LERP(y, y + cSize, amt))
          }
          else{
            a = createVector(x+cSize/2,y)
            b = createVector(x+cSize,y+cSize/2)
            c = createVector(x+cSize/2,y+cSize)
            d = createVector(x,y+cSize/2)
          }
          const state = cornersBinaryToDecimal(
            corners[I][J],
            corners[I + 1][J],
            corners[I + 1][J + 1],
            corners[I][J + 1],
          )
          stroke(0,0,(height-y+50)*2)
          fill(0,0,(height-y+50)*2)
          //console.log(a.x)
          switch (state) {
            case 0:
              break
            case 1:
              //vecLine(d, c)

              beginShape()
              vertex(d.x,d.y)
              vertex(c.x,c.y)
              vertex(d.x,c.y)
              endShape(CLOSE)
              break
            case 2:
              //vecLine(b, c)

              beginShape()
              vertex(b.x,b.y)
              vertex(c.x,c.y)
              vertex(b.x,c.y)
              endShape(CLOSE)
              break
            case 3:
              //vecLine(d, b)
              beginShape()
              vertex(d.x,d.y)
              vertex(b.x,b.y)
              vertex(b.x,c.y)
              vertex(d.x,c.y)
              endShape(CLOSE)
              break
            case 4:
              //vecLine(a, b)

              beginShape()
              vertex(a.x,a.y)
              vertex(b.x,b.y)
              vertex(b.x,a.y)
              endShape(CLOSE)
              break
            case 5:

              // vecLine(a, d)
              // vecLine(b, c)
              beginShape()
              
              endShape(CLOSE)
              break
            case 6:

              //vecLine(a, c)
              beginShape()
              vertex(a.x,a.y)
              vertex(c.x,c.y)
              vertex(b.x,c.y)
              vertex(b.x,a.y)
              endShape(CLOSE)
              break
            case 7:
              //vecLine(a, d)

              beginShape()
              vertex(a.x,a.y)
              vertex(d.x,d.y)
              vertex(d.x,c.y)
              vertex(b.x,c.y)
              vertex(b.x,a.y)
              endShape(CLOSE)
              // fill(0)
              // stroke(0)
              // circle(d.x,c.y,2)
              break
            case 8:
              //vecLine(a, d)

              beginShape()
              vertex(a.x,a.y)
              vertex(d.x,d.y)
              vertex(d.x,a.y)
              endShape(CLOSE)

              //circle()
              break
            case 9:

              //vecLine(a, c)
              beginShape()
              vertex(a.x,a.y)
              vertex(c.x,c.y)   
              vertex(d.x,c.y)
              vertex(d.x,a.y)
              endShape(CLOSE)

              break
            case 10:
              // vecLine(a, b,true)
              // vecLine(c, d,true)
              break
            case 11:
              //vecLine(a, b)
              beginShape()
              vertex(a.x,a.y)
              vertex(b.x,b.y)
              vertex(b.x,c.y)
              vertex(d.x,c.y)
              vertex(d.x,a.y)
              endShape(CLOSE)

              
              break
            case 12:
              //vecLine(b, d)
              beginShape()
              vertex(d.x,d.y)
              vertex(b.x,b.y)
              vertex(b.x,a.y)
              vertex(d.x,a.y)
              endShape(CLOSE)

              
              break
            case 13:
              //vecLine(b, c)
              beginShape()
              vertex(b.x,b.y)
              vertex(c.x,c.y)
              vertex(d.x,c.y)
              vertex(d.x,a.y)
              vertex(b.x,a.y)
              //vertex(a.x,b.y)
              endShape(CLOSE)

              break
            case 14:
              //vecLine(d, c)
              beginShape()
              vertex(d.x,d.y)
              vertex(c.x,c.y)
              vertex(b.x,c.y)
              vertex(b.x,a.y)
              vertex(d.x,a.y)

              endShape(CLOSE)
              
              break
            case 15:
              beginShape()
              // vertex(a.x,a.y)
              // vertex(b.x,a.y)
              // vertex(b.x,c.y)
              // vertex(a.x,c.y)
              // endShape(CLOSE)
              // beginShape()
              // vertex(d.x,a.y)
              // vertex(a.x,a.y)
              // vertex(a.x,c.y)
              // vertex(d.x,c.y)
              // endShape(CLOSE)
              rect(d.x,a.y,cSize)
              break
          }
        }
          
      }
    }
  }
  for (let p of lockChamber){
    p.pos = createVector(mouseX,mouseY)
    p.pos.add(p.scu)
    p.v.mult(0)
  }
  //particles[0].show()
}
  
function mousePressed(){
  mouseDown = true
  lockChamber = []
  for (let p of particles){
    if (dist(p.pos.x,p.pos.y,mouseX,mouseY) < 50){
      p.scu = p5.Vector.sub(p.pos,createVector(mouseX,mouseY))
      lockChamber.push(p)
    }
  }
}
function mouseReleased(){
  mouseDown = false
  lockChamber = []
}
function keyPressed(){
  if (keyCode == 32){
    for (let y=mouseY-H*2;y<mouseY+H*2;y+=H){
      for (let x=mouseX-H*2;x<mouseX+H*2;x+=H){
        particles.push(new Particle(x,y))
      }
    }
  }
  if (keyCode == 82){
    meta = !meta
  }
}
