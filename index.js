const lit = c => i =>
  i.substring(0,1) === c
  ? { ok: true, taken: 1, parsed: c }
  : { ok: false, taken: 0, parsed: undefined }

const or = (a, b) => i => {
  let ar = a(i)
  return ar.ok ? ar : b(i)
}

const and = (a, b) => i => {
  let ar = a(i)
  if (!ar.ok) return ar
  let br = b(i.slice(ar.taken))
  return br.ok ? { ok: true, taken: ar.taken + br.taken, parsed: [ ar.parsed, br.parsed ] }
               : { ok: false, taken: ar.taken + br.taken, parsed: undefined }
}

const andi = index => (a, b) => i => {
  let { ok, taken, parsed } = and(a, b)(i)
  return ok ? { ok, taken, parsed: parsed[index] }
            : { ok, taken, parsed }
}

const andr = andi(1)
const andl = andi(0)

const between = (a, b, c) => andl(andr(a, b), c)

const then = f => p => i => {
  let { ok, taken, parsed } = p(i)
  return ok ? { ok, taken, parsed: f(parsed) }
            : { ok, taken, parsed }
}

const joinall = a =>
  typeof a === 'string' ? a :
    a.constructor === Array ?
      a.reduce((acc, b) => acc + joinall(b), '')
    : ''

const str = s =>
  s.length > 1 ?
    then( joinall )
        ( s.split('').slice(1).map(lit).reduce( and, lit(s.substring(0, 1)) ) )
  : lit(s)

const many = s => i => {
  let taken = 0
  let acc = []
  for ( let c = s(i); c.ok; c = s(i.slice(taken += c.taken)) ) {
    acc.push(c.parsed)
  }
  return { ok: true, taken, parsed: acc }
}

// bitwise and-eq helper fn
const bw_ae = (a, b, c) => { a[b] &= c(a); return a }
const many1 = s => i => bw_ae(many(s)(i), 'ok', ({taken}) => taken > 0)

const letter = i => {
  let r = /^[a-zA-Z]/.exec(i)
  return r ? { ok: true, taken: 1, parsed: r[0] }
           : { ok: false, taken: 0, parsed: undefined }
}

const thenJoin = a => then(b => b.join(''))(a)

const letters = thenJoin(many(letter))
const letters1 = thenJoin(many1(letter))

const oneOf = a =>
  (a.constructor === Array ? a : a.split('')).map(lit).reduce(or)

const noneOf = a => i =>
  (a.constructor === Array ? a : a.split('')).indexOf(i.charAt(0)) === -1
  ? { ok: true, taken: 1, parsed: i.charAt(0) }
  : { ok: false, taken: 0, parsed: undefined }

manyOneOf = a => thenJoin(many(oneOf(a)))
manyNoneOf = a => thenJoin(many(noneOf(a)))

many1OneOf = a => thenJoin(many1(oneOf(a)))
many1NoneOf = a => thenJoin(many1(noneOf(a)))

module.exports = {
  lit, or, and, andi, andr, andl, between, then, str, many, many1, letter, thenJoin,
  letters, letters1, oneOf, noneOf, manyOneOf, many1OneOf, manyNoneOf, many1NoneOf
}
