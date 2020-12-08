// testing custom hooks
// http://localhost:3000/counter-hook

import * as React from 'react'
import {render, screen, act} from '@testing-library/react'
import {renderHook, act as actHook} from '@testing-library/react-hooks'
import userEvent from '@testing-library/user-event'
import useCounter from '../../components/use-counter'

const setup = (...args) => {
  // A new object is used here to ensure that the binding to the result is captured properly between re-renders
  const returnVal = {}
  function TestFakeCounter() {
    Object.assign(returnVal, useCounter(...args))
    return null
  }
  render(<TestFakeCounter />)
  return returnVal
}

const TestCounter = () => {
  const {count, increment, decrement} = useCounter()
  return (
    <div>
      <div>Current count: {count}</div>
      <button onClick={decrement}>Decrement</button>
      <button onClick={increment}>Increment</button>
    </div>
  )
}

test('exposes the count and increment/decrement functions using Component', () => {
  render(<TestCounter />)
  const increment = screen.getByRole('button', {name: /increment/i})
  const decrement = screen.getByRole('button', {name: /decrement/i})
  const message = screen.getByText(/current count/i)

  expect(message.textContent).toBe('Current count: 0')

  userEvent.click(increment)
  expect(message.textContent).toBe('Current count: 1')

  userEvent.click(decrement)
  expect(message.textContent).toBe('Current count: 0')
})

test('exposes the count and increment/decrement functions using Fake Component', () => {
  // Testing hooks with a fake component if the complexity of creating the component is high especially when testing edge cases
  let counterData
  function TestFakeCount() {
    counterData = useCounter()
    return null
  }
  render(<TestFakeCount />)
  expect(counterData.count).toBe(0)
  act(() => {
    counterData.increment()
  })
  expect(counterData.count).toBe(1)

  act(() => {
    counterData.decrement()
  })
  expect(counterData.count).toBe(0)
})

test('exposes the count and increment/decrement functions using setup function with initialCount', () => {
  // Testing hooks with a fake component if the complexity of creating the component is high especially when testing edge cases
  const counterData = setup({
    initialCount: 3,
  })

  expect(counterData.count).toBe(3)
  act(() => {
    counterData.increment()
  })
  expect(counterData.count).toBe(4)

  act(() => {
    counterData.decrement()
  })
  expect(counterData.count).toBe(3)
})

test('exposes the count and increment/decrement functions using setup function with step', () => {
  // Testing hooks with a fake component if the complexity of creating the component is high especially when testing edge cases
  const counterData = setup({
    step: 2,
  })

  expect(counterData.count).toBe(0)
  act(() => {
    counterData.increment()
  })
  expect(counterData.count).toBe(2)

  act(() => {
    counterData.decrement()
  })
  expect(counterData.count).toBe(0)
})

test('exposes the count and increment/decrement functions using renderHooks', () => {
  const {result} = renderHook(useCounter)
  expect(result.current.count).toBe(0)
  actHook(() => {
    result.current.increment()
  })
  expect(result.current.count).toBe(1)

  actHook(() => {
    result.current.decrement()
  })
  expect(result.current.count).toBe(0)
})

test('exposes the count and increment/decrement functions using renderHooks with steps changed', () => {
  const {result, rerender} = renderHook(useCounter, {initialProps: {step: 3}})
  expect(result.current.count).toBe(0)
  actHook(() => {
    result.current.increment()
  })
  expect(result.current.count).toBe(3)

  rerender({step: 2})
  actHook(() => {
    result.current.decrement()
  })
  expect(result.current.count).toBe(1)
})

/* eslint no-unused-vars:0 */
