function setAttributes(element, obj) {
    for (const [key, value] of Object.entries(obj)) {
        element.setAttribute(key, value)
    }
}

class Plot {
    constructor(w = 400, h = 400) {
        this.svg = root.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'svg'))
        this.svg.style.margin = '8px'
        this.width = w
        this.height = h
        this.legendSize = [this.width / 7, this.height / 7]
        setAttributes(this.svg,
            {
                'width': this.width,
                'height': this.height,
            }
        )
        this.aspectRatio = this.width / this.height
        this.fontSize = 12
    }
    drawAxis() {
        const fillColor = 'rgba(255,255,255,1)'

        const [x0, y0, xf, yf] = [this.legendSize[0] / 2,
        -this.legendSize[1] / 2,
        this.width - this.legendSize[0] / 2,
        -this.height + this.legendSize[1] / 2]
        const path = `M${x0} ${y0}L${x0} ${yf}L${xf} ${yf}L${xf} ${y0}Z`
        const pathElement = this.svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'path'))
        setAttributes(pathElement, {
            'stroke': 'white',
            'd': path,
            'stroke-width': .5,
            'fill': 'none'
        })
        for (let i = 0; i < 5; i++) {
            const text = this.svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'text'))
            setAttributes(text, {
                'x': this.legendSize[0] / 2 - 5,
                'y': -this.legendSize[1] / 2 - ((this.height - this.legendSize[1]) * i / 4),
                'fill': fillColor,
                'text-anchor': 'end',
                'alignment-baseline': 'middle',
                'font-size': this.fontSize,
                'font-family': 'Arial, Helvetica, sans-serif',
            })
            this.svg.style.backgroundColor = 'black'
            text.innerHTML = (this.lims[1] + (this.lims[3] - this.lims[1]) * i / 4).toFixed(2)
            const text2 = this.svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'text'))
            setAttributes(text2, {
                'x': this.legendSize[0] / 2 + ((this.width - this.legendSize[0]) * i / 4),
                'y': -this.legendSize[1] / 2 + 5,
                'fill': fillColor,
                'text-anchor': 'middle',
                'alignment-baseline': 'hanging',
                'font-size': this.fontSize,
                'font-family': 'Arial, Helvetica, sans-serif'

            })
            text2.innerHTML = (this.lims[0] + (this.lims[2] - this.lims[0]) * i / 4).toFixed(2)

        }
    }
    setLims(lims) {
        this.lims = lims
    }
    plot(x, y, options = {'color': 'cyan'}) {
        if (!this.lims) {
            this.lims = [Math.min.apply(null, x), Math.min.apply(null, y), Math.max.apply(null, x), Math.max.apply(null, y)]
        }
        this.drawAxis()
        for (let i = 0; i < x.length; i++) {
            const X = this.legendSize[0] / 2 + (this.width - this.legendSize[0]) * (x[i] - this.lims[0]) / (this.lims[2] - this.lims[0])
            const Y = -this.legendSize[1] / 2 + (this.height - this.legendSize[1]) * (-y[i] + this.lims[1]) / (this.lims[3] - this.lims[1])
            if (i == 0) var path = `M${X} ${Y} `
            path += `L${X} ${Y}`
        }
        this.svg.setAttribute('viewBox', `0 ${-this.height} ${this.width} ${this.height}`)
        const pathElement = this.svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'path'))
        setAttributes(pathElement, {
            'stroke': options['color'],
            'd': path,
            'stroke-width': 1,
            'fill': 'none'
        })
    }
}


function linspace(lower, upper, n) {
    return Array(n).fill(0).map((_, i) => lower + i * (upper - lower) / (n - 1))
}

root = document.getElementById('root')

p = new Plot()
p.plot(linspace(-1, 1, 50), linspace(-1, 1, 50).map(x => x * x))

x = linspace(-6.28, 6.28, 200)
p = new Plot()
p.setLims([0,0,1,1])
p.plot(x, x.map(x=>(x*x)))

y = x.map(x => x**3)
for (let i = 1; i < 4; i++) {
    p = new Plot()
    p.plot(x, x.map(x=>x**i))
}
[(x=>Math.sin(x)),
 (x=>Math.cos(x)),
 (x=>Math.tan(x)),
 (x=>x*Math.random())
].forEach(f => {
    p = new Plot()
    p.plot(x, x.map(f), {color: `hsl(${360*Math.random()}, 100%, 50%)`,
                         markerRadius: 3})
})
