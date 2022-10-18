import { defineHelpers } from "@zag-js/dom-query"
import type { EventMap, MachineContext as Ctx } from "./checkbox.types"

export const dom = defineHelpers({
  getRootId: (ctx: Ctx) => ctx.ids?.root ?? `checkbox:${ctx.id}`,
  getLabelId: (ctx: Ctx) => ctx.ids?.label ?? `checkbox:${ctx.id}:label`,
  getControlId: (ctx: Ctx) => ctx.ids?.control ?? `checkbox:${ctx.id}:control`,
  getInputId: (ctx: Ctx) => ctx.ids?.input ?? `checkbox:${ctx.id}:input`,

  getRootEl: (ctx: Ctx) => {
    const rootEl = dom.getById(ctx, dom.getRootId(ctx))
    if (!rootEl) throw new Error("Root element does not exist")
    return rootEl
  },
  getInputEl: (ctx: Ctx) => dom.getById<HTMLInputElement>(ctx, dom.getInputId(ctx)),

  emitter: (ctx: Ctx) => dom.createEmitter<EventMap>(ctx, dom.getRootEl(ctx)),
  listener: (ctx: Ctx) => dom.createListener<EventMap>(dom.getRootEl(ctx)),
})
