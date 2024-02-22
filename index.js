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
        setAttributes(this.svg,
            {
                'width': this.width,
                'height': this.height,
            }
        )
        this.aspectRatio = this.width / this.height
        this.fontSize = 100 / 3200
    }
    drawAxis() {
        const fillColor = 'rgba(255,255,255,1)'

        this.legendSize = [this.width / 10, this.height / 10]
        setAttributes(this.svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'line')), {
            'x1': this.legendSize[0],
            'y1': -this.height,
            'x2': this.legendSize[0],
            'y2': -this.legendSize[1],
            'fill': 'none',
            'stroke-width': 1,
            'stroke': fillColor,
            'clip-path': 'url(#myClip)'
        })
        setAttributes(this.svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'line')), {
            'x1': this.legendSize[0],
            'y1': -this.legendSize[1],
            'x2': this.width,
            'y2': -this.legendSize[1],
            'fill': 'none',
            'stroke-width': 1,
            'stroke': fillColor,
            'clip-path': 'url(#myClip)'
        })
        for (let i = 0; i < 5; i++) {
            const text = this.svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'text'))
            setAttributes(text, {
                'x': 0,
                'y': -this.legendSize[1] - ((this.height - this.legendSize[1]) * i / 4) + 6,
                'text-anchor': 'right',
                'fill': fillColor,
                'alignment-baseline': 'bottom',
                'font-size': 600 * this.fontSize,
                'font-family': 'Arial, Helvetica, sans-serif',
            })
            this.svg.style.backgroundColor = 'black'
            text.innerHTML = (this.lims[1] + (this.lims[3] - this.lims[1]) * i / 4).toFixed(2)
            const text2 = this.svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'text'))
            setAttributes(text2, {
                'x': this.legendSize[0] + ((this.width - this.legendSize[0]) * i / 4) - 25,
                'y': -this.legendSize[1] + 32,
                'text-anchor': 'right',
                'fill': fillColor,
                'alignment-baseline': 'bottom',
                'font-size': 600 * this.fontSize,
                'font-family': 'Arial, Helvetica, sans-serif'

            })
            text2.innerHTML = (this.lims[0] + (this.lims[2] - this.lims[0]) * i / 4).toFixed(2)

        }
        const clipPath = this.svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'clipPath'))
        clipPath.id = 'myClip'
        const rect = clipPath.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'rect'))
        setAttributes(rect, {
            'x': this.legendSize[0],
            'y': -this.height,
            'width': this.width - this.legendSize[0],
            'height': this.height - this.legendSize[1],
            'fill': 'blue'
        })
    }
    draw(x, y, options = {
        'color': 'cyan',
        'markerRadius': 0
    }) {
        if (!this.lims) {
            this.lims = [Math.min.apply(null, x), Math.min.apply(null, y), Math.max.apply(null, x), Math.max.apply(null, y)]
        }

        this.drawAxis()
        const kkk = 1
        for (let i = 0; i < x.length; i++) {
            if (i < x.length - 1) {
                const line = this.svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'line'))
                setAttributes(line, {
                    'x1': this.legendSize[0] + (this.width - this.legendSize[0]) * (x[i] - this.lims[0]) / (this.lims[2] - this.lims[0]),
                    'y1': -this.legendSize[1] + (this.height - this.legendSize[1]) * (-y[i] + this.lims[1]) / (this.lims[3] - this.lims[1]),
                    'x2': this.legendSize[0] + (this.width - this.legendSize[0]) * (x[i + 1] - this.lims[0]) / (this.lims[2] - this.lims[0]),
                    'y2': -this.legendSize[1] + (this.height - this.legendSize[1]) * (-y[i + 1] + this.lims[1]) / (this.lims[3] - this.lims[1]),
                    'fill': 'none',
                    'stroke-width': 1,
                    'stroke': options.color,
                    'clip-path': 'url(#myClip)'
                })
                setAttributes(line, options)
            }
            if (!options.markerRadius) continue
            const circle = this.svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'circle'))
            setAttributes(circle, {
                'cx': this.legendSize[0] + (this.width - this.legendSize[0]) * (x[i] - this.lims[0]) / (this.lims[2] - this.lims[0]),
                'cy': -this.legendSize[1] + (this.height - this.legendSize[1]) * (-y[i] + this.lims[1]) / (this.lims[3] - this.lims[1]),
                'r': options.markerRadius,
                'fill': 'none',
                'stroke-width': 1,
                'stroke': 'white'
            })
            setAttributes(circle, options)
        }
        this.svg.setAttribute('viewBox', `0 ${-this.height} ${this.width} ${this.height}`)
    }
    setLims(lims) {
        this.lims = lims
    }

}


function linspace(lower, upper, n) {
    return Array(n).fill(0).map((_, i) => lower + i * (upper - lower) / (n - 1))
}

root = document.getElementById('root')

// x = linspace(-6.28, 6.28, 100)
// p = new Plot()
// p.setLims([0,0,1,1])
// p.draw(x, x.map(x=>(x*x)))

// y = x.map(x => x**3)
// for (let i = 1; i < 4; i++) {
//     p = new Plot()
//     p.draw(x, x.map(x=>x**i))
// }
// [(x=>Math.sin(x)),
//  (x=>Math.cos(x)),
//  (x=>Math.tan(x)),
//  (x=>x*Math.random())
// ].forEach(f => {
//     p = new Plot()
//     p.draw(x, x.map(f), {color: `hsl(${360*Math.random()}, 100%, 50%)`,
//                          markerRadius: 3})
// })
