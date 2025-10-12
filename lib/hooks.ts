import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../app/store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const Dispatch = useDispatch as () => AppDispatch
export const Selector = useSelector as <TState = RootState, TSelected = unknown>(
    selector: (state: TState) => TSelected,
    equalityFn?: (left: TSelected, right: TSelected) => boolean
) => TSelected;