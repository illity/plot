function setAttributes(element, obj) {
    for (const [key, value] of Object.entries(obj)) {
        element.setAttribute(key, value)
    }
}

class Plot {
    constructor(w = 600, h = 600) {
        this.svg = root.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'svg'))
        this.svg.style.margin = '8px'
        this.width = w
        this.height = h
        setAttributes(this.svg,
            {
                'width': this.width, //document.body.clientWidth,
                'height': this.height //document.body.clientHeight,
            }
        )
        this.aspectRatio = this.width / this.height
        this.fontSize = 100/3200
    }
    drawAxis() {
        const fillColor = 'rgba(255,255,255,1)'
        setAttributes(this.svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'line')), {
            'x1': 0,
            'y1': -999,
            'x2': 0,
            'y2': 999,
            'fill': 'none',
            'stroke-width': .003*this.scale,
            'stroke': fillColor,
            'clip-path': 'url(#myClip)'
        })
        setAttributes(this.svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'line')), {
            'x1': -999,
            'y1': 0,
            'x2': 999,
            'y2': 0,
            'fill': 'none',
            'stroke-width': .003*this.scale,
            'stroke': fillColor,
            'clip-path': 'url(#myClip)'
        })
        
        for (let i = 0; i < 5; i++) {
            const text = this.svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'text'))
            setAttributes(text, {
                'x': 0,
                'y': - (this.lims[1] + (this.lims[3] - this.lims[1])*i/4) * (this.ratio<1?1:this.ratio),
                'text-anchor': 'right',
                'fill': fillColor,
                'alignment-baseline': 'bottom',
                'font-size': this.fontSize * this.scale,
                'font-family': 'Arial, Helvetica, sans-serif',
            })
            this.svg.style.backgroundColor = 'black'
            text.innerHTML = this.lims[1] + (this.lims[3] - this.lims[1])*i/4
            const text2 = this.svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'text'))
            setAttributes(text2, {
                'x': (this.lims[0] + (this.lims[2] - this.lims[0])*i/4) * (this.ratio>1?1:1/this.ratio),
                'y': 0,
                'text-anchor': 'right',
                'fill': fillColor,
                'alignment-baseline': 'bottom',
                'font-size': this.fontSize * this.scale,
                'font-family': 'Arial, Helvetica, sans-serif'

            })
            text2.innerHTML = this.lims[0] + (this.lims[2] - this.lims[0])*i/4

        }
    }
    draw(x, y, options = {}) {
        if (!this.lims) {
            this.lims = [Math.min.apply(null, x), Math.min.apply(null, y), Math.max.apply(null, x), Math.max.apply(null, y)]            
        }
        //this.scale = Math.max((this.lims[3] - this.lims[1]), (this.lims[2] - this.lims[0]))
        this.ratio = (this.lims[2] - this.lims[0]) / (this.lims[3] - this.lims[1]) / this.aspectRatio
        const kkk = 1
        this.scale = kkk *  Math.max(this.lims[2] - this.lims[0], this.lims[3] - this.lims[1]) //* (Math.min(this.width, this.height) / Math.max(this.lims[2] - this.lims[0], this.lims[3] - this.lims[1]))
        for (let i = 0; i < x.length; i++) {
            if (i<x.length-1) {

                const line = this.svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'line'))
                setAttributes(line, {
                    'x1': x[i] * (this.ratio>1?1:1/this.ratio) ,
                    'y1': -y[i] * (this.ratio<1?1:this.ratio),
                    'x2': x[i + 1] * (this.ratio>1?1:1/this.ratio),
                    'y2': -y[i + 1] * (this.ratio<1?1:this.ratio),
                    'fill': 'none',
                    'stroke-width': .003*this.scale,
                    'stroke': 'rgba(0,240,240,1)',
                    'clip-path': 'url(#myClip)'
                })
                setAttributes(line, options)
    
            }

            const circle = this.svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'circle'))                           
            setAttributes(circle, {
                'cx': x[i] * (this.ratio>1?1:1/this.ratio) ,
                'cy': -y[i] * (this.ratio<1?1:this.ratio),
                'r': this.scale/100,
                'fill': 'transparent',
                'stroke-width': this.scale/100,
                'stroke': 'lightgreen'
            })
            setAttributes(circle, options)
        }
        // Axis
        this.drawAxis()
        const dx = this.lims[2]-this.lims[0]
        const dy = this.lims[3]-this.lims[1]
        this.svg.setAttribute('viewBox', `${this.lims[0]-.05*dx} ${-this.lims[3]-.05*dy} ${this.lims[2] - this.lims[0]+.1*dx} ${this.lims[3] - this.lims[1] + .1*dy}`)
    }
    setLims(lims) {
        this.lims = lims
    }

}


function linspace(lower, upper, n) {
    return Array(n).fill(0).map((_, i) => lower + i * (upper - lower) / (n - 1))
}

root = document.getElementById('root')

x = linspace(-2, 2, 20)
y = x.map(x => x**3)
for (let i = 1; i < 5; i++) {
    p = new Plot()
    p.setLims([-2, -8, 2, 8])
    p.draw(x, x.map(x=>x**i))
}
[(x=>Math.sin(x)),
 (x=>Math.cos(x)),
 (x=>Math.tan(x)),
 (x=>Math.cosh(x))
].forEach(f => {
    p = new Plot()
    p.setLims([-1, -1, 1, 1])
    p.draw(x, x.map(f))    
})

