import "reflect-metadata";
import { createConnection } from "typeorm";
import express, { Request, Response } from "express";
import { Courses } from "./entity/courses";

interface userInputs {
  title: string;
  status: string;
}
const validationsSchema = (input: userInputs) => {
  const errors: string[] = [];
  if (!input.title) {
    errors.push("Title is mandatory");
  }
  if (!input.status) {
    errors.push("Course status is mandatory");
  }
  return errors;
};

createConnection()
  .then(async (connection) => {
    const coursesRepository = connection.getRepository(Courses);

    const app = express();
    app.use(express.json());

    // Create
    app.post("/create/courses", async (req: Request, res: Response) => {
      const errors = validationsSchema(req.body);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      const courses = coursesRepository.create(req.body);
      const result = await coursesRepository.save(courses);
      res.send(result);
    });

    //Read all
    app.get("/get/courses", async (req: Request, res: Response) => {
      const courses = await coursesRepository.find();
      res.send(courses);
    });

    // Update
    app.put("/update/courses/:id", async (req: Request, res: Response) => {
      let user = await coursesRepository.findOne(req.params.id);
      if (user) {
        coursesRepository.merge(user, req.body);
        const result = await coursesRepository.save(user);
        res.send(result);
      } else {
        res.status(404).send("User not found");
      }
    });

    //Delete
    app.delete("/delete/courses/:id", async (req: Request, res: Response) => {
      try {
        const result = await coursesRepository.update(req.params.id, {
          is_deleted: true,
        });

        if (result.affected === 0) {
          return res.status(404).send({ message: "Course not found" });
        }

        const data = {
          result,
          message: "Course deleted successfully",
        };
        res.send(data);
      } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    app.listen(3400, () => {
      console.log("Server is running on port 3400");
    });
  })
  .catch((error) => console.log(error));
