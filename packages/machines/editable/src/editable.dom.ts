import { defineHelpers } from "@zag-js/dom-query"
import type { EventMap, MachineContext as Ctx } from "./editable.types"

export const dom = defineHelpers({
  getRootId: (ctx: Ctx) => ctx.ids?.root ?? `editable:${ctx.id}`,
  getAreaId: (ctx: Ctx) => ctx.ids?.area ?? `editable:${ctx.id}:area`,
  getLabelId: (ctx: Ctx) => ctx.ids?.label ?? `editable:${ctx.id}:label`,
  getPreviewId: (ctx: Ctx) => ctx.ids?.preview ?? `editable:${ctx.id}:preview`,
  getInputId: (ctx: Ctx) => ctx.ids?.input ?? `editable:${ctx.id}:input`,
  getControlGroupId: (ctx: Ctx) => ctx.ids?.controlGroup ?? `editable:${ctx.id}:controls`,
  getSubmitBtnId: (ctx: Ctx) => ctx.ids?.submitBtn ?? `editable:${ctx.id}:submit-btn`,
  getCancelBtnId: (ctx: Ctx) => ctx.ids?.cancelBtn ?? `editable:${ctx.id}:cancel-btn`,
  getEditBtnId: (ctx: Ctx) => ctx.ids?.editBtn ?? `editable:${ctx.id}:edit-btn`,

  getInputEl: (ctx: Ctx) => dom.getById<HTMLInputElement>(ctx, dom.getInputId(ctx)),
  getPreviewEl: (ctx: Ctx) => dom.getById<HTMLInputElement>(ctx, dom.getPreviewId(ctx)),
  getSubmitBtnEl: (ctx: Ctx) => dom.getById<HTMLButtonElement>(ctx, dom.getSubmitBtnId(ctx)),
  getCancelBtnEl: (ctx: Ctx) => dom.getById<HTMLButtonElement>(ctx, dom.getCancelBtnId(ctx)),
  getEditBtnEl: (ctx: Ctx) => dom.getById<HTMLButtonElement>(ctx, dom.getEditBtnId(ctx)),
  getRootEl: (ctx: Ctx) => {
    const rootEl = dom.getById(ctx, dom.getRootId(ctx))
    if (!rootEl) throw new Error("Root element does not exist")
    return rootEl
  },

  emitter: (ctx: Ctx) => dom.createEmitter<EventMap>(ctx, () => dom.getRootEl(ctx)),
  listener: (ctx: Ctx) => dom.createListener<EventMap>(() => dom.getRootEl(ctx)),
})
