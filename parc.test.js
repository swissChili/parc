const {
  lit, or, and, andi, andr, andl, between, then, str, many, many1, letter, thenJoin,
  letters, letters1, oneOf, noneOf, manyOneOf, many1OneOf, manyNoneOf, many1NoneOf
} = require('./index')

test('lit', () => {
  expect(lit('a')('a'))
    .toEqual({ ok: true, taken: 1, parsed: 'a' })
})

test('str', () => {
  expect(str('abc')('abc'))
    .toEqual({ ok: true, taken: 3, parsed: 'abc' })
})

test('or', () => {
  expect(or(lit('a'), lit('b'))('a'))
    .toEqual({ ok: true, taken: 1, parsed: 'a' })
})

test('and', () => {
  expect(and(lit('a'), lit('b'))('ab'))
    .toEqual({ ok: true, taken: 2, parsed: ['a', 'b'] })
})

test('andi', () => {
  expect(andi(0)(lit('a'), lit('b'))('ab'))
    .toEqual({ ok: true, taken: 2, parsed: 'a' })
})

test('andr', () => {
  expect(andr(lit('a'), lit('b'))('ab'))
    .toEqual({ ok: true, taken: 2, parsed: 'b' })
})

test('andl', () => {
  expect(andl(lit('a'), lit('b'))('ab'))
    .toEqual({ ok: true, taken: 2, parsed: 'a' })
})

test('between', () => {
  expect(between(lit('a'), lit('b'), lit('c'))('abc'))
    .toEqual({ ok: true, taken: 3, parsed: 'b' })
})
