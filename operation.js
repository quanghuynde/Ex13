const { MongoClient, ObjectId } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "node-demoexpress";

const client = new MongoClient(url);

async function connectDB() {
    await client.connect();
    return client.db(dbName);
}

// Các hàm thao tác MongoDB tiêu chuẩn (dboper)
const insertDocument = async (db, document, collection) => {
    const coll = db.collection(collection);
    return await coll.insertOne(document);
};

const findDocuments = async (db, collection) => {
    const coll = db.collection(collection);
    return await coll.find({}).toArray();
};

const updateDocument = async (db, document, update, collection) => {
    const coll = db.collection(collection);
    console.log("Updated the document with ", update);
    return await coll.updateOne(document, { $set: update });
};

const removeDocument = async (db, document, collection) => {
    const coll = db.collection(collection);
    return await coll.deleteOne(document);
};

// GET all articles
async function getArticles() {
    const db = await connectDB();
    const articles = await findDocuments(db, "articles");
    console.log("Found Documents:\n", articles);
    return articles;
}

// GET article by ID
async function getArticleById(id) {
    const db = await connectDB();
    const article = await db.collection("articles").findOne({
        _id: new ObjectId(id)
    });
    return article;
}

// POST article
async function createArticle(article) {
    const db = await connectDB();
    const result = await insertDocument(db, article, "articles");
    const docs = await findDocuments(db, "articles");
    console.log("Found Documents:\n", docs);
    return {
        _id: result.insertedId,
        ...article
    };
}

// PUT article
async function updateArticle(id, article) {
    const db = await connectDB();
    const result = await updateDocument(
        db,
        { _id: new ObjectId(id) },
        article,
        "articles"
    );
    const docs = await findDocuments(db, "articles");
    console.log("Found Updated Documents:\n", docs);
    return result;
}

// DELETE article
async function deleteArticle(id) {
    const db = await connectDB();
    const result = await removeDocument(
        db,
        { _id: new ObjectId(id) },
        "articles"
    );
    return result;
}

// Hàm main chạy thử nghiệm trong Terminal giống mẫu trong ảnh
async function main() {
    const connClient = await MongoClient.connect(url);
    console.log("Connected correctly to server");
    const db = connClient.db(dbName);

    try {
        const insertResult = await insertDocument(
            db,
            {
                title: "Exploring the Hidden Gems of Paris",
                author: "Jane Doe"
            },
            "articles"
        );
        let docs = await findDocuments(db, "articles");
        console.log("Found Documents:\n", docs);

        const updateResult = await updateDocument(
            db,
            { title: "Exploring the Hidden Gems of Paris" },
            { content: "Paris is known for its ..." },
            "articles"
        );
        docs = await findDocuments(db, "articles");
        console.log("Found Updated Documents:\n", docs);
    } catch (err) {
        console.error(err);
    } finally {
        await connClient.close();
    }
}

// Nếu chạy trực tiếp file operation.js (node operation.js) sẽ tự chạy hàm main()
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    insertDocument,
    findDocuments,
    updateDocument,
    removeDocument,
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
};
