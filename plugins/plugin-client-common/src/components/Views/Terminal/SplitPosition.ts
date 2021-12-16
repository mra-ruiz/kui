/*
 * Copyright 2021 The Kubernetes Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * 1. Every split has a position whose type is SplitPosition
 * 2. A tab has an OccupancyVector that maps a SplitPosition to the number of splits in that position
 * 3. Given an initial occupancy state O1 and a split is in position P1, to know its next position, we call `P2 = nextPosition(O1, P1)`
 * 4. Given an initial occupancy state O1, to actuate a change of a split from position P1 to P2, call `O2 = togglePositions(O1, P1, P2)`
 * */

const enum SplitPosition {
  default = 0,
  right = 1,
  bottom = 2,
  left = 3
}

/**
 * WARNING: This array has to be parallel to SplitPosition.
 * Ex: When split is in the left position, icon rotates 270 degrees.
 * This is currently used in SplitHeader.tsx
 */
export const iconsArr = ['', 'kui--rotate-90', 'kui--rotate-180', 'kui--rotate-270']

/** Defines a number of splits in each position. We currently enforce an invariant[1] that there can
 * be at most one splits in any non-default position */
export type OccupancyVector = number[]

/** initializes an occupancy vector containing 1 default split, 0 right, 0 bottom, and 0 left splits */
export function initialSplit(): OccupancyVector {
  return [1, 0, 0, 0]
}

/** TODO */
function splitPositionLength(): number {
  // return (Object.keys(splitPos).length)
  return 4
}

function isOccupied(o1: OccupancyVector, p1: SplitPosition): boolean {
  return o1[p1] > 0
}

/** We have to find the next position while maintaining the invariant(see [1])
 * Because SplitPosition is implemented as cardinal numbers, we can use modular arithmetic
 * except for when maintaining the invariant(see [1])
 */
export function nextPosition(o1: OccupancyVector, p1: SplitPosition): SplitPosition {
  let candidatePosition = (p1 + 1) % splitPositionLength()

  while (candidatePosition !== SplitPosition.default && isOccupied(o1, candidatePosition)) {
    candidatePosition = (candidatePosition + 1) % splitPositionLength()
  }
  return candidatePosition
}

export function incrPosition(o1: OccupancyVector, p1: SplitPosition): OccupancyVector {
  const o2 = o1.slice()
  o2[p1]++
  return o2
}

/** TODO  */
export function decrPosition(o1: OccupancyVector, p1: SplitPosition): OccupancyVector {
  const o2 = o1.slice()
  o2[p1]--
  return o2
}

/** TODO */
export function isFull(o1: OccupancyVector): boolean {
  return o1.every(_ => isOccupied(o1, _))
}

/** TODO */
export function hasDefault(o1: OccupancyVector): boolean {
  return o1[SplitPosition.default] > 0
}

/** Changing the splits to different positions. Ex: bottom split -> left split */
export function togglePositions(
  o1: OccupancyVector,
  positionBefore: SplitPosition,
  positionAfter: SplitPosition
): OccupancyVector {
  const o2 = o1.slice()
  o2[positionBefore]--
  o2[positionAfter]++
  return o2
}

export interface SplitPositionProps {
  splitPositions: OccupancyVector
}

export default SplitPosition
