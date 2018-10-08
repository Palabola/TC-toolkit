const query_handler = require("./database_query_handler");
const Jimp = require("Jimp");

async function generate(map_id) {
  let npc_spawns = await query_handler.select_creature_by_map(map_id);

  let x_max = (x_min = npc_spawns[0].position_x);

  let y_max = (y_min = npc_spawns[0].position_y);

  npc_spawns.map(npc => {
    if (npc.position_x > x_max) {
      x_max = npc.position_x;
    }
    if (npc.position_x < x_min) {
      x_min = npc.position_x;
    }
    if (npc.position_y > y_max) {
      y_max = npc.position_y;
    }
    if (npc.position_y < y_min) {
      y_min = npc.position_y;
    }
  });

  console.log(x_max, y_max, x_min, y_min);

  let canvas_x = Math.abs(Math.floor(x_max - x_min));
  let canvas_y = Math.abs(Math.floor(y_max - y_min));

  console.log(canvas_x, canvas_y);

  let white = 0xfffc00ff; // 0x + RGB + 256 Alpha

  let font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);

  let image = new Jimp(canvas_y, canvas_x, "#000000", function(err, image) {
    if (err) throw err;

    npc_spawns.map(npc => {
      let y = canvas_x - Math.floor(Math.abs(x_min) + npc.position_x);
      let x = canvas_y - Math.floor(Math.abs(y_min) + npc.position_y);

      /* image.setPixelColor(white, x - 1, y);
      image.setPixelColor(white, x + 1, y);
      image.setPixelColor(white, x, y + 1);
      image.setPixelColor(white, x, y - 1);
      image.setPixelColor(white, x - 2, y);
      image.setPixelColor(white, x + 2, y);
      image.setPixelColor(white, x, y + 2);
      image.setPixelColor(white, x, y - 2);
      image.setPixelColor(white, x, y);*/

      image.print(font, x, y, npc.id);
    });

    image.write(map_id + "_map.png", err => {
      if (err) throw err;
      console.log("Generate done!");
    });
  });
}

generate(1643);
