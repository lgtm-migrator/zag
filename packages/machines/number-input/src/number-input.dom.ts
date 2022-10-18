import { isSafari, MAX_Z_INDEX, supportsPointerEvent } from "@zag-js/dom-utils"
import { roundToDevicePixel, wrap } from "@zag-js/number-utils"
import type { EventMap, MachineContext as Ctx } from "./number-input.types"
import { defineHelpers } from "@zag-js/dom-query"

export const dom = defineHelpers({
  getRootId: (ctx: Ctx) => ctx.ids?.root ?? `number-input:${ctx.id}`,
  getInputId: (ctx: Ctx) => ctx.ids?.input ?? `number-input:${ctx.id}:input`,
  getIncButtonId: (ctx: Ctx) => ctx.ids?.incBtn ?? `number-input:${ctx.id}:inc-btn`,
  getDecButtonId: (ctx: Ctx) => ctx.ids?.decBtn ?? `number-input:${ctx.id}:dec-btn`,
  getScrubberId: (ctx: Ctx) => ctx.ids?.scrubber ?? `number-input:${ctx.id}:scrubber`,
  getCursorId: (ctx: Ctx) => `number-input:${ctx.id}:cursor`,
  getLabelId: (ctx: Ctx) => ctx.ids?.label ?? `number-input:${ctx.id}:label`,

  getInputEl: (ctx: Ctx) => dom.getById<HTMLInputElement>(ctx, dom.getInputId(ctx)),
  getIncButtonEl: (ctx: Ctx) => dom.getById<HTMLButtonElement>(ctx, dom.getIncButtonId(ctx)),
  getDecButtonEl: (ctx: Ctx) => dom.getById<HTMLButtonElement>(ctx, dom.getDecButtonId(ctx)),
  getScrubberEl: (ctx: Ctx) => dom.getById(ctx, dom.getScrubberId(ctx)),
  getCursorEl: (ctx: Ctx) => dom.getDoc(ctx).getElementById(dom.getCursorId(ctx)),

  getRootEl: (ctx: Ctx) => {
    const rootEl = dom.getById(ctx, dom.getRootId(ctx))
    if (!rootEl) throw new Error("Root element does not exist")
    return rootEl
  },

  emitter: (ctx: Ctx) => dom.createEmitter<EventMap>(ctx, () => dom.getRootEl(ctx)),
  listener: (ctx: Ctx) => dom.createListener<EventMap>(() => dom.getRootEl(ctx)),

  getActiveButton: (ctx: Ctx, hint = ctx.hint) => {
    let btnEl: HTMLButtonElement | null = null
    if (hint === "increment") {
      btnEl = dom.getIncButtonEl(ctx)
    }
    if (hint === "decrement") {
      btnEl = dom.getDecButtonEl(ctx)
    }
    return btnEl
  },

  setupVirtualCursor(ctx: Ctx) {
    if (isSafari() || !supportsPointerEvent()) return
    dom.createVirtualCursor(ctx)
    return () => {
      dom.getCursorEl(ctx)?.remove()
    }
  },

  preventTextSelection(ctx: Ctx) {
    const doc = dom.getDoc(ctx)
    const html = doc.documentElement
    const body = doc.body

    body.style.pointerEvents = "none"
    html.style.userSelect = "none"
    html.style.cursor = "ew-resize"

    return () => {
      body.style.pointerEvents = ""
      html.style.userSelect = ""
      html.style.cursor = ""
      if (!html.style.length) {
        html.removeAttribute("style")
      }
      if (!body.style.length) {
        body.removeAttribute("style")
      }
    }
  },

  getMousementValue(ctx: Ctx, event: MouseEvent) {
    const x = roundToDevicePixel(event.movementX)
    const y = roundToDevicePixel(event.movementY)

    let hint = x > 0 ? "increment" : x < 0 ? "decrement" : null

    if (ctx.isRtl && hint === "increment") hint = "decrement"
    if (ctx.isRtl && hint === "decrement") hint = "increment"

    const point = {
      x: ctx.scrubberCursorPoint!.x + x,
      y: ctx.scrubberCursorPoint!.y + y,
    }

    const win = dom.getWin(ctx)
    const width = win.innerWidth
    const half = roundToDevicePixel(7.5)
    point.x = wrap(point.x + half, width) - half

    return { hint, point }
  },

  createVirtualCursor(ctx: Ctx) {
    const doc = dom.getDoc(ctx)
    const el = doc.createElement("div")
    el.className = "scrubber--cursor"
    el.id = dom.getCursorId(ctx)

    Object.assign(el.style, {
      width: "15px",
      height: "15px",
      position: "fixed",
      pointerEvents: "none",
      left: "0px",
      top: "0px",
      zIndex: MAX_Z_INDEX,
      transform: ctx.scrubberCursorPoint
        ? `translate3d(${ctx.scrubberCursorPoint.x}px, ${ctx.scrubberCursorPoint.y}px, 0px)`
        : undefined,
      willChange: "transform",
    })

    el.innerHTML = `
        <svg width="46" height="15" style="left: -15.5px; position: absolute; top: 0; filter: drop-shadow(rgba(0, 0, 0, 0.4) 0px 1px 1.1px);">
          <g transform="translate(2 3)">
            <path fill-rule="evenodd" d="M 15 4.5L 15 2L 11.5 5.5L 15 9L 15 6.5L 31 6.5L 31 9L 34.5 5.5L 31 2L 31 4.5Z" style="stroke-width: 2px; stroke: white;"></path>
            <path fill-rule="evenodd" d="M 15 4.5L 15 2L 11.5 5.5L 15 9L 15 6.5L 31 6.5L 31 9L 34.5 5.5L 31 2L 31 4.5Z"></path>
          </g>
        </svg>`

    doc.body.appendChild(el)
  },
})
