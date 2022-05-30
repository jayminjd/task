const express = require("express");
const app = express();
const db = require("./config");
const validation = require("./validation");
const schemaValidator = require("./SchemaValidator");
const path = require("path");

app.use(express.json());

const pathName = path.join("/home/jd/task/images/MicrosoftTeams-image.png");

app.get("/alluser", async (req, res) => {
  const data = await db.query("select * from public.user");
  return res.json({
    data: data.rows,
    message: "get api",
  });
});

app.get("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await db.query(
      `select * from public.user as u left join public.profile as p on u.id=p.user_id  where id=${id}`
    );
    return res.json({
      data: data.rows,
      message: "get api",
    });
  } catch (e) {
    res.json({
      error: e,
    });
  }
});

app.post(
  "/user",
  schemaValidator(validation.validateUser, "body"),
  async (req, res) => {
    try {
      const reqData = req.body;
      const userData = await db.query(
        "insert into public.user (first_name,last_name,email,phone,address) values($1,$2,$3,$4,$5) returning *",
        [
          reqData.first_name,
          reqData.last_name,
          reqData.email,
          reqData.phone,
          reqData.address,
        ]
      );

      const data = await db.query(
        "insert into public.profile (profile_link,user_id) VALUES($1,$2) returning *",
        [pathName, userData.rows[0].id]
      );
      return res.json({
        data: userData.rows[0],
        link: data.rows[0],
        message: "post api",
      });
    } catch (e) {
      res.json({
        error: e,
      });
    }
  }
);

app.put(
  "/user/:id",
  schemaValidator(validation.validateUser, "body"),
  async (req, res) => {
    try {
      const reqData = req.body;
      const id = req.params.id;
      const data = await db.query(
        `update public.user set first_name='${reqData.first_name}',last_name='${reqData.last_name}',email='${reqData.email}',phone='${reqData.phone}',address='${reqData.address}' where id=${id} returning *`
      );
      if (data.rows.length == 0) throw new Error("update failed");
      return res.json({
        data: data.rows[0],
        message: "put api",
      });
    } catch (e) {
      res.json({
        error: e,
      });
    }
  }
);

app.delete("/user/:id", async (req, res) => {
  const id = req.params.id;
  const data = await db.query(
    `delete from public.user where id=${id} returning *`
  );
  return res.json({
    data: data.rows[0],
    message: "delete api",
  });
});

app.listen(3000, () => {
  console.log("server running");
});
