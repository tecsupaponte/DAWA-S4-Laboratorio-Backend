import { PrismaClient } from "@prisma/client";
const Pusher = require("pusher");

const prisma = new PrismaClient();

const pusher = new Pusher({
    appId: "1484095",
    key: "4d0a96313f45b49b51d7",
    secret: "b632096da0828a3ffed7",
    cluster: "us2",
    useTLS: true
  });

export const findAll = async (_req, res) => {

    try {
        const users = await prisma.user.findMany();

        res.json({
            ok: true,
            data: users
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            data: error.message
        });
    }
};

const findOne = async (email) => {

    try {
        return await prisma.user.findFirst({ where: { email } });
    } catch (error) {
        return null;
    }
};

export const store = async (req, res) => {

    try {
        const { body } = req;

        const userByEmail = await findOne(body.email);

        if (userByEmail) {
            return res.json({
                ok: true,
                data: userByEmail
            });
        }

        body.profile_url = `https://avatars.dicebear.com/api/avataaars/${body.name}.svg`;

        const user = await prisma.user.create({
            data: {
                ...body,
            }
        });

        pusher.trigger("my-chat", "my-list-contacts", {
            message: "Call to update list contacts"
        })

        res.status(201).json({
            ok: true,
            data: user
        });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            ok: false,
            data: error.message
        });
        console.log(error.message)
    }
};
