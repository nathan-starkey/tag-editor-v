export function transformDataIn(data: any): {} {
  data = JSON.parse(JSON.stringify(data));

  if (typeof data == "object" && data != null) {
    if (Array.isArray(data.creatures)) {
      data.creatures.forEach(creature => {
        if (typeof creature == "object" && creature != null && Array.isArray(creature.health)) {
          creature.healthMin = creature.health[0];
          creature.healthMax = creature.health[1];
          delete creature.health;
        }

        if (typeof creature == "object" && creature != null && Array.isArray(creature.damage)) {
          creature.damageMin = creature.damage[0];
          creature.damageMax = creature.damage[1];
          delete creature.damage;
        }
      });
    }

    if (Array.isArray(data.world)) {
      data.worlds.forEach(world => {
        if (typeof world == "object" && world != null && Array.isArray(world.chunks)) {
          world.chunks.forEach(chunk => {
            if (typeof chunk == "object" && chunk != null && Array.isArray(chunk.data)) {
              chunk.data = chunk.data.join(",");
            }
          });
        }
      });
    }
  }

  return data;
}

export function transformDataOut(data: any): {} {
  data = JSON.parse(JSON.stringify(data));

  data.creatures.forEach(creature => {
    creature.health = [creature.healthMin, creature.healthMax];
    delete creature.healthMin;
    delete creature.healthMax;
    
    creature.damage = [creature.damageMin, creature.damageMax];
    delete creature.damageMin;
    delete creature.damageMax;
  });

  data.worlds.forEach(world => {
    const chunkDataSize = world.chunkWidth * world.chunkHeight;

    world.chunks.forEach(chunk => {
      chunk.data = chunk.data.split(",");
      chunk.data.length = chunkDataSize;

      for (let i = 0; i < chunkDataSize; ++i) {
        chunk.data[i] = Number(chunk.data[i]) || 0;
      }
    });
  });

  return data;
}