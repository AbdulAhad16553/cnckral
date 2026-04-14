/** Group Bin rows from ERPNext by item_code into { totalStock, bins } */
export function aggregateBinsForItem(
  rows: any[] | undefined,
  itemCode: string
): { totalStock: number; bins: any[] } | null {
  const bins = (rows ?? []).filter((b: any) => b.item_code === itemCode);
  if (!bins.length) return null;
  return {
    totalStock: bins.reduce((t: number, b: any) => t + (b.actual_qty || 0), 0),
    bins,
  };
}
