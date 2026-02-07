export type Monster = { name: string; emotion: "sad" | "happy" | "angry" };

export const monsterDisplayFactory = (
  display: (...data: unknown[]) => void,
  monster: Monster,
) => {
  if (monster.emotion === "angry") {
    return display(`${monster.name}: ARRRGGGHGHHHHHH ${monster.emotion}`);
  }
  if (monster.emotion === "sad") {
    return display(`${monster.name}: ughhh* thats mean ${monster.emotion}`);
  }
  if (monster.emotion === "happy") {
    return display(`${monster.name}: Happy me!!! ${monster.emotion}`);
  }
};
