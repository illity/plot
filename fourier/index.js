class Complex {
	constructor(x, y = 0) {
		this.real = x;
		this.imag = y;
		this.add = (b) => {
			return new Complex(this.real + b.real, this.imag + b.imag);
		}
		this.mul = (b) => {
			return new Complex(this.real * b.real - this.imag * b.imag, this.real * b.imag + this.imag * b.real);
		}
	}

	static add(a, b) {
		return new Complex(a.real + b.real, a.imag + b.imag);
	}

	static mul(a, b) {
		return new Complex(a.real * b.real - a.imag * b.imag, a.real * b.imag + a.imag * b.real);
	}
}

function complexIntegrate(f, x0, xf, p) {
	let soma = new Complex(0, 0)
	dx = (xf - x0) / p
	for (let i = 0; i < p; i++) {
		soma = soma.add(Complex.mul(new Complex(dx, 0), f(x0 + i * dx, 0)));
	}
	return soma;
}

pi = 3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679
T = 2 * pi

f = (x) => ((x.real < pi)?new Complex(1):new Complex(0));
exp = (x) => (new Complex(Math.cos(x.imag), Math.sin(x.imag)));
z = (f, w0) => (t) => Complex.mul(f(new Complex(t)), exp(new Complex(0, -w0 * t)))

function getFourierConstants(n) {
	c = []
	for (let i = -n; i < n + 1; i++) {
		c.push([i, Complex.mul(new Complex(1 / T), complexIntegrate(z(f, i), 0, T, 1000))]);
	}
	return c
}

t = linspace(-2 * pi, 2 * pi, 600)

var i = 1
var refreshIntervalId = setInterval(() => {
	p = new Plot()
	p.setLims([-6.28, -.2, 6.28, 1.2])
	p.draw(t, t.map(x => ((x + 2 * pi) % (2 * pi) < pi ? 1 : 0)), { 'color': 'white' })
	c = getFourierConstants(i)
	y = t.map((x) => {
		return (c.map(k => {
			return k[1].mul(exp(new Complex(0, x * k[0]))).real
		}).reduce((a, b) => (a + b), 0))
	})
	p.draw(t, y, { 'color': `hsl(${360 * i / 15}deg, 50%,50%)` })
	if (i == 15) clearInterval(refreshIntervalId);
	i += 2
}, 100)
