import { defineHelpers } from "@zag-js/dom-query"

import type { MachineContext as Ctx } from "./pressable.types"

export const dom = defineHelpers({
  getPressableId: (ctx: Ctx) => `pressable:${ctx.id}`,
  getPressableEl: (ctx: Ctx) => dom.getById(ctx, dom.getPressableId(ctx)),
})
