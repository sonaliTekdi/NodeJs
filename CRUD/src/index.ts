import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { Request, Response } from "express";
import { User } from "./entity/User";

createConnection()
  .then(async (connection) => {
    const userRepository = connection.getRepository(User);

    const app = express();
    app.use(express.json());

    // Create
    app.post("/create/users", async (req: Request, res: Response) => {
      const user = userRepository.create(req.body);
      const result = await userRepository.save(user);
      res.send(result);
    });

    // Read all
    app.get("/get/users", async (req: Request, res: Response) => {
      const users = await userRepository.find();
      res.send(users);
    });

    // Read one
    app.get("/get/users/:id", async (req: Request, res: Response) => {
      const user = await userRepository.findOne(req.params.id);
      res.send(user);
    });

    // Update
    app.put("/update/users/:id", async (req: Request, res: Response) => {
      let user = await userRepository.findOne(req.params.id);
      if (user) {
        userRepository.merge(user, req.body);
        const result = await userRepository.save(user);
        res.send(result);
      } else {
        res.status(404).send("User not found");
      }
    });

    // Delete
    app.delete("/delete/users/:id", async (req: Request, res: Response) => {
      const result = await userRepository.delete(req.params.id);
      res.send(result);
    });

    app.listen(3100, () => {
      console.log("Server is running on port 3100");
    });
  })
  .catch((error) => console.log(error));
