export async function allP(
  pPred: (elem: any) => Promise<boolean>,
  list: any[],
) {
  for (let i = 0; i < list.length; i++) {
    const pred = await pPred(list[i]);
    if (!pred) {
      return false;
    }
  }
  return true;
}
