import range from "range-python"

export const random = {
    randBytes(n: number): Uint16Array {
        return new Uint16Array(n).map(() => this.randInt(0, 255))
    },

    randRange(start: number, end?: number, step: number = 1): number {
        return this.choice([...range(start, end, step)])
    },

    randInt(a: number, b: number): number {
        return Math.floor(Math.random() * (b - a + 1)) + a
    },

    choice<T>(seq: T[]): T {
        return seq[Math.floor(Math.random() * seq.length)]
    },

    choices<T>(population: T[], weights: number[], opts?: {
        cumWeights?: number[]
        k?: number
    }): T[] {
        if (opts === undefined)
            opts = {
                k: 1
            }

        if (opts.k === undefined)
            opts.k = 1

        if (opts.cumWeights === undefined)
            opts.cumWeights = weights.map((w, i) => w + (i > 0 ? weights[i - 1] : 0))

        const choices: T[] = []

        for (let i = 0; i < opts.k; i++) {
            const r = Math.random() * opts.cumWeights[opts.cumWeights.length - 1]
            const idx = opts.cumWeights.findIndex((w) => w >= r)
            choices.push(population[idx])
        }

        return choices
    },

    shuffle<T>(seq: T[]): void {
        for (let i = seq.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)),
                tmp = seq[i]
            seq[i] = seq[j]
            seq[j] = tmp
        }
    },

    sample(population: number[], k: number, opts?: {
        counts?: boolean
    }): number[] {
        if (opts === undefined)
            opts = {
                counts: false
            }

        if (opts.counts === undefined)
            opts.counts = false

        if (opts.counts) {
            const counts: number[] = []
            for (let i = 0; i < population.length; i++)
                counts[population[i]] = (counts[population[i]] || 0) + 1
            return counts
        }

        const sample: number[] = [],
            n = population.length,
            k_ = Math.min(k, n),
            indices = [...range(n)]

        for (let i = 0; i < k_; i++) {
            const idx = Math.floor(Math.random() * indices.length)
            sample.push(population[indices[idx]])
            indices.splice(idx, 1)
        }

        return sample
    },

    random(): number {
        return Math.random()
    },

    uniform(a: number, b: number): number {
        return a + (b - a) * Math.random()
    },

    triangular(low: number, high: number, mode: number): number {
        const u = Math.random()
        if (u < (mode - low) / (high - low))
            return low + Math.sqrt(u * (high - low) * (mode - low))
        return high - Math.sqrt((1 - u) * (high - low) * (high - mode))
    },

    betavariate(alpha: number, beta: number): number {
        const u1 = Math.random(),
            u2 = Math.random()
        return u1 ** (1 / alpha) * u2 ** (1 / beta)
    },

    expovariate(lambd: number): number {
        const u = Math.random()
        return -Math.log(1 - u) / lambd
    },

    gammavariate(alpha: number, beta: number): number {
        const u = Math.random()
        return alpha * Math.exp(-1 * beta * Math.log(u))
    },

    gauss(mu: number, sigma: number): number {
        const u1 = Math.random(),
            u2 = Math.random()
        return mu + sigma * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    },

    lognormvariate(mu: number, sigma: number): number {
        return Math.exp(this.gauss(mu, sigma))
    },

    normalvariate(mu: number, sigma: number): number {
        return this.gauss(mu, sigma)
    },

    vonmisesvariate(mu: number, kappa: number): number {
        const u1 = Math.random(),
            u2 = Math.random(),
            r = Math.sqrt(-2 * Math.log(u1)),
            t = 2 * Math.PI * u2,
            z = r * Math.cos(t),
            f = kappa * Math.sin(t)

        return mu + z * f
    },

    paretovariate(alpha: number): number {
        const u = Math.random()
        return 1 / (1 - u) ** (1 / alpha)
    },

    weibullvariate(alpha: number, beta: number): number {
        const u = Math.random()
        return alpha * (-Math.log(1 - u)) ** (1 / beta)
    }
}

export default random
