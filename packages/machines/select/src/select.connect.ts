import { NormalizeProps, type PropTypes } from "@zag-js/types"
import { State, Send } from "./select.types"
import { dom } from "./select.dom"

export function connect<T extends PropTypes>(state: State, send: Send, normalize: NormalizeProps<T>) {
  return {
    rootProps: normalize.element({}),
  }
}
