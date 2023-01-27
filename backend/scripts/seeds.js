require("../models/User");
require("../models/Item");
require("../models/Comment");

const mongoose = require("mongoose");
const isProduction = process.env.NODE_ENV === "production";

mongoose.connect(process.env.MONGODB_URI);
if (!isProduction) {
    mongoose.set("debug", true);
}

const Item = mongoose.model("Item");
const Comment = mongoose.model("Comment");
const User = mongoose.model("User");

async function SeedDB() {
    const users = [];
    for (let i = 0; i < 100; i++) {
        const username = Math.random().toString().substring(2);
        users.push(User.create({
            email: username + "@hotmail.com",
            username: username,
        }));
    }

    await Promise.all(users);

    const items = [];
    for (let i = 0; i < 100; i++) {
        const title = Math.random().toString().substring(2);
        items.push(Item.create({
            title: title,
            description: title.substring(0, 5),
            seller: await users[i],
        }));
    }

    await Promise.all(items);

    const comments = [];
    for (let i = 0; i < 100; i++) {
        const body = Math.random().toString().substring(2);
        comments.push(Comment.create({
            body,
            seller: await users[i + 1 % 100],
            item: await items[i],
        }));
    }

    await Promise.all([...comments, ...items, ...users]);
    await mongoose.disconnect();
}

SeedDB().then(() => {
    console.log('Finished!')
});