let REST_DENS = 300
let GAS_CONST = 2000
let H = 16
let HSQ = H*H
let MASS = 2.5
let VISC = 200
let POLY6 = Math.sqrt(H)/(Math.PI*Math.pow(H,8))
let SPIKY_GRAD = -(Math.sqrt(H)+6) / (Math.PI*H**5)
let VISC_LAP = Math.sqrt(H)*10 / (Math.PI*H**5)
let EPS = H
let BOUND_DAMP = -0.5
let G
let DT = 0.0007

class Particle{
  constructor(x,y){
    this.pos = createVector(x,y)
    this.v = createVector()
    this.rho = 0
    this.f = createVector()
    this.p = 0
    this.radius = H/2
    this.scu = createVector()
  }
  show(){
    circle(this.pos.x,this.pos.y,H/2)
  }
}

function densityPressure(){
  for (let p of particles){
    p.rho = 0
    for (let pj of particles){
      let rij = p5.Vector.sub(pj.pos,p.pos)
      let r2 = rij.magSq()
      if (r2 < HSQ){
        p.rho += MASS * POLY6 * pow(HSQ-r2,3)
      }
    }
    p.p = GAS_CONST*(p.rho-REST_DENS)
  }
}

function forces(){
  for (let p of particles){
    let fpress = createVector()
    let fvisc = createVector()
    for (let pj of particles){
      if (pj == p){
        continue
      }
      let rij = p5.Vector.sub(pj.pos,p.pos)
      let r = rij.mag()
      
      if (r < H){
        let a = p5.Vector.mult(rij.normalize(),-MASS*(pj.p+p.p)*SPIKY_GRAD*pow(H-r,3)/(2*pj.rho))
        
        
        let con = VISC*MASS*VISC_LAP*(H-r)/(pj.rho)
        fpress.add(a)
        fvisc.add(p5.Vector.mult(p5.Vector.sub(pj.v,p.v),con  ))
      }
    }
    let fgrav = p5.Vector.mult(G,MASS/p.rho)
    let fo = createVector()
    fo.add(fpress)
    fo.add(fvisc)
    fo.add(fgrav)
    p.f=fo
  }
}

function integrate(){
  for (let p of particles){
    p.v.add(p5.Vector.mult(p.f,DT/p.rho))
    p.pos.add(p5.Vector.mult(p.v,DT))
    if (p.pos.y+H>height){
      p.v.y*=BOUND_DAMP
      p.pos.y=height-EPS
    }
    if (p.pos.x+EPS>width){
      p.v.x*=BOUND_DAMP
      p.pos.x=width-EPS
    }
    if (p.pos.x<EPS){
      p.v.x*=BOUND_DAMP
      p.pos.x=EPS
    }
    if (!meta){
      p.show()
    }
  }
}
