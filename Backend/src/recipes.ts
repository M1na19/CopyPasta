import { Request, Response } from "express";
import { prisma } from "../api";
import { UUID } from "crypto";
import { validationResult } from "express-validator";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function get_list(req: Request, res: Response) {
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ success: false });
    return;
  }

  let user = res.locals.username;
  try {
    let list = await prisma.privateList.findMany({
      where: {
        users: {
          username: user,
        },
      },
      include: {
        recipes: {
          select: {
            uuid: true,
            name: true,
            images: true,
            rating: true,
            users: {
              select: {
                username: true,
              },
            },
            types: {
              select: {
                name: true,
              },
            },
            cookingTime: true,
            difficulty: true,
            uploadTime: true,
          },
        },
      },
    });
    res.status(200).json({
      success: true,
      list: list.map((m) => m.recipes),
    });
  } catch (e) {
    res.status(500).json({
      success: false,
    });
  }
}
export async function get_types(req: Request, res: Response) {
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ success: false });
    return;
  }

  try {
    let types = await prisma.types.findMany({
      select: {
        name: true,
      },
    });
    res.status(200).json({
      success: true,
      types: types,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
    });
  }
}
export async function get_all_recipes(req: Request, res: Response) {
  try {
    let recipes = await prisma.recipes.findMany({
      select: {
        uuid: true,
        name: true,
        images: true,
        rating: true,
        users: {
          select: {
            username: true,
          },
        },
        types: {
          select: {
            name: true,
          },
        },
        cookingTime: true,
        difficulty: true,
        uploadTime: true,
      },
    });
    res.status(200).json({
      success: true,
      recipes: recipes,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
    });
  }
}
export async function get_recipe(req: Request, res: Response) {
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ success: false });
    return;
  }

  let uuid: UUID = req.query.uuid as UUID;
  try {
    let recipe = await prisma.recipes.findUniqueOrThrow({
      where: {
        uuid: uuid,
      },
      select: {
        uuid: true,
        name: true,
        rating: true,
        images: true,
        users: {
          select: {
            username: true,
          },
        },
        types: {
          select: {
            name: true,
          },
        },
        cookingTime: true,
        difficulty: true,
        description: true,
        uploadTime: true,
      },
    });
    res.status(200).json({
      success: true,
      recipe: recipe,
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code == "P2025") {
      res.status(400).json({ success: false, error: "Input not found in db" });
    } else {
      res.status(500).json({ success: false });
    }
  }
}
export async function get_all_reviews(req: Request, res: Response) {
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ success: false });
    return;
  }
  let uuid: UUID = req.query.uuid as UUID;
  try {
    let reviews = await prisma.reviews.findMany({
      where: {
        recipes: {
          uuid: uuid,
        },
      },
      select: {
        users: {
          select: {
            username: true,
          },
        },
        uploadTime: true,
        rating: true,
        comment: true,
      },
    });
    res.status(200).json({
      success: true,
      reviews: reviews,
    });
  } catch (e: any) {
    res.status(500).json({
      success: false,
    });
  }
}
export async function post_recipe(req: Request, res: Response) {
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ success: false });
    return;
  }

  let name = req.body.name;
  let author = res.locals.username;
  let images = req.body.images || null;
  let type = req.body.type;
  let cookTime = req.body.cookTime || null;
  let difficulty = req.body.difficulty || null;
  let description = req.body.description || null;

  try {
    let stringified: string | null = null;
    if (images != null) stringified = images.join(";");
    await prisma.recipes.create({
      data: {
        name: name,
        users: {
          connect: {
            username: author,
          },
        },
        uuid: crypto.randomUUID(),
        images: stringified,
        types: {
          connect: {
            name: type,
          },
        },
        cookingTime: cookTime,
        difficulty: difficulty,
        description: description,
      },
    });

    res.status(200).json({ success: true });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code == "P2025") {
      res.status(400).json({ success: false, error: "Input not found in db" });
    } else {
      console.log(e);
      res.status(500).json({ success: false });
    }
  }
}
export async function remove_recipe(req: Request, res: Response) {
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ success: false });
    return;
  }

  let uuid = req.body.uuid;
  try {
    await prisma.recipes.delete({
      where: {
        uuid: uuid,
      },
    });
    res.status(200).json({ success: true });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code == "P2025") {
      res.status(400).json({ success: false, error: "Input not found in db" });
    } else {
      res.status(500).json({ success: false });
    }
  }
}
export async function rate_recipe(req: Request, res: Response) {
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ success: false });
    return;
  }

  let uuid = req.body.uuid;
  let rating = req.body.rating;
  let comment = req.body.comment || null;
  let user = res.locals.username;
  try {
    await prisma.$transaction(async (prisma) => {
      await prisma.reviews.create({
        data: {
          recipes: {
            connect: {
              uuid: uuid,
            },
          },
          rating: rating,
          comment: comment,
          users: {
            connect: {
              username: user,
            },
          },
        },
      });
      const avgRating = await prisma.reviews.aggregate({
        where: {
          recipes: {
            uuid: uuid,
          },
        },
        _avg: { rating: true },
      });
      await prisma.recipes.update({
        where: {
          uuid: uuid,
        },
        data: {
          rating: avgRating._avg.rating,
        },
      });
    });
    res.status(200).json({ success: true });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code == "P2002") {
      res.status(403).json({ success: false, error: "Already reviewed" });
    } else if (
      e instanceof PrismaClientKnownRequestError &&
      e.code == "P2025"
    ) {
      res.status(400).json({ success: false, error: "Input not found in db" });
    } else {
      res.status(500).json({ success: false });
    }
  }
}
export async function add_type(req: Request, res: Response) {
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ success: false });
    return;
  }

  let type = req.body.type;
  try {
    await prisma.types.create({
      data: {
        name: type,
      },
    });
    res.status(200).json({ success: true });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code == "P2002") {
      res.status(400).json({
        success: false,
        error: "Type with the same name already exists",
      });
    } else {
      res.status(500).json({ success: false });
    }
  }
}

export async function add_favorite(req: Request, res: Response) {
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ success: false });
    return;
  }

  let uuid = req.body.uuid;
  let user = res.locals.username;
  try {
    await prisma.privateList.create({
      data: {
        users: {
          connect: {
            username: user,
          },
        },
        recipes: {
          connect: {
            uuid: uuid,
          },
        },
      },
    });
    res.status(200).json({ success: true });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code == "P2025") {
      res.status(400).json({ success: false, error: "Input not found in db" });
    } else {
      res.status(500).json({ success: false });
    }
  }
}
export async function remove_favorite(req: Request, res: Response) {
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ success: false });
    return;
  }

  let uuid = req.body.uuid;
  let user = res.locals.username;
  try {
    await prisma.privateList.deleteMany({
      where: {
        users: {
          username: user,
        },
        recipes: {
          uuid: uuid,
        },
      },
    });
    res.status(200).json({ success: true });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code == "P2025") {
      res.status(400).json({ success: false, error: "Input not found in db" });
    } else {
      res.status(500).json({ success: false });
    }
  }
}
